import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminUseCase } from '../../application/use-cases/create-admin.use-case';
import { CreateAdminDto } from '../../application/dtos/create-admin.dto';
import { toAdminPresenter } from '../presenters';
import { AuthGuard } from '@/modules/admin-auth/interface/guards/auth.guard';
import { CurrentUser } from '@/modules/admin-auth/interface/decorators/current-admin.decorator';
import { DeleteAdminUseCase } from '../../application/use-cases/delete-admin.use-case';
import { ListAdminUseCase } from '../../application/use-cases/list-admin.use-case';
import { ListRoleUseCase } from '../../application/use-cases/list-role.use-case';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';

@Controller({
  version: '1',
  path: 'crm/admins',
})
export class CrmAdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly deleteAdminUseCase: DeleteAdminUseCase,
    private readonly listAdminUseCase: ListAdminUseCase,
    private readonly listRoleUseCase: ListRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, PermissionGuard)
  @Permission('admin:create')
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
    @CurrentUser() admin: any,
  ) {
    const result = await this.createAdminUseCase.execute({
      ...createAdminDto,
      createdBy: +admin.sub,
    });

    return toAdminPresenter(result);
  }

  @Delete(':id/delete')
  @UseGuards(AuthGuard)
  async deleteAdmin(@Param('id') id: string, @CurrentUser() admin: any) {
    const result = await this.deleteAdminUseCase.execute({
      id: +id,
      adminId: +admin.sub,
    });
    return result;
  }

  @Get('list')
  @UseGuards(AuthGuard)
  async listAdmin(@Query() query: any) {
    const result = await this.listAdminUseCase.execute(query);
    return result;
  }

  @Get('roles')
  @UseGuards(AuthGuard)
  async listRole() {
    const result = await this.listRoleUseCase.execute();
    return result;
  }

  @Post('roles/create')
  @UseGuards(AuthGuard)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.createRoleUseCase.execute(createRoleDto);
    return result;
  }
}
