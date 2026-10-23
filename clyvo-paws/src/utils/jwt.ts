import { jwtDecode, type JwtPayload } from 'jwt-decode';

export function expiracaoToken(token: string): number {
  try {
    if (token.split('.').length !== 3) return 0;

    const { exp } = jwtDecode<JwtPayload>(token);
    const instante = typeof exp === 'number' ? exp * 1000 : 0;

    return Number.isFinite(instante) ? instante : 0;
  } catch {
    return 0;
  }
}

export function tokenDentroDoPrazo(token: string): boolean {
  return expiracaoToken(token) > Date.now();
}