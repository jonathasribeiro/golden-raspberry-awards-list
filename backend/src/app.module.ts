import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/movies.entity';
import { ProducersModule } from './producers/producers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Movie],
      synchronize: true,
      logging: false,
    }),
    MoviesModule,
    ProducersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
