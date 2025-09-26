import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface SignupData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-new-user-notes',
  standalone: true,  // Para Angular 17+
  imports: [
    CommonModule,           // Para *ngIf, *ngFor, etc
    ReactiveFormsModule,    // Para formulários reativos
    RouterModule            // Para routerLink
  ],
  templateUrl: './new-user-notes.html',
  styleUrl: './new-user-notes.css'
})
export class NewUserNotes implements OnInit {
  signupForm!: FormGroup;

  passwordVisible: boolean = false;
  passwordValid: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  // ===== MÉTODOS DE INICIALIZAÇÃO =====
  
  initializeForm(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
    
    // Escutar mudanças no campo de senha para validação visual
    this.signupForm.get('password')?.valueChanges.subscribe(value => {
      this.validatePasswordLength(value);
    });
  }
  
  // ===== MÉTODOS DE INTERAÇÃO =====
  
  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  
  onPasswordInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const password = target.value;
    this.validatePasswordLength(password);
  }
  
  validatePasswordLength(password: string): void {
    this.passwordValid = password.length >= 8;
  }
  
  // ===== MÉTODOS DE SUBMISSÃO =====
  
  onSubmitReactive(): void {
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const formData: SignupData = this.signupForm.value;
    console.log('Dados enviados:', formData);

    // Aqui você pode redirecionar para outra página se quiser:
    // this.router.navigate(['/login']);
  }
  
  // ===== MÉTODOS AUXILIARES =====
  
  get f() {
    return this.signupForm.controls;
  }
  
  hasError(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }
  
  getErrorMessage(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    
    if (!field) return '';
    
    if (field.hasError('required')) {
      if (fieldName === 'email') return 'Email é obrigatório';
      if (fieldName === 'password') return 'Senha é obrigatória';
      return `${fieldName} é obrigatório`;
    }
    
    if (field.hasError('email')) return 'Email inválido';
    
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    
    return '';
  }
}
