import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBox, faPenToSquare, faHouse, faUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

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
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl:'./all-notes.html',
  styleUrls: ['./all-notes.css']
})
export class AllNotes {
  faTrash = faTrash;
  faBox= faBox
  faPenToSquare=faPenToSquare
  faHouse=faHouse
  faUser=faUser
  faMoon=faMoon
  faSun=faSun
  
  // URL da API mockada
  private apiUrl = 'http://localhost:3000/notas';

  // Lista de notas carregadas da API
  notes: INote[] = [];

  // Nota atualmente selecionada
  notaSelecionada: INote | null = null;

  // Modos de operação
  modoEdicao: boolean = false;
  modoCriacao: boolean = false;

  // Controles de formulário
  tituloControl = new FormControl("");
  conteudoControl = new FormControl("");
  tagsControl = new FormControl("");
  imagemUrlControl = new FormControl("");

  // Filtros
  tagsFiltradas: string[] = [];
  termoBusca = new FormControl("");

  // Lista de todas as tags disponíveis
  todasTags: string[] = [];

  // Modo de visualização
  viewMode: 'list' | 'archived' = 'list';

  // Dark mode
  darkMode: boolean = false;

  // ID do usuário logado
  usuarioLogadoId: number = 1;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getNotes();
    
    // Carrega preferência de dark mode
    let darkModeLocalStorage = localStorage.getItem("darkMode");
    if (darkModeLocalStorage == "true") {
      this.darkMode = true;
      document.body.classList.toggle("dark-mode", this.darkMode);
    }

