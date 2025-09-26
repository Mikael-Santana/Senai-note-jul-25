import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-tela-login-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tela-login-notes.html',
  styleUrls: ['./tela-login-notes.css'],
  encapsulation: ViewEncapsulation.None,
})

export class TelaLoginNotes implements OnInit {
  loginForm: FormGroup;
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  sucessoErrorMessage: string = '';
  incorretoErrorMessage: string = '';
  isDarkMode = false;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.updateTheme();
  }
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
  private updateTheme(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
  async onLoginClick(): Promise<void> {
    if (this.loginForm.invalid) {
      const emailVal = this.loginForm.get('email')?.value;
      const passVal = this.loginForm.get('password')?.value;
      this.emailErrorMessage = emailVal ? '' : 'O campo de e-mail é obrigatório.';
      this.passwordErrorMessage = passVal ? '' : 'O campo de senha é obrigatório.';
      return;
    }
    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.sucessoErrorMessage = '';
    this.incorretoErrorMessage = '';
    const { email, password } = this.loginForm.value;
    try {
      const response = await fetch('https://senai-gpt-api.azurewebsites.net/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        this.sucessoErrorMessage = 'Login realizado com sucesso!';
        const json = await response.json();
        const meuToken = json.accessToken;
        const meuId = json.user?.id;
        localStorage.setItem('meuToken', meuToken ?? '');
        if (meuId != null) localStorage.setItem('meuId', String(meuId));
        window.location.href = 'chat';
      } else {
        this.incorretoErrorMessage = 'E-mail ou senha incorretos.';
      }
    } catch (err) {
      console.error(err);
      this.incorretoErrorMessage = 'Erro de conexão. Tente novamente.';
    }
  }
}
