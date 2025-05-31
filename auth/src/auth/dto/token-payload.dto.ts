import { IsString } from 'class-validator';

export class TokenPayloadDto {
  @IsString()
  userId: string;

  @IsString()
  email: string;

  @IsString()
  role: string;
}
