import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { FacebookService } from './facebook.service';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  /**
   * Endpoint: GET /facebook/pages
   * Fetches the user's managed Facebook Pages.
   * Expects the Facebook Access Token in the Authorization header.
   */
  @Get('pages')
  async getPages(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    // Extract the access token from the Bearer token
    const token = authHeader.split(' ')[1];

    // Delegate to the service to fetch the pages
    return this.facebookService.getManagedPages(token);
  }
}
