import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Repository } from 'typeorm';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepo: Repository<Movie>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call movieRepository.save with parsed CSV data', async () => {
    await service.onModuleInit();

    const saveMock = movieRepo.save as jest.Mock;

    expect(saveMock).toHaveBeenCalledTimes(1);

    const saved = saveMock.mock.calls[0][0];
    expect(saved.length).toBeGreaterThanOrEqual(1)

    expect(saved[0].title).toBeTruthy();
    expect(saved[0].year).toBeTruthy();
    expect(saved[0].winner).toBeTruthy();
  });
});
