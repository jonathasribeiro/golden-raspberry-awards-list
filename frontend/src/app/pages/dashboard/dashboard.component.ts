import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import {
  YearWinner,
  StudioWin,
  ProducerInterval,
  MovieWinner,
} from '../../models/dashboard.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  years: YearWinner[] = [];
  studios: StudioWin[] = [];
  minProducers: ProducerInterval[] = [];
  maxProducers: ProducerInterval[] = [];
  winnersByYear: MovieWinner[] = [];
  yearInput = '';

  loaded = false;
  winnersLoading = false;

  constructor(private dataService: DashboardDataService) {}

  ngOnInit(): void {
    this.dataService.loadDashboardData().subscribe({
      next: ({ years, studios, intervals }) => {
        this.years = years.years;
        this.studios = studios.studios.slice(0, 3);
        this.minProducers = intervals.min;
        this.maxProducers = intervals.max;
        this.loaded = true;
        console.log(this.studios);
      },
      error: (err) => {
        alert('Erro ao carregar dashboard:');
        console.error('Erro ao carregar dashboard:', err);
      },
    });
  }

  fetchWinnersByYear(): void {
    const year = parseInt(this.yearInput);
    if (isNaN(year)) return;

    this.winnersLoading = true;

    this.dataService.getWinnersByYear(year).subscribe((res) => {
      this.winnersByYear = Array.isArray(res) ? res : [res];
      this.winnersLoading = false;
    });
  }
}
