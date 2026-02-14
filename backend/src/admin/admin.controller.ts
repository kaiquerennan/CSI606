import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: { email: string; senha: string }) {
    return this.adminService.login(body.email, body.senha);
  }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminService.findById(Number(id));
  }

  @Post()
  async create(@Body() body: { nome: string; email: string; senha: string }) {
    return this.adminService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: { nome?: string; email?: string; senha?: string; ativo?: boolean },
  ) {
    return this.adminService.update(Number(id), body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminService.delete(Number(id));
  }
}
