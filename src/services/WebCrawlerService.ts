import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { CrawlRequest, CrawledPage, CrawlResult, WebCrawlerConfig, AppError } from '@/types';
import logger from '@/utils/logger';
import { sleep } from '@/utils/helpers';

export class WebCrawlerService {
  private static readonly defaultConfig: WebCrawlerConfig = {
    maxDepth: 3,
    maxPages: 50,
    delay: 1000, // 1 second delay between requests
    timeout: 30000, // 30 seconds timeout
    userAgent: 'ProfessionalWebCrawler/1.0 (+https://example.com/bot)',
    allowedDomains: [],
    excludePatterns: [
      '/search?',
      '/404',
      '/login',
      '/register',
      '/admin',
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.zip',
      '.rar',
      '.tar',
      '.gz',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.svg',
      '.ico',
      '.css',
      '.js',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot'
    ],
    includePatterns: [],
    followExternalLinks: false,
    respectRobotsTxt: true,
    maxConcurrent: 3
  };

  /**
   * Main crawl method that deep crawls a documentation site
   */
  static async crawlDocumentation(request: CrawlRequest): Promise<CrawlResult> {
    try {
      logger.info('Starting documentation crawl', { 
        url: request.url, 
        maxDepth: request.maxDepth,
        maxPages: request.maxPages 
      });

      const startTime = Date.now();
      const config = this.mergeConfig(request);
      
      // Validate and normalize the starting URL
      const baseUrl = this.normalizeUrl(request.url);
      const baseDomain = new URL(baseUrl).hostname;
      
      // If no allowed domains specified, use the base domain
      if (config.allowedDomains.length === 0) {
        config.allowedDomains = [baseDomain];
      }

      const visitedUrls = new Set<string>();
      const crawledPages: CrawledPage[] = [];
      const errors: Array<{ url: string; error: string; status?: number }> = [];
      const urlQueue: Array<{ url: string; depth: number }> = [{ url: baseUrl, depth: 0 }];

      // Crawl pages using BFS approach
      while (urlQueue.length > 0 && crawledPages.length < config.maxPages) {
        const batch = urlQueue.splice(0, config.maxConcurrent);
        const promises = batch.map(({ url, depth }) => 
          this.crawlSinglePage(url, depth, config, visitedUrls, errors)
        );

        const results = await Promise.allSettled(promises);
        
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const batchItem = batch[i];

          if (result && batchItem && result.status === 'fulfilled' && result.value) {
            const page = result.value;
            crawledPages.push(page);
            
            logger.debug('Page crawled successfully', { 
              url: page.url,
              depth: page.depth,
              totalPagesNow: crawledPages.length
            });
            
            // Extract and queue new URLs if we haven't reached max depth
            if (batchItem.depth < config.maxDepth) {
              const newUrls = this.extractUrls(page, baseDomain, config);
              
              let urlsAdded = 0;
              for (const newUrl of newUrls) {
                if (!visitedUrls.has(newUrl) && crawledPages.length + urlQueue.length < config.maxPages) {
                  urlQueue.push({ url: newUrl, depth: batchItem.depth + 1 });
                  urlsAdded++;
                  logger.debug('Added URL to queue', { 
                    url: newUrl, 
                    depth: batchItem.depth + 1,
                    queueSize: urlQueue.length 
                  });
                }
              }
              
              if (urlsAdded > 0) {
                logger.info('URLs queued for next depth', { 
                  newUrlsAdded: urlsAdded,
                  currentDepth: batchItem.depth,
                  nextDepth: batchItem.depth + 1,
                  totalQueueSize: urlQueue.length
                });
              }
            }
          } else if (result?.status === 'fulfilled') {
            logger.debug('Page returned null (likely already visited)', { 
              url: batchItem?.url
            });
          }

          // Respect rate limiting
          if (batch.length > 1) {
            await sleep(config.delay / config.maxConcurrent);
          }
        }

        // Delay between batches
        if (urlQueue.length > 0) {
          await sleep(config.delay);
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Calculate summary statistics
      const totalWords = crawledPages.reduce((sum, page) => sum + page.metadata.wordCount, 0);
      const uniqueDomains = [...new Set(crawledPages.map(page => new URL(page.url).hostname))];
      const maxDepthReached = Math.max(...crawledPages.map(page => page.depth));

      logger.info('Crawl completed', { 
        totalPages: crawledPages.length,
        totalWords,
        duration,
        errors: errors.length 
      });

      return {
        success: true,
        message: `Successfully crawled ${crawledPages.length} pages`,
        data: {
          pages: crawledPages,
          summary: {
            totalPages: crawledPages.length,
            totalWords,
            crawlDepth: maxDepthReached,
            crawlDuration: duration,
            uniqueDomains,
            errors
          }
        }
      };

    } catch (error) {
      logger.error('Error during crawl', error);
      throw new AppError('Failed to crawl documentation', 500);
    }
  }

  /**
   * Crawl a single page and extract all relevant information
   */
  private static async crawlSinglePage(
    url: string,
    depth: number,
    config: WebCrawlerConfig,
    visitedUrls: Set<string>,
    errors: Array<{ url: string; error: string; status?: number }>
  ): Promise<CrawledPage | null> {
    if (visitedUrls.has(url)) {
      return null;
    }

    visitedUrls.add(url);

    try {
      logger.debug('Crawling page', { url, depth });

      const response: AxiosResponse = await axios.get(url, {
        timeout: config.timeout,
        headers: {
          'User-Agent': config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 400
      });

      if (!response.headers['content-type']?.includes('text/html')) {
        logger.debug('Skipping non-HTML content', { url, contentType: response.headers['content-type'] });
        return null;
      }

      const $ = cheerio.load(response.data);
      
      // Extract page content and metadata
      const page = this.extractPageData($, url, depth, response.status);
      
      logger.debug('Successfully crawled page', { 
        url, 
        title: page.title, 
        wordCount: page.metadata.wordCount 
      });

      return page;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      
      logger.warn('Failed to crawl page', { url, error: errorMsg, status });
      errors.push({ url, error: errorMsg, ...(status && { status }) });
      
      return null;
    }
  }

  /**
   * Extract comprehensive data from a single page
   */
  private static extractPageData($: cheerio.CheerioAPI, url: string, depth: number, status: number): CrawledPage {
    // Extract title
    const title = $('title').first().text().trim() || 
                 $('h1').first().text().trim() || 
                 'Untitled';

    // Extract meta description
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       '';

    // Extract meta keywords
    const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
    const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(k => k) : [];

    // Extract author
    const author = $('meta[name="author"]').attr('content') ||
                  $('meta[property="article:author"]').attr('content') ||
                  '';

    // Extract dates
    const publishDate = $('meta[property="article:published_time"]').attr('content') ||
                       $('meta[name="date"]').attr('content') ||
                       $('time[datetime]').attr('datetime') ||
                       '';

    const lastModified = $('meta[property="article:modified_time"]').attr('content') ||
                        $('meta[name="last-modified"]').attr('content') ||
                        '';

    // Extract canonical URL
    const canonical = $('link[rel="canonical"]').attr('href') || '';

    // Extract language
    const language = $('html').attr('lang') || 
                    $('meta[http-equiv="content-language"]').attr('content') || 
                    'en';

    // Extract main content (remove scripts, styles, nav, footer, etc.)
    $('script, style, nav, footer, aside, .nav, .navigation, .sidebar, .footer, .header').remove();
    $('comment').remove();
    
    // Try to find main content area
    let contentElement = $('main').first();
    if (contentElement.length === 0) {
      contentElement = $('article').first();
    }
    if (contentElement.length === 0) {
      contentElement = $('.content, .main-content, .post-content, .entry-content, #content, #main').first();
    }
    if (contentElement.length === 0) {
      contentElement = $('body');
    }

    const content = contentElement.text().trim();
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    // Extract headings
    const headings: Array<{ level: number; text: string; id?: string }> = [];
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const $el = $(el);
      const level = parseInt(el.tagName.slice(1));
      const text = $el.text().trim();
      const id = $el.attr('id');
      
      if (text) {
        headings.push({ 
          level, 
          text, 
          ...(id && { id })
        });
      }
    });

    // Extract links
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    const baseDomain = new URL(url).hostname;

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const linkUrl = new URL(href, url).href;
          const linkDomain = new URL(linkUrl).hostname;
          
          if (linkDomain === baseDomain) {
            internalLinks.push(linkUrl);
          } else {
            externalLinks.push(linkUrl);
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    // Extract images
    const images: Array<{ src: string; alt?: string; title?: string }> = [];
    $('img[src]').each((_, el) => {
      const $img = $(el);
      const src = $img.attr('src');
      if (src) {
        try {
          const imgUrl = new URL(src, url).href;
          const alt = $img.attr('alt');
          const title = $img.attr('title');
          images.push({
            src: imgUrl,
            ...(alt && { alt }),
            ...(title && { title })
          });
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    return {
      url,
      title,
      content,
      metadata: {
        description,
        keywords,
        author,
        publishDate,
        lastModified,
        canonical,
        language,
        contentType: 'text/html',
        wordCount,
        links: {
          internal: [...new Set(internalLinks)],
          external: [...new Set(externalLinks)]
        },
        images,
        headings
      },
      crawledAt: new Date(),
      status,
      depth
    };
  }

  /**
   * Extract URLs from a crawled page for further crawling
   */
  private static extractUrls(
    page: CrawledPage,
    _baseDomain: string,
    config: WebCrawlerConfig
  ): string[] {
    const urls: string[] = [];
    
    logger.debug('Starting URL extraction', {
      pageUrl: page.url,
      totalInternalLinks: page.metadata.links.internal.length,
      followExternalLinks: config.followExternalLinks,
      allowedDomains: config.allowedDomains
    });
    
    // Use internal links if not following external links
    const linksToProcess = config.followExternalLinks 
      ? [...page.metadata.links.internal, ...page.metadata.links.external]
      : page.metadata.links.internal;

    for (const link of linksToProcess) {
      try {
        const linkUrl = new URL(link);
        
        logger.debug('Processing link', { 
          link, 
          hostname: linkUrl.hostname, 
          pathname: linkUrl.pathname,
          search: linkUrl.search,
          hash: linkUrl.hash
        });
        
        // Check domain restrictions
        if (config.allowedDomains.length > 0 && !config.allowedDomains.includes(linkUrl.hostname)) {
          logger.debug('Excluding URL - domain not allowed', { 
            url: link, 
            hostname: linkUrl.hostname,
            allowedDomains: config.allowedDomains 
          });
          continue;
        }

        // More intelligent exclude pattern matching
        const shouldExclude = config.excludePatterns.some(pattern => {
          // Handle specific patterns more intelligently
          if (pattern === '?') {
            // Only exclude URLs with search parameters that look like search queries
            return linkUrl.search.includes('search=') || linkUrl.search.includes('q=') || linkUrl.search.includes('query=');
          }
          if (pattern === '#') {
            // Only exclude fragment-only links (same page anchors) where path and search are identical
            const currentUrl = new URL(page.url);
            return linkUrl.hash.length > 0 && 
                   linkUrl.pathname === currentUrl.pathname && 
                   linkUrl.search === currentUrl.search;
          }
          // For other patterns, check if the path or full URL contains the pattern
          return linkUrl.pathname.includes(pattern) || link.includes(pattern);
        });

        if (shouldExclude) {
          logger.debug('Excluding URL - matches exclude pattern', { url: link });
          continue;
        }

        // Check include patterns (if specified)
        if (config.includePatterns.length > 0) {
          const shouldInclude = config.includePatterns.some(pattern => 
            linkUrl.pathname.includes(pattern) || link.includes(pattern)
          );
          if (!shouldInclude) {
            logger.debug('Excluding URL - does not match include pattern', { url: link });
            continue;
          }
        }

        // Clean the URL (remove fragments for consistency but keep query params)
        const cleanUrl = link.split('#')[0];
        if (cleanUrl) {
          logger.debug('Including URL for crawling', { url: cleanUrl });
          urls.push(cleanUrl);
        }
      } catch (e) {
        // Invalid URL, skip
        logger.debug('Excluding URL - invalid URL', { url: link, error: e });
        continue;
      }
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];

    logger.debug('URL extraction completed', { 
      extractedUrls: uniqueUrls.length,
      sampleUrls: uniqueUrls.slice(0, 3)
    });

    return uniqueUrls;
  }

  /**
   * Merge user request with default configuration
   */
  private static mergeConfig(request: CrawlRequest): WebCrawlerConfig {
    return {
      ...this.defaultConfig,
      maxDepth: request.maxDepth || this.defaultConfig.maxDepth,
      maxPages: request.maxPages || this.defaultConfig.maxPages,
      delay: request.delay || this.defaultConfig.delay,
      excludePatterns: request.excludePatterns || this.defaultConfig.excludePatterns,
      includePatterns: request.includePatterns || this.defaultConfig.includePatterns,
      followExternalLinks: request.followExternalLinks !== undefined 
        ? request.followExternalLinks 
        : this.defaultConfig.followExternalLinks
    };
  }

  /**
   * Normalize and validate URL
   */
  private static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove fragment and sort query parameters for consistency
      urlObj.hash = '';
      return urlObj.href;
    } catch (error) {
      throw new AppError('Invalid URL provided', 400);
    }
  }

  /**
   * Get a summary of what would be crawled without actually crawling
   */
  static async previewCrawl(request: CrawlRequest): Promise<{
    estimatedPages: number;
    allowedDomains: string[];
    startingUrl: string;
    config: WebCrawlerConfig;
  }> {
    try {
      const config = this.mergeConfig(request);
      const baseUrl = this.normalizeUrl(request.url);
      const baseDomain = new URL(baseUrl).hostname;
      
      const allowedDomains = config.allowedDomains.length > 0 
        ? config.allowedDomains 
        : [baseDomain];

      // Estimate pages based on depth and typical site structure
      const estimatedPages = Math.min(
        Math.pow(10, config.maxDepth), // Assume ~10 links per page
        config.maxPages
      );

      return {
        estimatedPages,
        allowedDomains,
        startingUrl: baseUrl,
        config
      };
    } catch (error) {
      logger.error('Error in preview crawl', error);
      throw new AppError('Failed to preview crawl', 500);
    }
  }
}

export default WebCrawlerService;
