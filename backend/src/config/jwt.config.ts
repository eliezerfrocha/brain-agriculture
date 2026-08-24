// Fallback só pra dev local sem `.env` configurado — em produção, `JWT_SECRET`
// deve vir de uma variável de ambiente real. Centralizado aqui porque era
// duplicado (JwtModule e JwtStrategy precisam do mesmo segredo).
export const DEFAULT_DEV_JWT_SECRET = 'dev-secret-troque-em-producao';
