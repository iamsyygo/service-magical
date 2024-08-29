import { SetMetadata } from '@nestjs/common';
import { NO_JWT_VERIFY } from 'shared/constants';

export const UnwantedAuthenticate = () => SetMetadata(NO_JWT_VERIFY, true);
