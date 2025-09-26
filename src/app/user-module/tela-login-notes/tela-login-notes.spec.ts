import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaLoginNotes } from './tela-login-notes';

describe('TelaLoginNotes', () => {
  let component: TelaLoginNotes;
  let fixture: ComponentFixture<TelaLoginNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaLoginNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaLoginNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
