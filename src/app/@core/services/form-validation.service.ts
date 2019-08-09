import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class FormService {

  // get all values of the formGroup, loop over them
  // then mark each field as touched
  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
           control.controls.forEach(c => this.markFormGroupTouched(c));
       }
    });
  }

  public clearCustomError(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
        if (control.hasError('customError')) {
            control.setErrors({customError: null});
            control.updateValueAndValidity();
        }

        if (control.controls) {
           control.controls.forEach(c => this.markFormGroupTouched(c));
       }
    });
  }

  // return list of error messages
  public validationMessages() {
    const messages = {
      required: 'This field is required',
      email: 'This email address is invalid',
      invalid_characters: (matches: any[]) => {

        let matchedCharacters = matches;

        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `These characters are not allowed: ${matchedCharacters}`;
      },
    };

    return messages;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    console.log(validatorName, validatorValue);
    let config = {
      required: 'Please enter a value',
      invalidCreditCard: 'Is invalid credit card number',
      email: 'Invalid email address',
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Please enter at least ${validatorValue.requiredLength} characters`,
      validPassword: `Password must have 1 Number, 1 lowercase, 1 Uppercase letter & 1 Special Character (=!$^&*()-@._*)`,
      maxlength: `Please cannot be more than ${validatorValue.requiredLength} characters`,
      customError: `${validatorValue}`,
      validEmail: `Please enter a valid email address`,
      mustmatch: `Value of `
                    + this.toNormalcase(validatorValue.matchingControlName) + ` must match with `
                    + this.toNormalcase(validatorValue.controlName)
    };

    return config[validatorName];
  }

  toNormalcase(value: string){
        if ( value ) {
          return value.replace(/([A-Z])/g, ' $1').toLocaleLowerCase();
        } else {
          return value;
      }
  }

  // Validate form instance
  // check_dirty true will only emit errors if the field is touched
  // check_dirty false will check all fields independent of
  // being touched or not. Use this as the last check before submitting
  public validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
    const form = formToValidate;

    for (const field in formErrors) {
      if (field) {
        formErrors[field] = '';
        const control = form.get(field);

        const messages = this.validationMessages();
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              if (key && key !== 'invalid_characters') {
                formErrors[field] = formErrors[field] || messages[key];
              } else {
                formErrors[field] = formErrors[field] || messages[key](control.errors[key]);
              }
            }
          }
        }
      }
    }

    return formErrors;
  }
}
