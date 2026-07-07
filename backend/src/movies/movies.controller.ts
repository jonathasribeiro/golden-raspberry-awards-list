import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(
    @Query('page') page = '0',
    @Query('size') size = '15',
    @Query('year') year?: string,
    @Query('winner') winner?: string,
  ) {
    return this.moviesService.findPaginated({
      page: Number(page),
      size: Number(size),
      year: year ? Number(year) : undefined,
      winner: winner === undefined ? undefined : winner === 'true',
    });
  }

  @Get('yearsWithMultipleWinners')
  getYearsWithMultipleWinners() {
    return this.moviesService.getYearsWithMultipleWinners();
  }

  @Get('studiosWithWinCount')
  getStudiosWithWinCount() {
    return this.moviesService.getStudiosWithWinCount();
  }

  @Get('winnersByYear')
  getWinnersByYear(@Query('year') year: string) {
    return this.moviesService.getWinnersByYear(Number(year));
  }
}
