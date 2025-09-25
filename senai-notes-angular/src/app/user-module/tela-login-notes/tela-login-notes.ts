import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tela-login-notes',
  imports: [],
  templateUrl: './tela-login-notes.html',
  styleUrl: './tela-login-notes.css'
})

export class TelaLoginNotes {

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const { email, password } = this.loginForm.value;
      
      // Simular requisição de login
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login attempt:', { email, password });
        
        // Aqui você integraria com seu serviço de autenticação
        // this.authService.login(email, password).subscribe(...)
        
        // Exemplo de redirecionamento após login bem-sucedido
        // this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}


