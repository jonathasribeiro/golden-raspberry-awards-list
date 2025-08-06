import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardDataService } from '../../services/dashboard.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieWinner } from '../../models/dashboard.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockService: jasmine.SpyObj<DashboardDataService>;

  const mockDashboardData = {
    years: { years: [{ year: 2020, winnerCount: 3 }] },
    studios: { studios: [{ name: 'Studio A', winCount: 5 }, { name: 'Studio B', winCount: 4 }] },
    intervals: {
      min: [{ producer: 'John', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Anna', interval: 10, previousWin: 2000, followingWin: 2010 }]
    }
  };

  const mockWinners: MovieWinner[] = [
  {
    id: 1,
    title: 'Movie A',
    year: 2020,
    winner: true,
    studios: ['Studio A'],
    producers: ['Producer A']
  }
];


  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj('DashboardDataService', ['loadDashboardData', 'getWinnersByYear']);

    TestBed.configureTestingModule({
      imports: [DashboardComponent, CommonModule, FormsModule],
      providers: [{ provide: DashboardDataService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    mockService.loadDashboardData.and.returnValue(of(mockDashboardData));
    component.ngOnInit();

    expect(component.years.length).toBe(1);
    expect(component.studios.length).toBe(2);
    expect(component.minProducers.length).toBe(1);
    expect(component.maxProducers.length).toBe(1);
    expect(component.loaded).toBeTrue();
  });

  it('should fetch winners by year', () => {
    mockService.getWinnersByYear.and.returnValue(of(mockWinners));
    component.yearInput = '2020';
    component.fetchWinnersByYear();

    expect(component.winnersByYear.length).toBe(1);
    expect(component.winnersByYear[0].title).toBe('Movie A');
    expect(component.winnersLoading).toBeFalse();
  });

  it('should not fetch winners with invalid year', () => {
    component.yearInput = 'invalid';
    component.fetchWinnersByYear();
    expect(component.winnersByYear.length).toBe(0);
  });
});
