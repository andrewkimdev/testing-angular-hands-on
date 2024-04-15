import { TestBed } from '@angular/core/testing';

import { ServiceCounterComponent } from './service-counter.component';
import { CounterService } from 'src/services/counter.service';

import { click, getRandomInt, setFieldValue } from 'src/spec-helpers';
import { expectCount } from '../spec-helpers';
import { BehaviorSubject, of } from 'rxjs';

describe('ServiceCounterComponent: integration test', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceCounterComponent],
      providers: [CounterService],
    }).compileComponents();
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

describe('ServiceCounterComponent: unit test', () => {
  const currentCount = getRandomInt();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceCounterComponent],
      // Use fake instead of original
      providers: [
        { provide: CounterService, useValue: getFakeCounterService() },
      ],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(ServiceCounterComponent);
    const component = fixture.componentInstance;
    const counterService = TestBed.inject(CounterService);
    fixture.detectChanges();
    return { fixture, component, counterService };
  }

  function getFakeCounterService() {
    return jasmine.createSpyObj<CounterService>('CounterService', {
      getCount: of(currentCount),
      increment: undefined,
      decrement: undefined,
      reset: undefined,
    });
  }

  it('shows the count', () => {
    const { fixture, counterService } = setup();
    expectCount(fixture, currentCount);
    expect(counterService.getCount).toHaveBeenCalled();
  });

  it('increments the count', () => {
    const { fixture, counterService } = setup();
    click(fixture, 'increment-button');
    expect(counterService.increment).toHaveBeenCalled();
  });

  it('decrements the count', () => {
    const { fixture, counterService } = setup();
    click(fixture, 'decrement-button');
    expect(counterService.decrement).toHaveBeenCalled();
  });

  it('resets the counter', () => {
    const newCount = getRandomInt();
    const { fixture, counterService } = setup();
    setFieldValue(fixture, 'reset-input', String(newCount));
    click(fixture, 'reset-button');
    expect(counterService.reset).toHaveBeenCalledWith(newCount);
  });
});

describe('ServiceCounterComponent: unit test with minimal Service logic', () => {
  const newCount = getRandomInt();

  beforeEach(async () => {
    const { fakeCounterService } = createFakeCounterService();
    await TestBed.configureTestingModule({
      declarations: [ServiceCounterComponent],
      providers: [{ provide: CounterService, useValue: fakeCounterService }],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(ServiceCounterComponent);
    fixture.detectChanges();
    const counterService = TestBed.inject(CounterService);
    return { fixture, counterService };
  }

  it('shows the start count', () => {
    const { fixture } = setup();
    expectCount(fixture, 0);
  });

  it('increments the count', () => {
    const { fixture, counterService } = setup();
    click(fixture, 'increment-button');
    fixture.detectChanges();

    expectCount(fixture, 1);
    expect(counterService.increment).toHaveBeenCalled();
  });

  it('decrements the count', () => {
    const { fixture, counterService } = setup();
    click(fixture, 'decrement-button');
    fixture.detectChanges();

    expectCount(fixture, -1);
    expect(counterService.decrement).toHaveBeenCalled();
  });

  it('resets the count', () => {
    const { fixture, counterService } = setup();
    setFieldValue(fixture, 'reset-input', String(newCount));
    click(fixture, 'reset-button');
    fixture.detectChanges();

    expectCount(fixture, newCount);
    expect(counterService.reset).toHaveBeenCalled();
  });

  function createFakeCounterService() {
    const fakeCount$ = new BehaviorSubject(0);
    const fakeCounterService = {
      getCount() {
        return fakeCount$;
      },
      increment() {
        fakeCount$.next(1);
      },
      decrement() {
        fakeCount$.next(-1);
      },
      reset() {
        fakeCount$.next(Number(newCount));
      },
    };
    spyOn(fakeCounterService, 'getCount').and.callThrough();
    spyOn(fakeCounterService, 'increment').and.callThrough();
    spyOn(fakeCounterService, 'decrement').and.callThrough();
    spyOn(fakeCounterService, 'reset').and.callThrough();

    return { fakeCounterService };
  }
});
