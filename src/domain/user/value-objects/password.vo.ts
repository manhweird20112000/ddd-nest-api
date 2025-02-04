import { PasswordHasher } from '@/shared/utils/password-hasher';

export class Password {
  private readonly _value: string;

  constructor(private readonly value: string) {
    this._value = value;
  }

  static isValid(password: string): boolean {
    return password.length >= 6;
  }

  getValue() {
    return this._value;
  }

  static async create(text: string) {
    if (!this.isValid(text)) {
      throw new Error('Password must be at least 6 characters long.');
    }
    const hashValue = await PasswordHasher.hash(text);
    return new Password(hashValue);
  }

  compare(text: string) {
    return PasswordHasher.compare(text, this.value);
  }
}
