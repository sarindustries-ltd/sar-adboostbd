import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class FacebookService {
  /**
   * Fetches the user's managed Facebook Pages using the Graph API.
   * Requires the 'pages_show_list' permission.
   */
  async getManagedPages(accessToken: string): Promise<any> {
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Endpoint to fetch pages the user manages
      const url = `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new HttpException(
          data.error?.message || 'Failed to fetch Facebook pages',
          response.status || HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error while communicating with Facebook Graph API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
