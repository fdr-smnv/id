import { TokenPayload } from 'src/core/token-payload';

export abstract class TokenService {
  abstract generateToken(payload: TokenPayload): Promise<string>;
}
