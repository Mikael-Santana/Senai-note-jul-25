import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNotes } from './all-notes';

describe('AllNotes', () => {
  let component: AllNotes;
  let fixture: ComponentFixture<AllNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
