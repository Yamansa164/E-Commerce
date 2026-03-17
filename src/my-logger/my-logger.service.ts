import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  constructor(context?: string) {
    console.log(`cont is ${context}`);
    super(context ?? '');
  }

  log(message: any) {
    const entry = `${this.context}\t${message}`;

    super.log(entry);
  }

  error(message: any) {
    super.error(message, this.context);
  }
}
