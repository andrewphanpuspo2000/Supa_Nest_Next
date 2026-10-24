import { Module, Global } from '@nestjs/common';
import { DrizzleService } from './drizzel.service';

@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DbModule {}
