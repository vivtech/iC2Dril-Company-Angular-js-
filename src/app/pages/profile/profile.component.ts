import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { User } from 'src/app/@core/models/user.model';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ValidPassword } from 'src/app/@core/validators/valid-password.validators';
import { MustMatch } from 'src/app/@core/validators/must-match.validators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/@core/services/common.service';
import { Observable } from 'rxjs';
import { Country } from 'src/app/@core/models/country.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    title = 'Profile';
    passwordVisible = false;
    profileVisible = true;
    subVisible = false;
    CurrentpasswordHidden = true;
    NewpasswordHidden = true;
    ConfirmpasswordHidden = true;
    user: User;
    validator = environment.validators;
    submitted = false;
    error = false;
    profileForm: FormGroup;
    confirmPasswordForm: FormGroup;
    successMessage = '';
    validationError = '';
    public filePreviewPath: File = null;
    imageError = false;
    selectedFile: any;
    countryList: Observable<Country[]>;
    mysubDetails: any;

    constructor(
              private commonService: CommonService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private formService: FormService,
              private toastr: ToastrService,
              public sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.getMySubscription();
        const data = this.commonService.getRequestFormData().subscribe();
        this.countryList = this.commonService.getCountryList();
        this.user = this.authenticationService.currentUserValue;
        this.profileForm = this.formBuilder.group({
            name: [this.user.name, [Validators.required, Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
            profilePic: [this.user.profilePic],
            email: [this.user.email, [Validators.required, Validators.email, Validators.minLength(this.validator.email.min),
            Validators.maxLength(this.validator.email.max)]],
            phone: [this.user.phone, [Validators.required, Validators.minLength(this.validator.phone.min),
            Validators.maxLength(this.validator.phone.max)]],
            tel: [this.user.tel, [Validators.required]]
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

    get f(): any { return this.profileForm.controls; }

    get pf(): any { return this.confirmPasswordForm.controls; }

    togglePassword(value) {
        this.submitted = false;
        this.confirmPasswordForm.reset();
        switch (value) {
            case 1:
                this.profileVisible = true;
                this.subVisible = false;
                this.passwordVisible = false;
                break;
            case 2:
                this.profileVisible = false;
                this.subVisible = false;
                this.passwordVisible = true;
                break;
            case 3:
                this.subVisible = true;
                this.passwordVisible = false;
                this.profileVisible = false;
                break;

        }
    }

    toggleVisible(value) {
        switch (value) {
            case 'current' :
                this.CurrentpasswordHidden = !this.CurrentpasswordHidden;
                break;
            case 'new' :
                this.NewpasswordHidden = !this.NewpasswordHidden;
                break;
            case 'confirm' :
                this.ConfirmpasswordHidden = !this.ConfirmpasswordHidden;
                break;
        }
    }

    getMySubscription() {
        const userId = localStorage.getItem('companyId');
        this.authenticationService.getSubscriptions(userId).subscribe(mySub => {
            // console.log('My Subs', mySub);
            this.mysubDetails = mySub.data.company;
        });
    }

    onFileSelected(event) {
        const image = event.target.files[0];
      //   console.log('event', image);
        // tslint:disable-next-line: triple-equals
        if (image.type == 'image/png' || image.type == 'image/jpeg') {
              this.imageError = false;
              const reader = new FileReader();
              reader.readAsDataURL(image); // read file as data url
              this.profileForm.controls.profilePic.setValue(image);
              console.log('event', this.profileForm.getRawValue());
              // tslint:disable-next-line: no-shadowed-variable
              reader.onload = (event: any) => {
                  this.filePreviewPath = event.target.result;
              };
          } else {
              console.log('File not image');
              this.imageError = true;
          }
    }

    onProfileSubmit() {
        this.formService.clearCustomError(this.profileForm);
        // this.validationError = '';
        // this.successMessage = '';
        // this.error = false;
        this.submitted = true;
        this.profileForm.markAllAsTouched();
        const currentData = this.profileForm.getRawValue();
        if (this.profileForm.invalid) {
            this.submitted = false;
            return false;
        }
        const formData = new FormData();
        for (const key in currentData) {
            if (key === 'profilePic') {
                console.log('key', key);
                formData.append(key, this.f.profilePic.value);
            } else {
                console.log('key', key);
                formData.append(key, currentData[key]);
            }
        }
        this.authenticationService.profileUpdate(formData)
        .pipe(first())
        .subscribe(
            data => {
                if (data.status === 'success') {
                    console.log(data);
                    this.toastr.success('', data.message);
                    window.scroll(0, 0);
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
                        // this.profileForm.get(check).setErrors( { customError : fieldError.msg } ) ;
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
                    this.toastr.success('', data.message);
                    window.scroll(0, 0);
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
