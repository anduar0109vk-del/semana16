import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isRegisterMode = false;

  username = '';
  password = '';
  fullName = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  fillCredentials(user: string, pass: string): void {
    this.isRegisterMode = false;
    this.username = user;
    this.password = pass;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    this.isLoading = true;

    if (this.isRegisterMode) {
      if (!this.fullName.trim()) {
        this.errorMessage = 'El nombre completo es obligatorio.';
        this.isLoading = false;
        return;
      }

      this.authService.register({
        username: this.username.trim(),
        password: this.password,
        fullName: this.fullName.trim()
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.';
          this.isRegisterMode = false;
          this.password = '';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = typeof err.error === 'string' ? err.error : 'Error al registrar usuario.';
        }
      });
    } else {
      this.authService.login({
        username: this.username.trim(),
        password: this.password
      }).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = res.message || 'Credenciales inválidas.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Usuario o contraseña incorrectos. Verifica que el backend esté activo.';
        }
      });
    }
  }
}
