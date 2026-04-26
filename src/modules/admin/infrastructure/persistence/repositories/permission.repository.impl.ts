import { InjectRepository } from "@nestjs/typeorm";
import { PermissionOrmEntity } from "../entities/permission-orm.entity";
import { In, Repository } from "typeorm";
import { Permission, PermissionRepository } from "@/modules/admin/domain";
import { PermissionOrmMapper } from "../mappers/permission-orm.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionRepositoryImpl implements PermissionRepository {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly permissionRepository: Repository<PermissionOrmEntity>,
  ) {}
  async findByIds(ids: number[]): Promise<Permission[] | null> {
    const orms = await this.permissionRepository.find({ where: { id: In(ids) } });
    return orms.map(PermissionOrmMapper.toDomain);
  }
  async findAll(): Promise<Permission[]> {
    const orms = await this.permissionRepository.find();
    return orms.map(PermissionOrmMapper.toDomain);
  }
}