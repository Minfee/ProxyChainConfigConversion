import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubModule } from './sub/sub.module';

@Module({
  imports: [SubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
