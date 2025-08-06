import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [RouterModule, CommonModule],
})
export class NavbarComponent {
  isMenuOpen = false;

  menu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'List', path: '/list' },
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
