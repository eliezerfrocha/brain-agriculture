import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca uma rota como pública, isentando-a do JwtAuthGuard global
 * (registrado via APP_GUARD em app.module.ts).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
