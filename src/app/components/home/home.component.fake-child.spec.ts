import { TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';

import { findElementByDirective, getRandomInt } from 'src/spec-helpers';

import { HomeComponent } from './home.component';
import { CounterComponent } from '../counter/counter.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-counter', template: '',
})
class FakeCounterComponent implements Partial<CounterComponent> {
  @Input() public startCount = 0;
  @Output() public countChange = new EventEmitter<number>();
}

describe('HomeComponent', () => {
    beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, FakeCounterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    const counterEl = fixture.debugElement.query(By.directive(FakeCounterComponent));
    const counter: CounterComponent = counterEl.componentInstance;
    fixture.detectChanges();

    return { fixture, component, counter };
  }

  it('renders app-counter component', () => {
    // Arrange + Act
    const { counter } = setup();

    // Assert
    expect(counter).toBeTruthy();
  });

  it('passes a start count', () => {
    // Arrange
    const { counter } = setup();
    spyOn(console, 'log');
    const count = getRandomInt();

    // Act
    counter.countChange.emit(count);

    // Assert
    expect(console.log).toHaveBeenCalledWith('countChange event from CounterComponent', count);
  });

  it('passes a start count', () => {
    // Arrange + Act
    const { counter } = setup();

    // Assert
    expect(counter.startCount).toBe(5);
  })
});
