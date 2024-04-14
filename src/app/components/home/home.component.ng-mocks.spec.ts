import { MockComponent } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { By } from '@angular/platform-browser';

import { getRandomInt } from 'src/spec-helpers';

import { HomeComponent } from './home.component';
import { CounterComponent } from '../counter/counter.component';

describe('HomeComponent - ngMocks', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, MockComponent(CounterComponent)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const counterEl = fixture.debugElement.query(By.directive(CounterComponent));

    const counter = counterEl.componentInstance;
    return { fixture, component, counter };
  }

  it('renders an independent counter', () => {
    const { counter } = setup();
    expect(counter).toBeTruthy();
  });

  it('passes a start count', () => {
    const { counter } = setup();
    expect(counter.startCount).toBe(5);
  });

  it('listens for count changes', () => {
    const { counter } = setup();
    const count = 5;
    spyOn(console, 'log');
    counter.countChange.emit(count);
    expect(console.log).toHaveBeenCalledWith(
      'countChange event from CounterComponent', 5
    );
  });

});
