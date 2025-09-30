import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-user-screem',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './new-user-notes.html',
  styleUrl: './new-user-notes.css'
})
export class NewUserNotes {
  signupForm: FormGroup;
  passwordVisible: boolean = false;
  passwordValid: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  // Verifica se um campo tem erro e foi tocado
  hasError(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Retorna a mensagem de erro apropriada
  getErrorMessage(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    
    if (!field) return '';

    if (fieldName === 'nome') {
      if (field.hasError('required')) {
        return 'Name is required';
      }
      if (field.hasError('minlength')) {
        return 'Name must be at least 3 characters long';
      }
    }

    if (fieldName === 'email') {
      if (field.hasError('required')) {
        return 'Email is required';
      }
      if (field.hasError('email') || field.hasError('pattern')) {
        return 'Please enter a valid email address';
      }
    }

    if (fieldName === 'password') {
      if (field.hasError('required')) {
        return 'Password is required';
      }
      if (field.hasError('minlength')) {
        return 'Password must be at least 8 characters long';
      }
    }

    return '';
  }

  // Alterna visibilidade da senha
  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Valida a senha em tempo real
  onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.passwordValid = input.value.length >= 8;
  }

  // Submete o formulário
  async onSubmitReactive(): Promise<void> {
    // Marca todos os campos como tocados para mostrar erros
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)?.markAsTouched();
    });

    // Se o formulário for inválido, não prossegue
    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      const { nome, email, password } = this.signupForm.value;

      // Faz a requisição para a API
      const response = await fetch('https://senai-gpt-api.azurewebsites.net/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          password: password
        })
      });

      console.log('Status code: ' + response.status);

      if (response.status >= 200 && response.status <= 299) {
        const json = await response.json();
        console.log('Resposta da API:', json);
        
        // Mostra mensagem de sucesso
        alert('Account created successfully! Redirecting to login...');
        
        // Redireciona para a página de login
        window.location.href = '/login';
      } else {
        // Trata erros da API
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409) {
          alert('This email is already registered. Please use a different email or login.');
        } else if (response.status === 400) {
          alert('Invalid data. Please check your information and try again.');
        } else {
          alert('Error creating account. Please try again later.');
        }
        
        console.error('Erro da API:', errorData);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      this.isLoading = false;
    }
  }
}