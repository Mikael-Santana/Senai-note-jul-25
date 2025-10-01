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
  nomeErrorMessage: string;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  sucessLogin: string;
  errorLogin: string;
  passwordVisible: boolean;
  passwordValid: boolean;
  isLoading: boolean;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        Validators.minLength(6)
      ]],
      password: ["", [
        Validators.required,
        Validators.minLength(8)
      ]]
    });

    this.nomeErrorMessage = "";
    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.sucessLogin = "";
    this.errorLogin = "";
    this.passwordVisible = false;
    this.passwordValid = false;
    this.isLoading = false;
  }

  // Verifica se um campo tem erro (para compatibilidade com o HTML)
  hasError(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Retorna a mensagem de erro (para compatibilidade com o HTML)
  getErrorMessage(fieldName: string): string {
    if (fieldName === 'nome') return this.nomeErrorMessage;
    if (fieldName === 'email') return this.emailErrorMessage;
    if (fieldName === 'password') return this.passwordErrorMessage;
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

  async onSubmitReactive() {
    // Limpa mensagens anteriores
    this.nomeErrorMessage = "";
    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.sucessLogin = "";
    this.errorLogin = "";

    // Pega os dados do formulário
    const nome = this.signupForm.value.nome;
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    console.log('Valores do formulário:', { nome, email, password });

    // Validações do nome
    if (!nome || nome === "") {
      this.nomeErrorMessage = "O campo de nome é obrigatório";
      return;
    }
    if (nome.length < 3) {
      this.nomeErrorMessage = "O nome deve ter pelo menos 3 caracteres";
      return;
    }

    // Validações do email
    if (!email || email === "") {
      this.emailErrorMessage = "O campo de e-mail é obrigatório";
      return;
    }
    if (email.length < 6) {
      this.emailErrorMessage = "O e-mail deve ter pelo menos 6 caracteres";
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      this.emailErrorMessage = "O e-mail deve conter '@' e '.'";
      return;
    }

    // Validações da senha
    if (!password || password === "") {
      this.passwordErrorMessage = "O campo de senha é obrigatório";
      return;
    }
    if (password.length < 8) {
      this.passwordErrorMessage = "A senha deve ter pelo menos 8 caracteres";
      return;
    }

    // Ativa o loading
    this.isLoading = true;

    try {
      // Prepara o corpo da requisição
      const requestBody = {
        name: nome,
        email: email.trim(),
        password: password
      };

      console.log('Enviando para API:', requestBody);
      console.log('Body stringificado:', JSON.stringify(requestBody));

      // Envia os dados para a API
      let response = await fetch("https://senai-gpt-api.azurewebsites.net/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Status code: " + response.status);

      if (response.status >= 200 && response.status <= 299) {
        this.sucessLogin = "Usuário criado com sucesso!";
        this.errorLogin = "";
        let json = await response.json();
        console.log("Resposta da API:", json);
        
        // Limpa o formulário
        this.signupForm.reset();
        
        // Aguarda um pouco antes de redirecionar
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        // Trata o erro
        let errorData;
        try {
          errorData = await response.json();
          console.log("Erro da API:", errorData);
        } catch (e) {
          errorData = { error: "Erro desconhecido" };
        }

        if (response.status === 409) {
          this.errorLogin = "Este e-mail já está cadastrado. Tente fazer login.";
        } else if (response.status === 400) {
          this.errorLogin = errorData.error || "Dados inválidos. Verifique as informações.";
        } else {
          this.errorLogin = "Erro ao criar usuário. Tente novamente.";
        }
        this.sucessLogin = "";
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      this.errorLogin = "Erro de conexão. Verifique sua internet e tente novamente.";
      this.sucessLogin = "";
    } finally {
      this.isLoading = false;
    }
  }
}
/**abu abu labubu */