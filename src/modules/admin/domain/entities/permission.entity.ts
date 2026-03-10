/**
 * Domain entity representing a permission (resource + action).
 */
export class Permission {
  constructor(
    public readonly id: number,
    public readonly resource: string,
    public readonly action: string,
    public readonly description: string,
  ) {}
}
