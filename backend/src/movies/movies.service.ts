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

  async findPaginated(params: {
    page: number;
    size: number;
    year?: number;
    winner?: boolean;
  }) {
    const { page, size, year, winner } = params;
    const where: Partial<Movie> = {};

    if (year) where.year = year;
    if (winner !== undefined) where.winner = winner;

    const [content, totalElements] = await this.movieRepository.findAndCount({
      where,
      skip: page * size,
      take: size,
      order: { year: 'DESC', title: 'ASC' },
    });

    return {
      content,
      totalElements,
      totalPages: Math.ceil(totalElements / size) || 1,
    };
  }

  async getYearsWithMultipleWinners() {
    const winners = await this.movieRepository.find({ where: { winner: true } });
    const counts = new Map<number, number>();

    for (const movie of winners) {
      counts.set(movie.year, (counts.get(movie.year) ?? 0) + 1);
    }

    const years = [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([year, winnerCount]) => ({ year, winnerCount }))
      .sort((a, b) => a.year - b.year);

    return { years };
  }

  async getStudiosWithWinCount() {
    const winners = await this.movieRepository.find({ where: { winner: true } });
    const counts = new Map<string, number>();

    for (const movie of winners) {
      const studios = movie.studios
        .split(/,| and /)
        .map((studio) => studio.trim())
        .filter(Boolean);

      for (const studio of studios) {
        counts.set(studio, (counts.get(studio) ?? 0) + 1);
      }
    }

    const studios = [...counts.entries()]
      .map(([name, winCount]) => ({ name, winCount }))
      .sort((a, b) => b.winCount - a.winCount);

    return { studios };
  }

  async getWinnersByYear(year: number) {
    const winners = await this.movieRepository.find({
      where: { year, winner: true },
      order: { title: 'ASC' },
    });

    return winners.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      studios: movie.studios.split(',').map((item) => item.trim()).filter(Boolean),
      producers: movie.producers.split(/,| and /).map((item) => item.trim()).filter(Boolean),
      winner: movie.winner,
    }));
  }
}
