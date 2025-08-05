import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { existsSync } from 'fs';

@Injectable()
export class MoviesService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async onModuleInit() {
    let filePath = path.resolve(__dirname, '..', 'assets', 'movielist.csv');

    if (!existsSync(filePath)) {
      filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'src',
        'assets',
        'movielist.csv',
      );
    }
    const movies: Movie[] = [];

    if (!fs.existsSync(filePath)) {
      console.error(`Arquivo CSV não encontrado: ${filePath}`);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const movie = new Movie();
          movie.year = parseInt(row.year);
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
