import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
})
export class MoviesComponent {
  private movieService = inject(MoviesService);

  movies: Movie[] = [];
  yearFilter?: number;
  winnerFilter?: boolean;
  currentPage = 0;
  totalPages = 0;
  loading: boolean = false;

  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
    this.loading = true;
    this.movieService.filterMovies(this.yearFilter, this.winnerFilter, this.currentPage).subscribe(res => {
      this.movies = res.content;
      this.totalPages = res.totalPages;
      this.loading = false;
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.fetchMovies();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchMovies();
    }
  }
}
