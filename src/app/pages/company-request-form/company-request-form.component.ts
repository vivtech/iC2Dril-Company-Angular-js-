import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/@core/models/country.model';
import { Package } from 'src/app/@core/models/package.model';
import { CommonService } from 'src/app/@core/services/common.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';
// import { Package } from '.'

@Component({
  selector: 'app-company-request-form',
  templateUrl: './company-request-form.component.html',
  styleUrls: ['./company-request-form.component.css']
})
export class CompanyRequestFormComponent implements OnInit {
    countryList: Observable<Country[]>;
    packageList: Observable<Package[]>;
    validationError = '';
    validator = environment.validators;
    submitted = false;
    error = false;
    requestForm: FormGroup;
    successMessage = '';
  constructor( private commonService: CommonService,
               private router: Router,
               private formBuilder: FormBuilder,
               private activatedRoute: ActivatedRoute,
               private formService: FormService ) {

            }

  ngOnInit() {
        const data = this.commonService.getRequestFormData().subscribe();
        this.countryList = this.commonService.getCountryList();
        this.packageList = this.commonService.getPackageList();
        this.requestForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
        companyName: ['', [Validators.required, Validators.minLength(this.validator.company.min),
            Validators.maxLength(this.validator.company.max)]],
            email: ['', [Validators.required, ValidEmail, Validators.email, Validators.minLength(this.validator.email.min),
            Validators.maxLength(this.validator.email.max)]],
        phone: ['', [Validators.required, Validators.minLength(this.validator.phone.min),
            Validators.maxLength(this.validator.phone.max)]],
        country: ['', [Validators.required]],
        package: ['', [Validators.required]],
        userCount: ['', [Validators.required,
            Validators.minLength(this.validator.userCount.min),
            Validators.min(this.validator.userCount.minValue),
            Validators.max(this.validator.userCount.maxValue)]]
    });

  }

  get f() { return this.requestForm.controls; }

  onSubmit() {
    this.formService.clearCustomError(this.requestForm);
    this.validationError = '';
    this.successMessage = '';
    this.error = false;
    this.submitted = true;
    this.requestForm.markAllAsTouched();
    console.log("this.requestForm");
    console.log(this.requestForm);
      return false;
    if (this.requestForm.invalid) {
        this.submitted = false;
        return false;
    }

    this.commonService.submitRequestForm(this.requestForm.getRawValue())
                    .pipe(first())
                    .subscribe(
                        data => {
                            if (data.status === 'success') {
                                console.log(data);
                                this.successMessage = data.message;
                                this.requestForm.reset();
                                window.scroll(0,0);
                                // setTimeout(() => {
                                //     this.router.navigate([this.returnUrl]);
                                // }, 2000);
                            } else {
                                this.validationError = data.message;
                            }

                        },
                        error => {
                            this.submitted = false;
                            console.log(error);
                            this.error = true;
                            if (error.errors.length > 0) {
                                for (const fieldError of error.errors) {
                                    const check = fieldError.param;
                                    this.requestForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                                }
                            }
                            this.validationError = error.message;
                        },
                        () => {
                            this.submitted = false;
                        });


  }
}
