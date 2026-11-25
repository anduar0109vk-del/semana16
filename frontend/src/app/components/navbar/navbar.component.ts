import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    const user = this.authService.getUser();
    return user?.role === 'ROLE_ADMIN' || user?.username === 'admin';
  }

  isBarista(): boolean {
    const user = this.authService.getUser();
    if (this.isAdmin()) return false;
    return (user?.role === 'ROLE_BARISTA' || user?.username === 'demo') && user?.username !== 'cliente';
  }

  isClient(): boolean {
    return !this.isAdmin() && !this.isBarista();
  }
}
