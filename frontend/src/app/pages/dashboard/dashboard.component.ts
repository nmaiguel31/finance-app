import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  incomes: any[] = [];
  expenses: any[] = [];
  error: string = '';
  form: FormGroup;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      type: ['ingreso', Validators.required], // ingreso o gasto
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMovimientos();
  }

  // ✅ Carga movimientos desde el backend y los separa por tipo
  loadMovimientos(): void {
    this.dashboardService.getMovimientos().subscribe({
      next: (data) => {
        // El backend usa descripcion y monto
        this.incomes = data
          .filter((m: any) => m.tipo === 'ingreso')
          .map((m: any) => ({
            _id: m._id,
            description: m.descripcion,
            amount: m.monto
          }));

        this.expenses = data
          .filter((m: any) => m.tipo === 'gasto')
          .map((m: any) => ({
            _id: m._id,
            description: m.descripcion,
            amount: m.monto
          }));
      },
      error: (err) => {
        console.error('Error al cargar movimientos', err);
        this.error = 'No se pudieron cargar los movimientos.';
      }
    });
  }

  // ✅ Envía nuevo movimiento al backend y lo agrega al estado local
  submitForm(): void {
    if (this.form.invalid) return;

    const { description, amount, type, category } = this.form.value;

    const payload = {
      descripcion: description,
      monto: Number(amount),
      tipo: type,
      categoria: category
    };

    console.log('🟡 Enviando payload:', payload);

    this.dashboardService.addMovimiento(payload).subscribe({
      next: (movimientoAgregado) => {
        const movimiento = {
          _id: movimientoAgregado._id,
          description: movimientoAgregado.descripcion,
          amount: movimientoAgregado.monto
        };

        if (movimientoAgregado.tipo === 'ingreso') {
          this.incomes.push(movimiento);
        } else if (movimientoAgregado.tipo === 'gasto') {
          this.expenses.push(movimiento);
        }

        // Limpiar formulario
        this.form.reset({
          description: '',
          amount: '',
          type: 'ingreso',
          category: ''
        });
      },
      error: (err) => {
        console.error('Error al agregar movimiento', err);
        this.error = 'No se pudo agregar el movimiento.';
      }
    });
  }

  // ✅ Métodos auxiliares si quisieras llamar ingresos/gastos por separado
  getIncomes(): void {
    this.dashboardService.getMovimientos().subscribe({
      next: (data) => {
        this.incomes = data
          .filter((mov: any) => mov.tipo === 'ingreso')
          .map((m: any) => ({
            id: m._id,
            description: m.descripcion,
            amount: m.monto
          }));
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los ingresos.';
      }
    });
  }

  getExpenses(): void {
    this.dashboardService.getMovimientos().subscribe({
      next: (data) => {
        this.expenses = data
          .filter((mov: any) => mov.tipo === 'gasto')
          .map((m: any) => ({
            id: m._id,
            description: m.descripcion,
            amount: m.monto
          }));
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los gastos.';
      }
    });
  }

deleteMovimiento(tipo: 'ingreso' | 'gasto', index: number, income: any): void {
  const movimientoArray = tipo === 'ingreso' ? this.incomes : this.expenses;
  const movimiento = movimientoArray[index];

  console.log(movimiento);
  console.log(income);
  
  if (!income._id) {
    this.error = 'ID de movimiento no encontrado'
      return;
  }

  this.dashboardService.deleteMovimiento(income._id).subscribe({
    next: () => {
        movimientoArray.splice(index, 1);
  },
    error: (err) => {
      console.error('Error al eliminar movimiento', err);
      this.error = 'No se pudo eliminar el movimiento.';
    }
  });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}

