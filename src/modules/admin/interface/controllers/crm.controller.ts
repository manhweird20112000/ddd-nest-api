import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateAdminUseCase } from '../../application/use-cases/create-admin.use-case';
import { CreateAdminDto } from '../../application/dtos/create-admin.dto';
import { toAdminPresenter } from '../presenters';

@Controller({
  version: '1',
  path: 'crm/admins',
})
export class CrmAdminController {
  constructor(private readonly createAdminUseCase: CreateAdminUseCase) {}

  @Post('create')
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
  ) {
    const adminId = req['admin_id'];
    const result = await this.createAdminUseCase.execute({
      ...createAdminDto,
      createdBy: adminId,
    });

    return toAdminPresenter(result);
  }
}
