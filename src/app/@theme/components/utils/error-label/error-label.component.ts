import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';

@Component({
  selector: 'error-label',
  templateUrl: './error-label.component.html',
  styleUrls: ['./error-label.component.css']
})
export class ErrorLabelComponent  {

    @Input() control: FormControl;
    constructor(private formService: FormService) { }

    get errorMessage() {
      for (const propertyName in this.control.errors) {
          if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched)) {
          return this.formService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        }
      }

      return null;
    }
}
