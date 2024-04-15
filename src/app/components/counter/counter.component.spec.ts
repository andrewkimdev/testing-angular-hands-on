import { TestBed } from '@angular/core/testing';
import { take, toArray } from 'rxjs/operators';

import { CounterComponent } from './counter.component';
import { click, getRandomInt, setFieldValue } from 'src/spec-helpers';
import { expectCount } from '../spec-helpers';

describe('CounterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;
    const startCount = getRandomInt();
    component.startCount = startCount;

    component.ngOnChanges();
    fixture.detectChanges();

    return { fixture, component };
  }

  it('should render component', () => {
    // Arrange
    // Act
    const { component } = setup();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should increment', () => {
    // Arrange
    const { fixture, component } = setup();
    // Act
    click(fixture, 'increment-button');
    fixture.detectChanges();
    // Assert
    expectCount(fixture, component.startCount + 1, 'show incremented count');
  });

  it('should decrement', () => {
    // Arrange
    const { fixture, component } = setup();
    // Act
    click(fixture, 'decrement-button');
    fixture.detectChanges();
    // Assert
    expectCount(fixture, component.startCount - 1, 'show decremented count');
  });

  it('should reset counter', () => {
    // Arrange
    const { fixture } = setup();
    const newCount = getRandomInt();
    // Act
    setFieldValue(fixture, 'reset-input', String(newCount));
    click(fixture, 'reset-button');
    fixture.detectChanges();
    // Assert
    expectCount(fixture, newCount, 'reset count');
  });

  it('should not reset counter if non-number', () => {
    // Arrange
    const { fixture, component } = setup();
    const { startCount } = component;
    // Act
    const newCount = 'non-number';
    setFieldValue(fixture, 'reset-input', String(newCount));
    click(fixture, 'reset-button');
    // Assert
    expectCount(fixture, startCount, 'reset count');
  });

  it('emits countChange events', (done: DoneFn) => {
    // Arrange
    const { fixture, component } = setup();
    const newCount = getRandomInt();

    // Capture all emitted values in an array
    let actualCounts: number[] | undefined;

    // Transform the Observable, then subscribe
    component.countChange.pipe(take(3), toArray()).subscribe((count) => {
      actualCounts = count;
      // Assert
      const { startCount } = component;
      expect(actualCounts).toEqual([startCount + 1, startCount, newCount]);
      done();
    });

    // Act
    click(fixture, 'increment-button');
    click(fixture, 'decrement-button');
    setFieldValue(fixture, 'reset-input', String(newCount));
    click(fixture, 'reset-button');
  });
});
