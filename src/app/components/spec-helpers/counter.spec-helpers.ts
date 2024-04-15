import { ComponentFixture } from '@angular/core/testing';
import { expectText } from 'src/spec-helpers';

export function expectCount<T>(
  fixture: ComponentFixture<T>,
  value: number | string,
  context = ''
) {
  expectText(fixture, 'count', String(value), context);
}
