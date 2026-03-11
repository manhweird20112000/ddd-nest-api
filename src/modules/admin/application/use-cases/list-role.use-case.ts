import { Role, RoleRepository } from "../../domain";
import { BaseUseCase } from "@/shared/common/base-use-case";

export class ListRoleUseCase implements BaseUseCase<any, Role[]> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}