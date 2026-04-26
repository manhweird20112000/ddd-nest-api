import { Role, RoleRepository } from "../../domain";
import { BaseUseCase } from "@/shared/common/base-use-case";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ListRoleUseCase implements BaseUseCase<void, Role[]> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}