import { RolePresenter } from './role.presenter';

/**
 * Presenter type for Admin in API responses (excludes sensitive fields like password).
 */
export interface AdminPresenter {
  id: number;
  name: string;
  email: string;
  status: string;
  created_by?: number;
  deleted_by?: number;
  roles?: RolePresenter[];
  created_at?: Date;
  updated_at?: Date;
  delete_at?: Date;
}
