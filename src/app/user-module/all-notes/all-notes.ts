import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faBox, faPenToSquare, faHouse, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

// Interface que define o formato de uma Nota
interface INote {
  id?: number;
  titulo: string;
  descricao: string;
  usuarioId: number;
  tags: string[];
  imagemUrl?: string;
  dataEdicao?: string;
}

@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, ImageCropperComponent],
  templateUrl: './all-notes.html',
  styleUrls: ['./all-notes.css']
})
export class AllNotes {
  faTrash = faTrash;
  faBox = faBox;
  faPenToSquare = faPenToSquare;
  faHouse = faHouse;
  faMoon = faMoon;
  faSun = faSun;
  faUser = faUser;

  // URL da API
  private apiUrl = 'http://localhost:3000/notas';

  // Lista de notas carregadas
  notes: INote[] = [];

  // Nota atualmente selecionada
  notaSelecionada: INote | null = null;

  // Modos
  modoEdicao: boolean = false;
  modoCriacao: boolean = false;

  // Controles de formulário
  tituloControl = new FormControl("");
  conteudoControl = new FormControl("");
  tagsControl = new FormControl("");
  imagemUrlControl = new FormControl("");

  // Controles do cropper
  imageChangedEvent: any = '';
  croppedImage: string = '';
  mostrarCropper: boolean = false; // controla se o cropper aparece

  // Filtros
  tagsFiltradas: string[] = [];
  termoBusca = new FormControl("");

  // Lista de todas as tags
  todasTags: string[] = [];

  // Modo de visualização
  viewMode: 'list' | 'archived' = 'list';

  // Dark mode
  darkMode: boolean = false;

  // ID do usuário logado
  usuarioLogadoId: number = 1;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getNotes();

    // Carrega preferência do dark mode
    let darkModeLocalStorage = localStorage.getItem("darkMode");
    if (darkModeLocalStorage == "true") {
      this.darkMode = true;
      document.body.classList.toggle("dark-mode", this.darkMode);
    }

