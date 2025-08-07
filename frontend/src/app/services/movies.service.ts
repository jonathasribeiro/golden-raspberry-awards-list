import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  filterMovies(year?: number, winner?: boolean, page: number = 0, size: number = 15): Observable<{ content: Movie[]; totalPages: number; totalElements: number }> {
    let query = `${this.baseUrl}?page=${page}&size=${size}`;
    if (year) query += `&year=${year}`;
    if (winner !== undefined) query += `&winner=${winner}`;
    return this.http.get<{ content: Movie[]; totalPages: number; totalElements: number }>(query);
  }
}
