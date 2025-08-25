import { Request, Response } from 'express';
import { WebCrawlerService } from '@/services/WebCrawlerService';
import { successResponse } from '@/utils/helpers';
import { CrawlRequest } from '@/types';

export class WebCrawlerController {
  /**
   * Crawl a documentation website and return formatted JSON data
   */
  static async crawlDocumentation(req: Request, res: Response): Promise<Response> {
    const crawlRequest: CrawlRequest = req.body;
    const result = await WebCrawlerService.crawlDocumentation(crawlRequest);
    
    return successResponse(res, result.message, result.data, 200);
  }

  /**
   * Preview what would be crawled without actually crawling
   */
  static async previewCrawl(req: Request, res: Response): Promise<Response> {
    const crawlRequest: CrawlRequest = req.body;
    const preview = await WebCrawlerService.previewCrawl(crawlRequest);
    
    return successResponse(res, 'Crawl preview generated successfully', preview, 200);
  }

  /**
   * Analyze a single page in detail
   */
  static async analyzePage(req: Request, res: Response): Promise<Response> {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    const crawlRequest: CrawlRequest = {
      url,
      maxDepth: 1,
      maxPages: 1,
      delay: 500
    };

    const result = await WebCrawlerService.crawlDocumentation(crawlRequest);
    
    return successResponse(res, 'Page analyzed successfully', result.data, 200);
  }


}

export default WebCrawlerController;
