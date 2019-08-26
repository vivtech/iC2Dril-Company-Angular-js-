import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/@core/services/profile.service';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { User } from 'src/app/@core/models/user.model';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ValidPassword } from 'src/app/@core/validators/valid-password.validators';
import { MustMatch } from 'src/app/@core/validators/must-match.validators';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    title = 'Profile';
    passwordVisible = false;
    user: User;
    validator = environment.validators;
    submitted = false;
    error = false;
    profileForm: FormGroup;
    confirmPasswordForm: FormGroup;
    successMessage = '';
    validationError = '';
    public uploader:FileUploader = new FileUploader({});
    public filePreviewPath: File = null;
    imageError: boolean = false;
    selectedFile: any;

    constructor(private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private formService: FormService,
              private toastr: ToastrService,
              public sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.user = this.authenticationService.currentUserValue;
        this.profileForm = this.formBuilder.group({
            name: [this.user.name, [Validators.required, Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
            email: [this.user.email, [Validators.required, Validators.email, Validators.minLength(this.validator.email.min),
            Validators.maxLength(this.validator.email.max)]],
            phone: [this.user.phone, [Validators.required, Validators.minLength(this.validator.phone.min),
            Validators.maxLength(this.validator.phone.max)]]
        });

        this.confirmPasswordForm = this.formBuilder.group({
            currentPassword: [this.user.name, [Validators.required,
            Validators.minLength(this.validator.password.min),
            Validators.maxLength(this.validator.password.max)]],

            password: [this.user.email, [Validators.required,
            Validators.minLength(this.validator.password.min),
            Validators.maxLength(this.validator.password.max), ValidPassword]],

            confirmPassword: [this.user.phone, [Validators.required,
            Validators.minLength(this.validator.password.min),
            Validators.maxLength(this.validator.password.max)]]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    get f() { return this.profileForm.controls; }

    get pf() { return this.confirmPasswordForm.controls; }

    togglePassword() {
        this.submitted = false;
        if ( !this.passwordVisible ) {
            this.confirmPasswordForm.reset();
        }
        this.passwordVisible = !this.passwordVisible;
    }

    profileImage() {

    }

    onFileSelected(event) {
        console.log('event1', event[0].type);
        if (event[0].type == 'image/png' || event[0].type == 'image/jpeg') {
            this.imageError = false;
            var reader = new FileReader();
            reader.readAsDataURL(event[0]); // read file as data url
            reader.onload = (event: any) => { // called once readAsDataURL is completed
                console.log('event', event);
                this.filePreviewPath = event.target.result;
            }
        }
        else {
            console.log('File not image');
            this.imageError = true;
        }
    }

    upload() {
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.selectedFile.name);
        // this.http.post('http://example.com/upload/image', fd).subscribe((res: any) => {
        //   this.image = res.data;
        // }, (err: any) => {
        //     // Show error message or make something.
        // });
    }

    onProfileSubmit() {
        this.formService.clearCustomError(this.profileForm);
        //this.validationError = '';
        //this.successMessage = '';
        //this.error = false;
        this.submitted = true;
        this.profileForm.markAllAsTouched();

        if (this.profileForm.invalid) {
            this.submitted = false;
            return false;
        }

        this.authenticationService.profileUpdate(this.profileForm.getRawValue())
        .pipe(first())
        .subscribe(
            data => {
                if (data.status === 'success') {
                    console.log(data);
                    this.toastr.error('', data.message);
                    window.scroll(0,0);
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
                        this.profileForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                    }
                }
                this.validationError = error.message;
            },
            () => {
                this.submitted = false;
            });
    }

    onPasswordSubmit() {
        this.formService.clearCustomError(this.confirmPasswordForm);
        this.submitted = true;
        this.confirmPasswordForm.markAllAsTouched();
        if (this.confirmPasswordForm.invalid) {
            this.submitted = false;
            return false;
        }

        this.authenticationService.changePassword(this.confirmPasswordForm.getRawValue())
        .pipe(first())
        .subscribe(
            data => {
                if (data.status === 'success') {
                    console.log(data);
                    this.confirmPasswordForm.reset();
                    this.toastr.error('', data.message);
                    window.scroll(0,0);
                } else {
                    // this.validationError = data.message;
                }
            },
            error => {
                this.submitted = false;
                console.log(error);
                this.error = true;
                if (error.errors.length > 0) {
                    for (const fieldError of error.errors) {
                        const check = fieldError.param;
                        this.confirmPasswordForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                    }
                }
                this.validationError = error.message;
            },
            () => {
                this.submitted = false;
            });
    }

}
