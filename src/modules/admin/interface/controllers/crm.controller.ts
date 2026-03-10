import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminUseCase } from '../../application/use-cases/create-admin.use-case';
import { CreateAdminDto } from '../../application/dtos/create-admin.dto';
import { toAdminPresenter } from '../presenters';
import { AuthGuard } from '@/modules/admin-auth/interface/guards/auth.guard';
import { CurrentUser } from '@/modules/admin-auth/interface/decorators/current-admin.decorator';
import { DeleteAdminUseCase } from '../../application/use-cases/delete-admin.use-case';

@Controller({
  version: '1',
  path: 'crm/admins',
})
export class CrmAdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly deleteAdminUseCase: DeleteAdminUseCase,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
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
}
