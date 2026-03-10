/**
 * Presenter type for Permission in API responses.
 */
export interface PermissionPresenter {
  id: number;
  resource: string;
  action: string;
  description: string;
}
