import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;
    submitted = false;
    validator = environment.validators;
    returnUrl = '/login';
    error = false;
    validationError = "";
    successMessage = "";

    constructor(private router: Router,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {

        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        }, {
            //validator: MustMatch('password', 'confirmPassword')
        });
    }

    get f() { return this.forgotPasswordForm.controls; }

    onSubmit() {
        //this.toastr.success('Hello world!', 'Toastr fun!');
        this.validationError = "";
        this.successMessage = "";
        this.error = false
        this.submitted = true;

        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.authenticationService.forgotPasword(this.f.email.value)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status == "success") {
                        console.log(data)
                        this.successMessage = data.message
                        this.forgotPasswordForm.reset()
                        //this.router.navigate([this.returnUrl]);
                    } else {
                        this.validationError = data.message;
                    }

                },
                error => {
                    console.log(error)
                    this.error = true;
                    this.validationError = error.errors[0].msg;
                    //this.loading = false;
                });

    }

}
