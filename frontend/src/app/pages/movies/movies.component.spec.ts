import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { MoviesService } from '../../services/movies.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let movieServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MoviesService', ['filterMovies']);

    await TestBed.configureTestingModule({
      imports: [MoviesComponent, CommonModule, FormsModule],
      providers: [
        { provide: MoviesService, useValue: movieServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    const mockResponse = {
      content: [{ id: 1, title: 'Test Movie', year: 1980, winner: true }],
      totalPages: 1,
      totalElements: 1
    };

    movieServiceSpy.filterMovies.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(component.movies.length).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.movies[0].title).toBe('Test Movie');
  });

  it('should reset page to 0 on search and fetch filtered movies', () => {
    component.yearFilter = 2000;
    component.winnerFilter = true;

    const mockResponse = {
      content: [{ id: 2, title: 'Filtered Movie', year: 2000, winner: true }],
      totalPages: 1,
      totalElements: 1
    };

    movieServiceSpy.filterMovies.and.returnValue(of(mockResponse));

    component.onSearch();

    expect(component.currentPage).toBe(0);
    expect(component.movies[0].year).toBe(2000);
    expect(movieServiceSpy.filterMovies).toHaveBeenCalledWith(2000, true, 0);
  });

  it('should go to next valid page', () => {
    component.totalPages = 2;

    const mockResponse = {
      content: [{ id: 3, title: 'Page 2 Movie', year: 1999, winner: false }],
      totalPages: 2,
      totalElements: 2
    };

    movieServiceSpy.filterMovies.and.returnValue(of(mockResponse));

    component.goToPage(1);

    expect(component.currentPage).toBe(1);
    expect(component.movies[0].title).toBe('Page 2 Movie');
  });

  it('should not go to invalid page', () => {
    component.totalPages = 1;
    component.currentPage = 0;
    component.goToPage(5);
    expect(component.currentPage).toBe(0);
  });
});
