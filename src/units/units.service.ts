import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  findAll() {
    return this.unitRepository.find();
  }

  findOneByName(name: string) {
    return this.unitRepository.findOne({ where: { name } });
  }

  async create(unit: CreateUnitDto) {
    const found = await this.findOneByName(unit.name);

    if (found) {
      throw new ConflictException(
        `The unit name: "${unit.name}" already exist.`,
      );
    }

    const created = this.unitRepository.create(unit);
    return this.unitRepository.save(created);
  }
}
//IO