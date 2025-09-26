import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserNotes } from './new-user-notes';

describe('NewUserNotes', () => {
  let component: NewUserNotes;
  let fixture: ComponentFixture<NewUserNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUserNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUserNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