    console.log("🚀 Componente All Notes inicializado!");
    console.log("📡 API URL:", this.apiUrl);
  }

  // Método auxiliar para obter descrição (evita erro com caracteres especiais)
  getDescricao(): string {
    return this.notaSelecionada?.descricao || '';
  }

  // Busca as notas da API
  async getNotes() {
    try {
      console.log("📥 Buscando notas da API...");
      
      const response = await firstValueFrom(
        this.http.get<INote[]>(this.apiUrl)
      );

      console.log("✅ Notas recebidas:", response);

      // Filtra apenas as notas do usuário logado
      this.notes = response.filter(note => note.usuarioId === this.usuarioLogadoId);
      
      console.log("📝 Notas filtradas do usuário:", this.notes);
      
      this.extrairTodasTags();
      this.cd.detectChanges();
    } catch (error) {
      console.error("❌ Erro ao buscar notas:", error);
      alert("Não foi possível carregar as notas. Verifique se a API está rodando em http://localhost:3000");
    }
  }

  // Extrai todas as tags únicas das notas
  extrairTodasTags() {
    const tagsSet = new Set<string>();
    this.notes.forEach(note => {
      note.tags.forEach(tag => tagsSet.add(tag));
    });
    this.todasTags = Array.from(tagsSet).sort();
    console.log("🏷️ Tags disponíveis:", this.todasTags);
  }

  // Quando o usuário clica em uma nota
  onNoteClick(nota: INote) {
    console.log("👆 Nota clicada:", nota);
    
    this.notaSelecionada = nota;
    this.modoEdicao = false;
    this.modoCriacao = false;
    
    // Preenche os campos com os dados da nota
    this.tituloControl.setValue(nota.titulo);
    this.conteudoControl.setValue(nota.descricao);
    this.tagsControl.setValue(nota.tags.join(", "));
    this.imagemUrlControl.setValue(nota.imagemUrl || "");
    
    this.cd.detectChanges();
  }

  // Inicia modo de criação de nova nota
  criarNovaNota() {
    console.log("➕ Iniciando criação de nova nota...");
    
    this.modoCriacao = true;
    this.modoEdicao = false;
    this.notaSelecionada = null;
    
    // Limpa os campos
    this.tituloControl.setValue("");
    this.conteudoControl.setValue("");
    this.tagsControl.setValue("");
    this.imagemUrlControl.setValue("");
  }

  // Cancela edição ou criação
  cancelar() {
    console.log("❌ Cancelando operação...");
    
    this.modoCriacao = false;
    this.modoEdicao = false;
    
    if (this.notaSelecionada) {
      this.onNoteClick(this.notaSelecionada);
    }
  }

  // Salva nota (cria nova ou atualiza existente)
  async salvarNota() {
    const titulo = this.tituloControl.value?.trim();
    const conteudo = this.conteudoControl.value?.trim();
    const tagsString = this.tagsControl.value?.trim();
    
    if (!titulo || !conteudo) {
      alert("Título e conteúdo são obrigatórios!");
      return;
    }

    // Processa as tags
    const tags = tagsString 
      ? tagsString.split(",").map(tag => tag.trim()).filter(tag => tag)
      : [];

    const imagemUrl = this.imagemUrlControl.value?.trim() || "";

    try {
      if (this.modoCriacao) {
        // ========== CRIAR NOVA NOTA ==========
        console.log("💾 Criando nova nota...");
        
        const novaNota: INote = {
          titulo: titulo,
          descricao: conteudo,
          tags: tags,
          imagemUrl: imagemUrl,
          usuarioId: this.usuarioLogadoId,
          dataEdicao: new Date().toISOString()
        };

        console.log("📤 Dados a serem enviados:", novaNota);

        // POST - json-server vai gerar o ID automaticamente
        const notaCriada = await firstValueFrom(
          this.http.post<INote>(this.apiUrl, novaNota)
        );

        console.log("✅ Nota criada com sucesso:", notaCriada);
        alert("Nota criada com sucesso!");
        
      } else if (this.notaSelecionada) {
        // ========== ATUALIZAR NOTA EXISTENTE ==========
        console.log("✏️ Atualizando nota ID:", this.notaSelecionada.id);
        
        const notaAtualizada: INote = {
          id: this.notaSelecionada.id,
          titulo: titulo,
          descricao: conteudo,
          tags: tags,
          imagemUrl: imagemUrl,
          usuarioId: this.usuarioLogadoId,
          dataEdicao: new Date().toISOString()
        };

        console.log("📤 Dados da atualização:", notaAtualizada);

        // PUT - atualiza a nota completa
        await firstValueFrom(
          this.http.put<INote>(
            `${this.apiUrl}/${this.notaSelecionada.id}`,
            notaAtualizada
          )
        );

        console.log("✅ Nota atualizada com sucesso!");
        alert("Nota atualizada com sucesso!");
      }

      // Recarrega as notas
      await this.getNotes();
      this.modoCriacao = false;
      this.modoEdicao = false;
      
    } catch (error) {
      console.error("❌ Erro ao salvar nota:", error);
      alert("Não foi possível salvar a nota. Verifique o console para mais detalhes.");
    }
  }

  // Deleta a nota selecionada
  async deletarNota() {
    if (!this.notaSelecionada || !this.notaSelecionada.id) return;

    const confirmacao = confirm(`Tem certeza que deseja deletar a nota "${this.notaSelecionada.titulo}"?`);
    if (!confirmacao) return;

    console.log("🗑️ Deletando nota ID:", this.notaSelecionada.id);

    try {
      // DELETE - remove a nota do json-server
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${this.notaSelecionada.id}`)
      );

      console.log("✅ Nota deletada com sucesso!");
      alert("Nota deletada com sucesso!");
      
      this.notaSelecionada = null;
      await this.getNotes();
      
    } catch (error) {
      console.error("❌ Erro ao deletar nota:", error);
      alert("Não foi possível deletar a nota.");
    }
  }

  // Getter para notas filtradas
  get notasFiltradas(): INote[] {
    let notas = this.notes;

    // Filtro de busca
    const termo = this.termoBusca.value?.toLowerCase();
    if (termo) {
      notas = notas.filter(note => 
        note.titulo.toLowerCase().includes(termo) ||
        note.descricao.toLowerCase().includes(termo) ||
        note.tags.some(tag => tag.toLowerCase().includes(termo))
      );
    }

    // Filtro de tags
    if (this.tagsFiltradas.length > 0) {
      notas = notas.filter(note =>
        this.tagsFiltradas.every(tag => note.tags.includes(tag))
      );
    }

    // Ordena por data de edição (mais recente primeiro)
    return notas.sort((a, b) => {
      const dataA = a.dataEdicao ? new Date(a.dataEdicao).getTime() : 0;
      const dataB = b.dataEdicao ? new Date(b.dataEdicao).getTime() : 0;
      return dataB - dataA;
    });
  }

  // Toggle filtro de tag
  toggleTagFilter(tag: string) {
    const index = this.tagsFiltradas.indexOf(tag);
    if (index > -1) {
      this.tagsFiltradas.splice(index, 1);
      console.log("🏷️ Tag removida do filtro:", tag);
    } else {
      this.tagsFiltradas.push(tag);
      console.log("🏷️ Tag adicionada ao filtro:", tag);
    }
  }

  // Formata data para exibição
  formatarData(data?: string): string {
    if (!data) return 'Sem data';
    
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  // Toggle dark mode
  ligarDesligarDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark-mode", this.darkMode);
    localStorage.setItem("darkMode", this.darkMode.toString());
    console.log("🌓 Dark mode:", this.darkMode ? "ativado" : "desativado");
  }

  // Logout
  logout() {
    console.log("👋 Fazendo logout...");
    localStorage.removeItem("meuToken");
    localStorage.removeItem("meuId");
    window.location.href = "login";
  }
}  