import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
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
    console.log(profile);

    return profile;
  }
}
