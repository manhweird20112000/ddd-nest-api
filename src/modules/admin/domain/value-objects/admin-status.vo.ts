import { EAdminStatus } from '../enums/admin-status.enum';

export class AdminStatusVO {
  constructor(public readonly status: EAdminStatus) {}

  static active() {
    return new AdminStatusVO(EAdminStatus.ACTIVE);
  }

  static inactive() {
    return new AdminStatusVO(EAdminStatus.INACTIVE);
  }

  static suspended() {
    return new AdminStatusVO(EAdminStatus.SUSPENDED);
  }

  static locked() {
    return new AdminStatusVO(EAdminStatus.LOCKED);
  }

  getValue() {
    return this.status;
  }

  getLabel() {
    const labels = {
      [EAdminStatus.ACTIVE]: 'Active',
      [EAdminStatus.INACTIVE]: 'Inactive',
      [EAdminStatus.SUSPENDED]: 'Suspended',
      [EAdminStatus.LOCKED]: 'Locked',
    };
    return labels[this.status];
  }
}
