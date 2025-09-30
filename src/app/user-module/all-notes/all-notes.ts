import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface NoteContent {
  banner: string;
  title: string;
  lastEdited: string;
  tags: string[];
  body: string;
}

interface Note {
  id: number;
  title: string;
  icon: string;
  color: string;
  date: string;
  tags: string[];
  content: NoteContent; // agora obrigatório (não opcional)
}

@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-notes.html',
  styleUrls: ['./all-notes.css']
})
export class AllNotes {
  notes: Note[] = [
    {
      id: 0,
      title: 'Untitled Note',
      tags: [],
      date: this.getCurrentDate(),
      icon: '📝',
      color: 'gray',
      content: {
        banner: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        title: 'Enter a title...',
        lastEdited: 'Not yet saved',
        tags: [],
        body: 'Start typing your note here...'
      }
    },
    {
      id: 1,
      title: 'Japan Travel Planning',
      tags: ['Travel', 'Personal'],
      date: '28 Oct 2024',
      icon: '✈️',
      color: 'pink',
      content: {
        banner: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
        title: 'Japan Travel Planning',
        lastEdited: '28 Oct 2024',
        tags: ['Travel', 'Personal'],
        body: 'Planning my trip to Japan!\n\n🗾 Cities to Visit: ...'
      }
    },
    {
      id: 2,
      title: 'Favorite Pasta Recipes',
      tags: ['Cooking', 'Recipes'],
      date: '27 Oct 2024',
      icon: '🍝',
      color: 'orange',
      content: {
        banner: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)',
        title: 'Favorite Pasta Recipes',
        lastEdited: '27 Oct 2024',
        tags: ['Cooking', 'Recipes'],
        body: '1. Carbonara - 400g spaghetti - 200g guanciale - 4 egg yolks - Pecorino Romano - Black pepper\n2. Aglio e Olio - Spaghetti - Garlic - Olive oil - Red pepper flakes - Parsley\n3. Pesto Pasta - Basil - Pine nuts - Parmesan - Garlic - Olive oil'
      }
    },
    {
      id: 3,
      title: 'Weekly Workout Plan',
      tags: ['Dev', 'React'],
      date: '25 Oct 2024',
      icon: '💪',
      color: 'green',
      content: {
        banner: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        title: 'Weekly Workout Plan',
        lastEdited: '25 Oct 2024',
        tags: ['Dev', 'React'],
        body: 'Monday: Upper Body - Bench Press 4x10 - Pull-ups 3x12 - Shoulder Press 3x10\nWednesday: Lower Body - Squats 4x10 - Deadlifts 3x8 - Lunges 3x12\nFriday: Full Body - Clean and Press - Burpees - Mountain Climbers'
      }
    },
    {
      id: 4,
      title: 'Meal Prep Ideas',
      tags: ['Cooking', 'Health', 'Recipes'],
      date: '12 Oct 2024',
      icon: '🍽️',
      color: 'red',
      content: {
        banner: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        title: 'Meal Prep Ideas',
        lastEdited: '12 Oct 2024',
        tags: ['Cooking', 'Health', 'Recipes'],
        body: 'Ideas for weekly meal prep:\n- Breakfast: Overnight oats, Smoothie bowls\n- Lunch: Chicken quinoa salad, Veggie wraps\n- Dinner: Baked salmon, Stir-fried vegetables\n- Snacks: Nuts, Fruits, Yogurt'
      }
    },
    {
      id: 5,
      title: 'Reading List',
      tags: ['Personal', 'Dev'],
      date: '05 Oct 2024',
      icon: '📚',
      color: 'indigo',
      content: {
        banner: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        title: 'Reading List',
        lastEdited: '05 Oct 2024',
        tags: ['Personal', 'Dev'],
        body: 'Books to read:\n1. Clean Code - Robert C. Martin\n2. The Pragmatic Programmer - Andrew Hunt\n3. Deep Work - Cal Newport\n4. Atomic Habits - James Clear'
      }
    },
    {
      id: 6,
      title: 'Fitness Goals 2025',
      tags: ['Fitness', 'Health', 'Personal'],
      date: '22 Sep 2024',
      icon: '🎯',
      color: 'gray',
      content: {
        banner: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        title: 'Fitness Goals 2025',
        lastEdited: '22 Sep 2024',
        tags: ['Fitness', 'Health', 'Personal'],
        body: 'Goals for next year:\n- Lose 5kg\n- Run a half marathon\n- Workout 4 times a week\n- Maintain healthy diet\n- Track progress monthly'
      }
    }
  ];

  // UI / edição
  selectedNote: number | null = this.notes.length ? this.notes[0].id : null;
  darkMode = true;
  editMode = false;

  // edição temporária
  editingTitle = '';
  editingBody = '';
  editingTags: string[] = [];

  // busca / tags disponíveis
  searchQuery = '';
  availableTags: string[] = ['Dev', 'React', 'Travel', 'Personal', 'Cooking', 'Health', 'Fitness', 'Recipes'];

  constructor(private router: Router) {
    // tenta carregar preferência de tema
    try {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) this.darkMode = JSON.parse(stored);
    } catch { }
    // inicializa editor com a nota selecionada
    if (this.selectedNote !== null) {
      const n = this.currentNote;
      if (n) {
        this.editingTitle = n.content.title;
        this.editingBody = n.content.body;
        this.editingTags = [...n.content.tags];
      }
    }
  }

  // getter que o template usa para mostrar a nota atual
  get currentNote(): Note | undefined {
    return this.notes.find(n => n.id === this.selectedNote!);
  }

  // notas filtradas pela searchQuery (usado no *ngFor)
  get filteredNotes(): Note[] {
    const q = this.searchQuery?.trim().toLowerCase();
    if (!q) return this.notes;
    return this.notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.body.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q)) ||
      n.content.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Ações
  selectNote(id: number) {
    this.selectedNote = id;
    const note = this.currentNote;
    this.editMode = false;
    if (note) {
      this.editingTitle = note.content.title;
      this.editingBody = note.content.body;
      this.editingTags = [...note.content.tags];
    } else {
      this.editingTitle = '';
      this.editingBody = '';
      this.editingTags = [];
    }
  }

  createNewNote() {
    const newId = this.notes.length ? Math.max(...this.notes.map(n => n.id)) + 1 : 0;
    const newNote: Note = {
      id: newId,
      title: 'Untitled Note',
      tags: [],
      date: this.getCurrentDate(),
      icon: '📝',
      color: 'gray',
      content: {
        banner: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        title: 'Enter a title...',
        lastEdited: this.getCurrentDate(),
        tags: [],
        body: ''
      }
    };
    this.notes.unshift(newNote);
    this.selectNote(newId);
    this.enableEditMode();
  }

  enableEditMode() {
    const note = this.currentNote;
    if (!note) return;
    this.editMode = true;
    this.editingTitle = note.content.title;
    this.editingBody = note.content.body;
    this.editingTags = [...note.content.tags];
  }

  cancelEdit() {
    const note = this.currentNote;
    if (note) {
      this.editingTitle = note.content.title;
      this.editingBody = note.content.body;
      this.editingTags = [...note.content.tags];
    }
    this.editMode = false;
  }

  saveNote() {
    const note = this.currentNote;
    if (!note) return;
    note.content.title = this.editingTitle || 'Untitled Note';
    note.content.body = this.editingBody;
    note.content.tags = [...this.editingTags];
    note.content.lastEdited = this.getCurrentDate();
    note.title = note.content.title;
    note.tags = [...this.editingTags];
    note.date = this.getCurrentDate();
    this.editMode = false;
  }

  addTag(tag: string) {
    const t = (tag || '').trim();
    if (!t) return;
    if (!this.editingTags.includes(t)) this.editingTags.push(t);
  }

  removeTag(tag: string) {
    this.editingTags = this.editingTags.filter(t => t !== tag);
  }

  deleteNote(noteId: number) {
    this.notes = this.notes.filter(n => n.id !== noteId);
    if (this.selectedNote === noteId) {
      if (this.notes.length) {
        this.selectNote(this.notes[0].id);
      } else {
        this.selectedNote = null;
        this.editMode = false;
      }
    }
  }

  logout() {
    localStorage.removeItem('meuTokem');
    localStorage.removeItem('meuId');
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
  }

  getCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options);
  }
}
