import { PermissionPresenter } from './permission.presenter';

/**
 * Presenter type for Role in API responses.
 */
export interface RolePresenter {
  id: number;
  name: string;
  description: string;
  permissions?: PermissionPresenter[];
}
