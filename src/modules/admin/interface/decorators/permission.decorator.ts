import { SetMetadata } from "@nestjs/common";

export const Permission = (permission: string) => {
  return SetMetadata('permissions', permission);
};