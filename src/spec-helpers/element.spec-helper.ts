/* istanbul ignore file */
import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
/**
 * Spec helpers for working with the DOM
 */

/**
 * Returns a random integer between 0 and a max number (default = 10,000)
 *
 * @param max Ceiling of the randomly generated number
 * @returns An integer between 0 and the max (default = 10,000)
 */
export function getRandomInt(max: number = 10000): number {
  return Math.floor(Math.random() * 10000);
}

/**
 * Returns the DebugElement searched with 'data-test-class' attribute.
 *
 * @param fixture Component fixture under test
 * @param testClass 'data-test-class' attribute of the component
 * @returns Targeted DebugElement
 */
export function findElementByTestClass<T>(
  fixture: ComponentFixture<T>,
  testClass: string
): DebugElement {
  const el = fixture.debugElement.query(By.css(`[data-test-class="${testClass}"]`));
  if (!el) {
    throw new Error(`Element "${testClass}" not found`)
  }
  return el;
}

/**
 * Returns text content of the element
 *
 * @param fixture Component fixture under test
 * @param testClass 'data-test-class' attribute of the component
 * @returns Text content wrapped in the element
 */
export function getText<T>(
  fixture: ComponentFixture<T>,
  testClass: string
): string {
  return findElementByTestClass(fixture, testClass).nativeElement.textContent;
}

/**
 * Emulates a click event on the target element
 *
 * @param fixture Component fixture under test
 * @param testClass 'data-test-class' attribute of the component
 */
export function click<T>(
  fixture: ComponentFixture<T>,
  testClass: string
): void {
  const debugEl = findElementByTestClass(fixture, testClass);
  debugEl.triggerEventHandler('click', null);
}

/**
 * Sets text value of the target component
 *
 * @param fixture Component fixture under test
 * @param testClass 'data-test-class' attribute of the component - HTMLInputElement | HTMLTextAreaElement
 * @param value Text value for the target input element
 */
export function setFieldValue<T>(
  fixture: ComponentFixture<T>,
  testClass: string, value: string
): void {
  const el = findElementByTestClass(fixture, testClass);
  setFieldElementValue(el.nativeElement, value);
}

/**
 * Sets text value of the target element
 *
 * @param element Targeted HTMLInputElement | HTMLTextAreaElement
 * @param value Text value for the target input element
 */
export function setFieldElementValue(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  value: string
): void {
  element.value = value;
  const isSelect = element instanceof HTMLSelectElement;
  dispatchFakeEvent(element, isSelect ? 'change' : 'input', isSelect ? false : true);
}

/**
 * Dispatches a fake event -
 *
 * @param element Target element
 * @param type Intended event type
 * @param bubbles Whether to bubble or not
 */
export function dispatchFakeEvent(
  element: EventTarget,
  type: string,
  bubbles: boolean = false
): void {
  const event = document.createEvent('Event');
  event.initEvent(type, bubbles, false);
  element.dispatchEvent(event);
}
