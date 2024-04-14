import { TestBed } from '@angular/core/testing';
import { findComponent, getRandomInt } from 'src/spec-helpers';

import { HomeComponent } from './home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('renders without errors', () => {
    // Arrange + Act
    const { component } = setup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('renders an independent counter', () => {
    // Arrange + Act
    const { fixture } = setup();
    const counter = findComponent(fixture, 'app-counter')

    // Assert
    expect(counter).toBeTruthy();
  });

  it('passes a start count', () => {
    // Arrange + Act
    const { fixture } = setup();
    const counter = findComponent(fixture, 'app-counter');

    // Assert
    expect(counter.properties.startCount).toBe(5);
  });

  it('renders a service counter', () => {
    // Arrange + Act
    const { fixture } = setup();
    const serviceCounter = findComponent(fixture, 'app-service-counter');

    // Assert
    expect(serviceCounter).toBeTruthy();
  });

  it('renders an ngrx counter', () => {
    // Arrange + Act
    const { fixture } = setup();
    const ngrxCounter = findComponent(fixture, 'app-ngrx-counter');
    // Assert
    expect(ngrxCounter).toBeTruthy();
  });

    it('listens for count changes', () => {
    // Arrange
    const { fixture } = setup();
    const count = getRandomInt();
    const counter = findComponent(fixture, 'app-counter');
    spyOn(console, 'log');

    // Act
    counter.triggerEventHandler('countChange', count);

    // Assert
    expect(console.log).toHaveBeenCalledWith('countChange event from CounterComponent', count)
  });
});
