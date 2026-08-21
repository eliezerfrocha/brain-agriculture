import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsuarioPublicoDto } from './dto/usuario-publico.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiValidationErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticar e obter um token JWT' })
  @ApiOkResponse({ description: 'Autenticado com sucesso', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos' })
  @ApiValidationErrors()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // Protegida pelo JwtAuthGuard global (ver app.module.ts) — não é @Public().
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Dados do usuário autenticado (a partir do token)' })
  @ApiOkResponse({ description: 'Usuário autenticado', type: UsuarioPublicoDto })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  me(@Request() req: { user: { id: string; email: string; nome: string } }) {
    return req.user;
  }
}
