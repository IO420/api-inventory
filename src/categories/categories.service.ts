// import { ConflictException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Category } from './entities/category.entity';
// import { Repository } from 'typeorm';
// import { CreateCategoryDto } from './dto/create-category.dto';

// @Injectable()
// export class CategoriesService {
//   constructor(
//     @InjectRepository(Category)
//     private readonly categoryRepository: Repository<Category>,
//   ) {}

//   findAll() {
//     return this.categoryRepository.find();
//   }

//   findOneByName(name: string) {
//     return this.categoryRepository.findOne({ where: { name } });
//   }

//   async create(category: CreateCategoryDto) {
//     const found = await this.findOneByName(category.name);

//     if (found) {
//       throw new ConflictException(
//         `The category name: "${category.name}" already exist.`,
//       );
//     }

//     const created = this.categoryRepository.create(category);
//     return this.categoryRepository.save(created);
//   }
// }
// //IO