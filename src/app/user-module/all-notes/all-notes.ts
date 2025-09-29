import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Note {
  id: number;
  title: string;
  tags: string[];
  date: string;
  icon: string;
  color: string;
  content?: {
    banner: string;
    title: string;
    lastEdited: string;
    tags: string[];
    body: string;
  };
}

@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-notes.html',
  styleUrls: ['./all-notes.css'] // Corrigido: styleUrl → styleUrls
})
export class AllNotes {
  darkMode: boolean = true;
  selectedNote: number = 0;
  searchQuery: string = '';
  editMode: boolean = false;
  editingTitle: string = '';
  editingBody: string = '';
  editingTags: string[] = [];

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
        body: `Planning my trip to Japan!

🗾 Cities to Visit:
- Tokyo (5 days)
- Kyoto (3 days)
- Osaka (2 days)

📝 Things to do:
- Visit temples and shrines
- Try authentic ramen
- Experience onsen
- See cherry blossoms

💰 Budget: $3000
✈️ Flight: Booked
🏨 Hotels: Need to book`
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
        body: `My favorite pasta recipes collection

1. Carbonara
- 400g spaghetti
- 200g guanciale
- 4 egg yolks
- Pecorino Romano
- Black pepper

2. Aglio e Olio
- Spaghetti
- Garlic
- Olive oil
- Red pepper flakes
- Parsley

3. Pesto Pasta
- Basil
- Pine nuts
- Parmesan
- Garlic
- Olive oil`
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
        body: `My weekly fitness routine

Monday: Upper Body
- Bench Press 4x10
- Pull-ups 3x12
- Shoulder Press 3x10

Wednesday: Lower Body
- Squats 4x10
- Deadlifts 3x8
- Lunges 3x12

Friday: Full Body
- Clean and Press
- Burpees
- Mountain Climbers`
      }
    },
    {
      id: 4,
      title: 'Meal Prep Ideas',
      tags: ['Cooking', 'Health', 'Recipes'],
      date: '12 Oct 2024',
      icon: '🍽️',
      color: 'red'
    },
    {
      id: 5,
      title: 'Reading List',
      tags: ['Personal', 'Dev'],
      date: '05 Oct 2024',
      icon: '📚',
      color: 'indigo'
    },
    {
      id: 6,
      title: 'Fitness Goals 2025',
      tags: ['Fitness', 'Health', 'Personal'],
      date: '22 Sep 2024',
      icon: '🎯',
      color: 'gray'
    }
  ];

  get currentNote(): Note | undefined {
    return this.notes.find(note => note.id === this.selectedNote);
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  selectNote(id: number): void {
    this.selectedNote = id;
    this.editMode = false;
    const note = this.currentNote;
    if (note?.content) {
      this.editingTitle = note.content.title;
      this.editingBody = note.content.body;
      this.editingTags = [...note.content.tags];
    }
  }

  createNewNote(): void {
    const newId = Math.max(...this.notes.map(n => n.id)) + 1;
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
        lastEdited: 'Not yet saved',
        tags: [],
        body: 'Start typing your note here...'
      }
    };
    
    this.notes.unshift(newNote); // Adiciona no início da lista
    this.selectedNote = newId;
    this.editMode = true;
    this.editingTitle = newNote.content!.title;
    this.editingBody = newNote.content!.body;
    this.editingTags = [];
  }

  saveNote(): void {
    const note = this.currentNote;
    if (note && note.content) {
      note.content.title = this.editingTitle;
      note.content.body = this.editingBody;
      note.content.tags = this.editingTags;
      note.content.lastEdited = this.getCurrentDate();
      note.title = this.editingTitle;
      note.tags = this.editingTags;
      note.date = this.getCurrentDate();
      this.editMode = false;
      console.log('Note saved successfully!');
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    const note = this.currentNote;
    if (note?.content) {
      this.editingTitle = note.content.title;
      this.editingBody = note.content.body;
      this.editingTags = [...note.content.tags];
    }
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  deleteNote(): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notes = this.notes.filter(note => note.id !== this.selectedNote);
      if (this.notes.length > 0) {
        this.selectedNote = this.notes[0].id;
      }
    }
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

  addTag(tag: string): void {
    if (tag && !this.editingTags.includes(tag)) {
      this.editingTags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.editingTags = this.editingTags.filter(t => t !== tag);
  }
}