import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class MoviesService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async onModuleInit() {
    const filePath = path.resolve(
      process.cwd(),
      'src',
      'assets',
      'movielist.csv',
    );

    const movies: Movie[] = [];

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          const year = parseInt(row.year);
          if (isNaN(year)) return;

          const movie = new Movie();
          movie.year = year;
          movie.title = row.title;
          movie.studios = row.studios;
          movie.producers = row.producers;
          movie.winner = row.winner?.toLowerCase() === 'yes';
          movies.push(movie);
        })
        .on('end', async () => {
          await this.movieRepository.save(movies);
          console.log('CSV importado com sucesso!');
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }
}
