import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/@core/validators/must-match.validators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { first } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    submitted = false;
    validator = environment.validators;
    returnUrl = '/dashboard';
    error = false;
    passwordHidden = true


    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService) { }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(this.validator.password.min)]],
            // remember: [true]
        }, {
                //validator: MustMatch('password', 'confirmPassword')
            });
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['returnUrl']) {
                this.returnUrl = params['returnUrl'];
            }
        });


    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {

        //this.toastr.error('Hello world!', 'Toastr fun!');
        console.log("hi")
        this.error = false
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status == "success") {
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.error = true;
                    }

                },
                error => {
                    this.error = error;
                    //this.loading = false;
                });

    }

    togglePassword(){
        this.passwordHidden = !this.passwordHidden
    }

}