    console.log("🚀 Componente All Notes inicializado!");
  }

  // ===============================================
  // 📝 MÉTODO AUXILIAR PARA O HTML
  // ===============================================
  getDescricao(): string {
    return this.notaSelecionada?.descricao || '';
  }

  // ===============================================
  // 📸 FUNÇÕES DO IMAGE CROPPER
  // ===============================================

  // Evento disparado quando o usuário escolhe uma imagem
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.mostrarCropper = true;
    console.log("🖼️ Imagem selecionada para recorte.");
  }

  // Quando o corte é feito
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 || '';
    this.imagemUrlControl.setValue(this.croppedImage);
    console.log("✂️ Imagem cortada gerada!");
  }

  // Quando o usuário confirma o recorte
  confirmarRecorte() {
    this.mostrarCropper = false;
    console.log("✅ Recorte confirmado!");
  }

  cancelarRecorte() {
    this.mostrarCropper = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
    console.log("❌ Recorte cancelado.");
  }

  // ===============================================
  // 🔹 CRUD DE NOTAS
  // ===============================================

  async getNotes() {
    try {
      const response = await firstValueFrom(this.http.get<INote[]>(this.apiUrl));
      this.notes = response.filter(note => note.usuarioId === this.usuarioLogadoId);
      this.extrairTodasTags();
      this.cd.detectChanges();
    } catch (error) {
      console.error("❌ Erro ao buscar notas:", error);
      alert("Erro ao carregar notas. Verifique se a API está ativa.");
    }
  }

  extrairTodasTags() {
    const tagsSet = new Set<string>();
    this.notes.forEach(note => note.tags.forEach(tag => tagsSet.add(tag)));
    this.todasTags = Array.from(tagsSet).sort();
  }

  onNoteClick(nota: INote) {
    this.notaSelecionada = nota;
    this.modoEdicao = false;
    this.modoCriacao = false;

    this.tituloControl.setValue(nota.titulo);
    this.conteudoControl.setValue(nota.descricao);
    this.tagsControl.setValue(nota.tags.join(", "));
    this.imagemUrlControl.setValue(nota.imagemUrl || "");
  }

  criarNovaNota() {
    this.modoCriacao = true;
    this.modoEdicao = false;
    this.notaSelecionada = null;
    this.tituloControl.setValue("");
    this.conteudoControl.setValue("");
    this.tagsControl.setValue("");
    this.imagemUrlControl.setValue("");
  }

  cancelar() {
    this.modoCriacao = false;
    this.modoEdicao = false;
    this.mostrarCropper = false;

    if (this.notaSelecionada) {
      this.onNoteClick(this.notaSelecionada);
    }
  }

  async salvarNota() {
    const titulo = this.tituloControl.value?.trim();
    const conteudo = this.conteudoControl.value?.trim();
    const tagsString = this.tagsControl.value?.trim();

    if (!titulo || !conteudo) {
      alert("Título e conteúdo são obrigatórios!");
      return;
    }

    const tags = tagsString
      ? tagsString.split(",").map(tag => tag.trim()).filter(tag => tag)
      : [];

    const imagemUrl = this.imagemUrlControl.value?.trim() || "";

    try {
      if (this.modoCriacao) {
        const novaNota: INote = {
          titulo,
          descricao: conteudo,
          tags,
          imagemUrl,
          usuarioId: this.usuarioLogadoId,
          dataEdicao: new Date().toISOString()
        };

        await firstValueFrom(this.http.post<INote>(this.apiUrl, novaNota));
        alert("Nota criada com sucesso!");
      } else if (this.notaSelecionada) {
        const notaAtualizada: INote = {
          id: this.notaSelecionada.id,
          titulo,
          descricao: conteudo,
          tags,
          imagemUrl,
          usuarioId: this.usuarioLogadoId,
          dataEdicao: new Date().toISOString()
        };

        await firstValueFrom(this.http.put<INote>(`${this.apiUrl}/${this.notaSelecionada.id}`, notaAtualizada));
        alert("Nota atualizada com sucesso!");
      }

      await this.getNotes();
      this.modoCriacao = false;
      this.modoEdicao = false;
    } catch (error) {
      console.error("❌ Erro ao salvar nota:", error);
      alert("Erro ao salvar nota. Verifique o console.");
    }
  }

  async deletarNota() {
    if (!this.notaSelecionada || !this.notaSelecionada.id) return;

    const confirmacao = confirm(`Tem certeza que deseja deletar "${this.notaSelecionada.titulo}"?`);
    if (!confirmacao) return;

    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${this.notaSelecionada.id}`));
      alert("Nota deletada!");
      this.notaSelecionada = null;
      await this.getNotes();
    } catch (error) {
      alert("Erro ao deletar nota.");
    }
  }

  get notasFiltradas(): INote[] {
    let notas = this.notes;
    const termo = this.termoBusca.value?.toLowerCase();

    if (termo) {
      notas = notas.filter(note =>
        note.titulo.toLowerCase().includes(termo) ||
        note.descricao.toLowerCase().includes(termo) ||
        note.tags.some(tag => tag.toLowerCase().includes(termo))
      );
    }

    if (this.tagsFiltradas.length > 0) {
      notas = notas.filter(note =>
        this.tagsFiltradas.every(tag => note.tags.includes(tag))
      );
    }

    return notas.sort((a, b) => {
      const dataA = a.dataEdicao ? new Date(a.dataEdicao).getTime() : 0;
      const dataB = b.dataEdicao ? new Date(b.dataEdicao).getTime() : 0;
      return dataB - dataA;
    });
  }

  toggleTagFilter(tag: string) {
    const index = this.tagsFiltradas.indexOf(tag);
    if (index > -1) this.tagsFiltradas.splice(index, 1);
    else this.tagsFiltradas.push(tag);
  }

  formatarData(data?: string): string {
    if (!data) return 'Sem data';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  ligarDesligarDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark-mode", this.darkMode);
    localStorage.setItem("darkMode", this.darkMode.toString());
  }

  logout() {
    localStorage.removeItem("meuToken");
    localStorage.removeItem("meuId");
    window.location.href = "login";
  }
}