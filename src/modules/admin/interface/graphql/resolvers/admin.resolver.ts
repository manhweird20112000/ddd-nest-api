import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '@/modules/admin-auth/interface/guards/gql-auth.guard';
import { CurrentUser } from '@/modules/admin-auth/interface/decorators/current-admin.decorator';
import { JwtPayload } from '@/modules/admin-auth/application/ports/jwt.port';
import { CreateAdminUseCase } from '../../../application/use-cases/create-admin.use-case';
import { DeleteAdminUseCase } from '../../../application/use-cases/delete-admin.use-case';
import { ListAdminUseCase } from '../../../application/use-cases/list-admin.use-case';
import { ListRoleUseCase } from '../../../application/use-cases/list-role.use-case';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { GqlPermissionGuard } from '../../guards/gql-permission.guard';
import { Permission } from '../../decorators/permission.decorator';
import { CreateAdminInput } from '../inputs/create-admin.input';
import { CreateRoleInput } from '../inputs/create-role.input';
import { AdminType } from '../types/admin.type';
import { RoleType } from '../types/role.type';
import { toAdminType } from '../mappers/admin.type.mapper';
import { toRoleType } from '../mappers/role.type.mapper';

@Resolver(() => AdminType)
export class AdminResolver {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly deleteAdminUseCase: DeleteAdminUseCase,
    private readonly listAdminUseCase: ListAdminUseCase,
    private readonly listRoleUseCase: ListRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
  ) {}

  @Query(() => [AdminType], { name: 'admins' })
  @UseGuards(GqlAuthGuard, GqlPermissionGuard)
  @Permission('admin:list')
  async listAdmins(): Promise<AdminType[]> {
    const admins = await this.listAdminUseCase.execute({});
    return admins.map(toAdminType);
  }

  @Query(() => [RoleType], { name: 'roles' })
  @UseGuards(GqlAuthGuard)
  async listRoles(): Promise<RoleType[]> {
    const roles = await this.listRoleUseCase.execute();
    return roles.map(toRoleType);
  }

  @Mutation(() => AdminType, { name: 'createAdmin' })
  @UseGuards(GqlAuthGuard, GqlPermissionGuard)
  @Permission('admin:create')
  async createAdmin(
    @Args('input') input: CreateAdminInput,
    @CurrentUser() admin: JwtPayload,
  ): Promise<AdminType> {
    const result = await this.createAdminUseCase.execute({
      ...input,
      createdBy: +admin.sub,
    });
    return toAdminType(result);
  }

  @Mutation(() => Boolean, { name: 'deleteAdmin' })
  @UseGuards(GqlAuthGuard, GqlPermissionGuard)
  @Permission('admin:delete')
  async deleteAdmin(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() admin: JwtPayload,
  ): Promise<boolean> {
    return this.deleteAdminUseCase.execute({
      id: +id,
      adminId: +admin.sub,
    });
  }

  @Mutation(() => RoleType, { name: 'createRole' })
  @UseGuards(GqlAuthGuard, GqlPermissionGuard)
  @Permission('role:create')
  async createRole(@Args('input') input: CreateRoleInput): Promise<RoleType> {
    const role = await this.createRoleUseCase.execute(input);
    return toRoleType(role);
  }
}
