import { Password } from '@/domain/user/value-objects/password.vo';

export class User {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly email: string,
    private readonly password: Password,
  ) {}
}
