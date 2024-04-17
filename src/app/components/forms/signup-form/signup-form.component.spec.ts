import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ReactiveFormsModule } from '@angular/forms';

import { PasswordStrength, SignupService } from 'src/services/signup.service';
import { ErrorMessageDirective } from 'src/app/directives/error-message.directive';
import { SignupFormComponent } from './signup-form.component';
import { ControlErrorsComponent } from '../control-errors/control-errors.component';

import {
  checkField,
  click,
  dispatchFakeEvent,
  expectText,
  findElementByTestClass,
  setFieldValue,
} from 'src/spec-helpers';
import {
  addressLine1,
  addressLine2,
  city,
  country,
  email,
  name,
  password,
  postcode,
  region,
  username,
  signupData,
} from 'src/spec-helpers/signup-data.spec-helpers';

const requiredFields = [
  'username',
  'email',
  'name',
  'address-line-2',
  'city',
  'postcode',
  'country',
  'tos',
];

const weakPassword: PasswordStrength = {
  score: 2,
  warning: 'too short',
  suggestions: ['try a longer password'],
};

const strongPassword: PasswordStrength = {
  score: 4,
  warning: '',
  suggestions: [],
};

describe('SignupFormComponent', () => {
  it('submits the form successfully', fakeAsync(() => {
    const { fixture, signupService } = setup();
    fillForm(fixture);
    fixture.detectChanges();

    expect(
      findElementByTestClass(fixture, 'submit').properties.disabled
    ).toBeTrue();

    // Wait for async validators
    tick(1000); // need fakeAsync() wrapper
    fixture.detectChanges();
    expect(
      findElementByTestClass(fixture, 'submit').properties.disabled
    ).toBeFalse();

    findElementByTestClass(fixture, 'form').triggerEventHandler('submit', {});
    fixture.detectChanges();

    expectText(fixture, 'status', 'Sign-up successful!');

    expect(signupService.isUsernameTaken).toHaveBeenCalledOnceWith(username);
    expect(signupService.isEmailTaken).toHaveBeenCalledOnceWith(email);
    expect(signupService.getPasswordStrength).toHaveBeenCalledWith(password);
    // todo - figure out why 2?
    expect(signupService.getPasswordStrength).toHaveBeenCalledTimes(2);
    expect(signupService.signup).toHaveBeenCalledWith(signupData);
  }));

  it('does not submit an invalid form', fakeAsync(() => {
    const { fixture, signupService } = setup();

    tick(1000);
    findElementByTestClass(fixture, 'form').triggerEventHandler('submit', {});

    expect(signupService.isUsernameTaken).not.toHaveBeenCalled();
    expect(signupService.isEmailTaken).not.toHaveBeenCalled();
    expect(signupService.getPasswordStrength).not.toHaveBeenCalled();
    expect(signupService.signup).not.toHaveBeenCalled();
  }));

  it('handles signup failure', fakeAsync(() => {
    const errorResponse = throwError(() => new Error('Validation failed'));

    const { fixture, signupService } = setup({ signup: errorResponse });
    fillForm(fixture);

    // Wait for async validators
    tick(1000);

    findElementByTestClass(fixture, 'form').triggerEventHandler('submit', {});
    fixture.detectChanges();

    expectText(fixture, 'status', 'Sign-up error');
    expect(signupService.isUsernameTaken).toHaveBeenCalledWith(username);
    expect(signupService.getPasswordStrength).toHaveBeenCalledWith(password);
    expect(signupService.signup).toHaveBeenCalledWith(signupData);
  }));

  xit('marks fields as required', () => {
    const { fixture, signupService } = setup();

    // Mark required fields as touched
    requiredFields.forEach((testClass) => {
      markFieldAsTouched(findElementByTestClass(fixture, testClass));
    });

    fixture.detectChanges();

    requiredFields.forEach((testClass) => {
      const el = findElementByTestClass(fixture, testClass);

      // Check aria-required attribute
      expect(el.attributes['aria-required'])
        .withContext(`${testClass} must be marked as aria-required`)
        .toBe('true');

      // Check aria-errormessage attribute
      const errorMessageId = el.attributes['aria-errormessage']; // aria-errormessage - standard
      if (!errorMessageId) {
        throw new Error(`Error message id for "${testClass}" not present`);
      }

      // Check element with error message
      const errorMessageEl = document.getElementById(errorMessageId);
      if (!errorMessageEl) {
        throw new Error(`Error message element for ${testClass} not found`);
      }

      if (errorMessageId === 'tos-errors') {
        expect(errorMessageEl.textContent).toContain(
          'Please accept the Terms of Service'
        );
      } else {
        expect(errorMessageEl.textContent)
          .withContext(`for ${testClass}`)
          .toContain(`must be given`);
      }
    });
  });

  it('fails if the username is taken', fakeAsync(() => {
    const { fixture, signupService } = setup({ isUsernameTaken: of(true) });

    fillForm(fixture);

    // wait for async validators
    tick(1000);
    fixture.detectChanges();
    expect(
      findElementByTestClass(fixture, 'submit').properties.disabled
    ).toBeTrue();

    findElementByTestClass(fixture, 'form').triggerEventHandler('submit', {});

    expect(signupService.isUsernameTaken).toHaveBeenCalledWith(username);
    expect(signupService.isEmailTaken).toHaveBeenCalledWith(email);
    expect(signupService.getPasswordStrength).toHaveBeenCalledWith(password);
    expect(signupService.signup).not.toHaveBeenCalled();
  }));

  it('fails if the email is taken', fakeAsync(() => {
    const { fixture, signupService } = setup({ isEmailTaken: of(true) });

    fillForm(fixture);

    // Wait for Async validation
    tick(1000);
    fixture.detectChanges();

    expect(
      findElementByTestClass(fixture, 'submit').properties.disabled
    ).toBeTrue();

    findElementByTestClass(fixture, 'form').triggerEventHandler('submit', {});

    expect(signupService.isUsernameTaken).toHaveBeenCalledWith(username);
    expect(signupService.isEmailTaken).toHaveBeenCalledWith(email);
    expect(signupService.getPasswordStrength).toHaveBeenCalledWith(password);
    expect(signupService.signup).not.toHaveBeenCalled();
  }));

  it('fails if the password is too weak', fakeAsync(() => {
    const { fixture, signupService } = setup({
      getPasswordStrength: of(weakPassword),
    });

    fillForm(fixture);

    // Wait for async validators
    tick(1000);
    fixture.detectChanges();

    expect(
      findElementByTestClass(fixture, 'submit').properties.disabled
    ).toBeTrue();

    findElementByTestClass(fixture, 'form').triggerEventHandler('submit', {});

    expect(signupService.isUsernameTaken).toHaveBeenCalledWith(username);
    expect(signupService.isEmailTaken).toHaveBeenCalledWith(email);
    expect(signupService.getPasswordStrength).toHaveBeenCalledWith(password);
    expect(signupService.signup).not.toHaveBeenCalled();
  }));

  it('requires address line 1 for business and non-profit plans', () => {
    const { fixture, signupService } = setup();

    // Initial state (personal plan)
    const addressLine1El = findElementByTestClass(fixture, 'address-line-1');

    expect(addressLine1El).toBeDefined();
    expect('ng-invalid' in addressLine1El.classes).toBeFalse();
    expect('aria-required' in addressLine1El.attributes).toBeFalse();

    // Change plan to business
    checkField(fixture, 'plan-business', true);
    fixture.detectChanges();

    expect(addressLine1El.attributes['aria-required']).toBe('true');
    expect(addressLine1El.classes['ng-invalid']).toBe(true);

    // Change plan to non-profit
    checkField(fixture, 'plan-non-profit', true);
    fixture.detectChanges();

    expect(addressLine1El.attributes['aria-required']).toBe('true');
    expect(addressLine1El.classes['ng-invalid']).toBe(true);
  });

  it('toggles the password display', () => {
    const { fixture } = setup();

    setFieldValue(fixture, 'password', 'top secret');
    const passwordEl = findElementByTestClass(fixture, 'password');
    expect(passwordEl.attributes.type).toBe('password');

    click(fixture, 'show-password');
    fixture.detectChanges();

    expect(passwordEl.attributes.type).toBe('text');

    click(fixture, 'show-password');
    fixture.detectChanges();

    expect(passwordEl.attributes.type).toBe('password');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        SignupFormComponent,
        ControlErrorsComponent,
        ErrorMessageDirective,
      ],
      providers: [{ provide: SignupService, useValue: getFakeService() }],
    }).compileComponents();
  });

  function getFakeService(
    signupServiceReturnValues?: jasmine.SpyObjMethodNames<SignupService>
  ) {
    const strongPassword: PasswordStrength = {
      score: 4,
      warning: '',
      suggestions: [],
    };
    return jasmine.createSpyObj<SignupService>('SignupService', {
      // Successful responses per default
      isUsernameTaken: of(false),
      isEmailTaken: of(false),
      getPasswordStrength: of(strongPassword),
      signup: of({ success: true }),
      ...signupServiceReturnValues, // Wow!
    });
  }

  function setup(
    signupServiceReturnValues?: jasmine.SpyObjMethodNames<SignupService>
  ) {
    const fixture = TestBed.createComponent(SignupFormComponent);
    const signupService = TestBed.inject(SignupService);

    if (signupServiceReturnValues) {
      Object.keys(signupServiceReturnValues).forEach((method) => {
        //@ts-ignore
        (signupService[method] as jasmine.Spy).and.returnValue(
          //@ts-ignore
          signupServiceReturnValues[method]
        );
      });
    }

    fixture.detectChanges();
    return { fixture, signupService };
  }

  function fillForm<T>(fixture: ComponentFixture<T>) {
    setFieldValue(fixture, 'username', username);
    setFieldValue(fixture, 'email', email);
    setFieldValue(fixture, 'password', password);
    setFieldValue(fixture, 'name', name);
    setFieldValue(fixture, 'address-line-1', addressLine1);
    setFieldValue(fixture, 'address-line-2', addressLine2);
    setFieldValue(fixture, 'city', city);
    setFieldValue(fixture, 'postcode', postcode);
    setFieldValue(fixture, 'region', region);
    setFieldValue(fixture, 'country', country);
    checkField(fixture, 'tos', true);
  }

  function markFieldAsTouched(element: DebugElement) {
    dispatchFakeEvent(element.nativeElement, 'blur');
  }
});
