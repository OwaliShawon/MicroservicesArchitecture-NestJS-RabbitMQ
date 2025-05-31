import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const isValid = await firstValueFrom(
        this.authServiceClient.send<boolean>('validate_token', { token }).pipe(
          timeout(5000),
          catchError((err) => {
            console.error('Error calling auth service for validation:', err);
            throw new UnauthorizedException(
              'Authentication service unavailable',
            );
          }),
        ),
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      const decodedToken = await firstValueFrom(
        this.authServiceClient.send<any>('decode_token', { token }).pipe(
          timeout(5000),
          catchError((err) => {
            console.error('Error calling auth service for decoding:', err);
            throw new UnauthorizedException(
              'Authentication service unavailable',
            );
          }),
        ),
      );

      if (!decodedToken) {
        throw new UnauthorizedException('Could not decode token');
      }

      request.user = decodedToken;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
