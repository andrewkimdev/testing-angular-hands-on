import { Directive, HostBinding, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

import { findFormControl } from '../util';

/**
 * Directive that sets the `aria-invalid` and `aria-errormessage` attributes
 * when the form control is invalid and touched or dirty
 *
 * https://w3c.github.io/aria/#aria-invalid
 * https://w3c.github.io/aria/#aria-errormessage
 *
 * Expects that the element either has a `formControl` or `formControlName` input
 *
 * Expects the id of the element that contains the error messages.
 *
 * Usage examples
 *
 *   <input [formControl]="usernameFormControl" appErrorMessage="username-errors">
 *   <input formControlName="username" appErrorMessage="username-errors">
 *   <div id=username-errors">...</div>
 */

@Directive({
  selector: '[app-error-message]',
})
export class ErrorMessageDirective implements OnInit {
  @HostBinding('attr.aria-invalid')
  get ariaInvalid(): true | null {
    return this.isActive() ? true : null;
  }

  @HostBinding('attr.aria-errormessage')
  get ariaErrorMessage(): string | null {
    return this.isActive() && this.appErrorMessage
      ? this.appErrorMessage
      : null;
  }

  @Input()
  public appErrorMessage?: string;

  @Input()
  public formControl?: AbstractControl;

  @Input()
  public formControlName?: string;

  private control?: AbstractControl;

  constructor(@Optional() private controlContainer?: ControlContainer) {}

  ngOnInit(): void {
    this.control = findFormControl(
      this.formControl,
      this.formControlName,
      this.controlContainer
    );
  }

  /**
   * Whether link to the error is established.
   */
  private isActive(): boolean {
    const { control } = this;
    return (
      control !== undefined &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }
}
