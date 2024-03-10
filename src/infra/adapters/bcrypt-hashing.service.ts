import * as bcrypt from 'bcrypt';
import { HashingService } from 'src/core/ports/hashing.service';

export class BcryptHashingService extends HashingService {
  constructor() {
    super();
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, 10);
  }
}
