import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/core/ports/token.service';
import { TokenPayload } from 'src/core/token-payload';

@Injectable()
export class JwtTokenService extends TokenService {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(JSON.stringify(payload));
  }
}
