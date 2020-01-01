import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from 'src/app/@core/validators/must-match.validators';
import { ValidPassword } from 'src/app/@core/validators/valid-password.validators';
import { first } from 'rxjs/operators';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    resetPasswordForm: FormGroup;
    submitted = false;
    button = false;
    validator = environment.validators;
    returnUrl = '/login';
    error = false;
    validationError = '';
    successMessage = '';
    resetToken = '';
    subscription: any;
    NewpasswordHidden = true;
    ConfirmpasswordHidden = true;


    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private authenticationService: AuthenticationService,
                private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.subscription = this.activatedRoute.params.subscribe(params => {
            this.resetToken = params.token;
        });
        this.resetPasswordForm = this.formBuilder.group({
            token: [this.resetToken, [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,
            Validators.minLength(this.validator.password.min),
            Validators.maxLength(this.validator.password.max), ValidPassword]],
            passwordConfirmation: ['', [Validators.required]],
        }, {
                validator: MustMatch('password', 'passwordConfirmation')
            });
    }

    get f() { return this.resetPasswordForm.controls; }

    ngOnDestroy(): void {

        this.subscription.unsubscribe();
    }

    toggleVisible(value) {
        switch(value) {
            case 'new' :
                this.NewpasswordHidden = !this.NewpasswordHidden;
            break;
            case 'confirm' :
                this.ConfirmpasswordHidden = !this.ConfirmpasswordHidden;
            break;
        }
    }

    onSubmit() {
        // this.toastr.success('Hello world!', 'Toastr fun!');
        this.validationError = '';
        this.successMessage = '';
        this.error = false;
        this.submitted = true;

        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
        this.resetPasswordForm.markAllAsTouched();
            // this.submitted = false;
            return false;
        }
        if (this.resetPasswordForm.valid) {
            
            this.button = true;
        }
        const fieldValues = this.resetPasswordForm.getRawValue();
        this.authenticationService.resetPasword(fieldValues)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.successMessage = data.message;
                        this.resetPasswordForm.reset();
                        setTimeout(() => {
                            this.router.navigate([this.returnUrl]);
                        }, 2000);
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
                            this.resetPasswordForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                        }
                    }
                    this.validationError = error.message;
                },
                () => {
                    this.submitted = false;
                });

    }

}
