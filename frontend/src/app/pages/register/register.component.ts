import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        alert('¡Registro exitoso!');
        this.router.navigate(['/']); // redirige al login
      },
      error: (err) => {
        this.error = 'No se pudo registrar. Verifica los datos.';
        console.error(err);
      }
    });
  }
}
