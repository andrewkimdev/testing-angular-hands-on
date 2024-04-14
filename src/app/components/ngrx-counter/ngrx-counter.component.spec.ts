import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxCounterComponent } from './ngrx-counter.component';

describe('NgrxCounterComponent', () => {
  let component: NgrxCounterComponent;
  let fixture: ComponentFixture<NgrxCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgrxCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
