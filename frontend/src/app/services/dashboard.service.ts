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
      `${this.baseUrl}/yearsWithMultipleWinners`
    );
  }

  getTopStudios() {
    return this.http.get<{ studios: StudioWin[] }>(
      `${this.baseUrl}/studiosWithWinCount`
    );
  }

  getProducersWithIntervals() {
    return this.http.get<{
      min: ProducerInterval[];
      max: ProducerInterval[];
    }>(`${this.baseUrl}/maxMinWinIntervalForProducers`);
  }

  getWinnersByYear(year: number) {
    return this.http.get<MovieWinner[]>(
      `${this.baseUrl}/winnersByYear?year=${year}`
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
