import { SetMetadata } from '@nestjs/common';
import { EXCLUDE_JWT_VERIFICATION } from 'shared/constants';

export const UnwantedAuthenticate = () =>
  SetMetadata(EXCLUDE_JWT_VERIFICATION, true);
