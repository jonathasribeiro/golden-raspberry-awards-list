import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../movies/movies.entity';
import { Repository } from 'typeorm';

describe('ProducersService', () => {
  let service: ProducersService;
  let movieRepo: jest.Mocked<Partial<Repository<Movie>>>;

  beforeEach(async () => {
    movieRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Movie),
          useValue: movieRepo,
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct min and max intervals', async () => {
    movieRepo.find.mockResolvedValue([
      { year: 2000, producers: 'Producer A', winner: true } as Movie,
      { year: 2003, producers: 'Producer A', winner: true } as Movie,
      { year: 1990, producers: 'Producer B and Producer C', winner: true } as Movie,
      { year: 2000, producers: 'Producer B', winner: true } as Movie,
      { year: 2010, producers: 'Producer C', winner: true } as Movie,
    ]);

    const result = await service.findAwardIntervals();

    expect(result.min).toEqual([
      {
        producer: 'Producer A',
        interval: 3,
        previousWin: 2000,
        followingWin: 2003,
      },
      {
        producer: 'Producer B',
        interval: 10,
        previousWin: 1990,
        followingWin: 2000,
      },
    ].filter(i => i.interval === 3));

    expect(result.max).toEqual([
      {
        producer: 'Producer C',
        interval: 20,
        previousWin: 1990,
        followingWin: 2010,
      },
    ]);
  });

  it('should return empty arrays if no producers have multiple wins', async () => {
    movieRepo.find.mockResolvedValue([
      { year: 2000, producers: 'Solo Producer', winner: true } as Movie,
    ]);

    const result = await service.findAwardIntervals();
    expect(result.min).toEqual([]);
    expect(result.max).toEqual([]);
  });
});
