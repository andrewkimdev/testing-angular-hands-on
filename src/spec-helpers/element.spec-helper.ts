/* istanbul ignore file */
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
/**
 * Spec helpers for working with the DOM
 */

/**
 * Returns a random integer between 0 and a max number (default = 10,000)
 *
 * @param min Floor of the randomly generated number
 * @param max Ceiling of the randomly generated number
 * @returns An integer between 0 and the max (default = 10,000)
 */
export function getRandomInt(min = 0, max = 1000): number {
  // Ensure the range is properly defined
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  const el = fixture.debugElement.query(
    By.css(`[data-test-class="${testClass}"]`)
  );
  if (!el) {
    throw new Error(`Element "${testClass}" not found`);
  }
  return el;
}

/**
 * Returns the DebugElement searched with directive
 *
 * @param fixture Component fixture under test
 * @param directive Directive name, e.g., 'AppComponent'
 * @returns DebugElement
 */
export function findElementByDirective<T>(
  fixture: ComponentFixture<T>,
  directive: any
): DebugElement {
  const el = fixture.debugElement.query(By.directive(directive));
  if (!el) {
    throw new Error(`Element "${directive}" not found`);
  }
  return el;
}

/**
 * Finds the first DebugElement instance of the target css selector
 *
 * @param fixture Component fixture under test
 * @param selector css selector for the target component
 * @returns DebugElement of the target component
 */
export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
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
 * Assertion function for a targeted component and its text content
 *
 * @param fixture Component fixture under test
 * @param testClass 'data-test-class' attribute of the component
 * @param text Expected text in the component
 * @param context Explanatory context data
 */
export function expectText<T>(
  fixture: ComponentFixture<T>,
  testClass: string,
  text: string,
  context: string = ''
): void {
  const actualText = getText(fixture, testClass);
  expect(actualText).withContext(context).toBe(text);
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
 * Makes a fake click event object
 *
 * @param target Button / Link elements
 * @returns Partial<MouseEvent>
 */
export function makeClickEvent(target: EventTarget): Partial<MouseEvent> {
  return {
    preventDefault: void {},
    stopPropagation: void {},
    stopImmediatePropagation: void {},
    type: 'click',
    target,
    currentTarget: target,
    bubbles: true,
    cancelable: true,
    button: 0,
  };
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
  testClass: string,
  value: string
): void {
  const el = findElementByTestClass(fixture, testClass);
  setFieldElementValue(el.nativeElement, value);
}

/**
 * Sets check value of the target component
 *
 * @param fixture Component fixture under test
 * @param testClass 'data-test-class' attribute of the component - HTMLInputElement
 * @param value Text value for the target input element
 */
export function checkField<T>(
  fixture: ComponentFixture<T>,
  testClass: string,
  checked: boolean
): void {
  const { nativeElement } = findElementByTestClass(fixture, testClass);
  nativeElement.checked = checked;
  // Dispatch a 'change' fake event so Angular form bindings take notice of the change.
  dispatchFakeEvent(nativeElement, 'change');
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
  dispatchFakeEvent(
    element,
    isSelect ? 'change' : 'input',
    isSelect ? false : true
  );
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
