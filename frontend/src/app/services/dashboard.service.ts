import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  YearWinner,
  StudioWin,
  ProducerInterval,
  MovieWinner,
} from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getYearsWithMultipleWinners() {
    return this.http.get<{ years: YearWinner[] }>(
      `${environment.localApiUrl}/movies/yearsWithMultipleWinners`,
    );
  }

  getTopStudios() {
    return this.http.get<{ studios: StudioWin[] }>(
      `${environment.localApiUrl}/movies/studiosWithWinCount`,
    );
  }

  getProducersWithIntervals() {
    return this.http.get<{
      min: ProducerInterval[];
      max: ProducerInterval[];
    }>(`${environment.localApiUrl}/producers/intervals`);
  }

  getWinnersByYear(year: number) {
    return this.http.get<MovieWinner[]>(
      `${environment.localApiUrl}/movies/winnersByYear?year=${year}`,
    );
  }

  loadDashboardData() {
    return forkJoin({
      years: this.getYearsWithMultipleWinners(),
      studios: this.getTopStudios(),
      intervals: this.getProducersWithIntervals(),
    });
  }
}
