import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movies/movies.entity';
import { Repository } from 'typeorm';
import { IntervalResult } from './producers.dto';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async findAwardIntervals() {
    const winners = await this.movieRepository.find({
      where: { winner: true },
    });

    const producerWins = new Map<string, number[]>();

    for (const movie of winners) {
      const producers = movie.producers
        .split(/,| and /)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      for (const producer of producers) {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        producerWins.get(producer).push(movie.year);
      }
    }

    const intervals: IntervalResult[] = [];

    for (const [producer, years] of producerWins.entries()) {
      if (years.length < 2) continue;

      const sorted = years.sort((a, b) => a - b);

      for (let i = 1; i < sorted.length; i++) {
        intervals.push({
          producer,
          interval: sorted[i] - sorted[i - 1],
          previousWin: sorted[i - 1],
          followingWin: sorted[i],
        });
      }
    }

    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    return {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };
  }
}
