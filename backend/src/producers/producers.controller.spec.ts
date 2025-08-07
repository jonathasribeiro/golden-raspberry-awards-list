import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';

describe('ProducersController', () => {
  let controller: ProducersController;
  let mockService: ProducersService;

  beforeEach(async () => {
    const mockProducersService = {
      findAwardIntervals: jest.fn().mockResolvedValue({
        min: [
          {
            producer: 'Producer A',
            interval: 1,
            previousWin: 2001,
            followingWin: 2002,
          },
        ],
        max: [
          {
            producer: 'Producer B',
            interval: 10,
            previousWin: 1990,
            followingWin: 2000,
          },
        ],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useValue: mockProducersService,
        },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    mockService = module.get<ProducersService>(ProducersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return award intervals from service', async () => {
    const result = await controller.getIntervals();

    expect(mockService.findAwardIntervals).toHaveBeenCalled();
    expect(result).toEqual({
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 2001,
          followingWin: 2002,
        },
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 10,
          previousWin: 1990,
          followingWin: 2000,
        },
      ],
    });
  });
});
