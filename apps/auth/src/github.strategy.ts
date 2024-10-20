import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AuthService } from './auth.service';
import { ProfileType } from './types/github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientSecret = configService.get('GITHUB_CLIENT_SECRET');
    const clientID = configService.get('GITHUB_CLIENT_ID');
    const callbackURL = configService.get('GITHUB_CALLBACK_URL');
    const scope = configService.get('GITHUB_SCOPE');

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateGithubUser({
      ...profile,
      accessToken,
      refreshToken,
    } as ProfileType);

    return user;
  }
}
