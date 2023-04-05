import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AccessLogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const functionName = context.getHandler().name;
    const res = context.switchToHttp().getResponse();
    const responseCode = res.statusCode;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.debug(
            JSON.stringify({
              msg: 'response info',
              class: className,
              function: functionName,
              responseCode,
              responseTime: `${Date.now() - now}ms`,
            }),
          );
        },
        error: (err) => {
          this.logger.error(
            JSON.stringify({
              msg: 'response info',
              class: className,
              function: functionName,
              responseCode: err.status,
              errors: err.response,
              msgErr: err.message,
              responseTime: `${Date.now() - now}ms`,
            }),
          );
        },
      }),
    );
  }
}
