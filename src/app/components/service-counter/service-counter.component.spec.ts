import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCounterComponent } from './service-counter.component';
import { click, expectText, getRandomInt, setFieldValue } from 'src/spec-helpers';
import { CounterService } from 'src/services/counter.service';

describe('ServiceCounterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCounterComponent ],
      providers: [ CounterService ]
    })
    .compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(ServiceCounterComponent);
    fixture.detectChanges();
    return { fixture };
  }

  it('shows the start count', () => {
    const { fixture } = setup();
    expectCount(fixture, 0);
  });


  it('increments the count', () => {
    const { fixture } = setup();
    click(fixture, 'increment-button');
    fixture.detectChanges();
    expectCount(fixture, 1);
  });

  it('decrements the count', () => {
    const { fixture } = setup();
    click(fixture, 'decrement-button');
    fixture.detectChanges();
    expectCount(fixture, -1);
  });

  it('resets the count', () => {
    const { fixture } = setup();
    const newCount = getRandomInt();
    setFieldValue(fixture, 'reset-input', String(newCount));
    click(fixture, 'reset-button');
    fixture.detectChanges();
    expectCount(fixture, newCount);
  });

});

function expectCount<T>(fixture: ComponentFixture<T>, value: number | string, context = '') {
  expectText(fixture, 'count', String(value), context)
}
