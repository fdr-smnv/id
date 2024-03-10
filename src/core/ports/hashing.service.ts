export abstract class HashingService {
  abstract hash(plainText: string): Promise<string>;
  abstract compare(plainText: string, hash: string): Promise<boolean>;
}
