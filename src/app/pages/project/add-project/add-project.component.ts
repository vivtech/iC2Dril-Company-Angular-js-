import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/@core/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Country } from 'src/app/@core/models/country.model';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormService } from 'src/app/@core/services/form-validation.service';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.css']
})

export class AddProjectComponent implements OnInit {
    title = 'Create Project';
    submitted = false;
    addproductForm: FormGroup;
    disable = true;
    button = false;
    UserType: any;
    webUser: any;
    mobileUser: any;
    validator = environment.validators;
    countryList: Observable < Country[] > ;
    statusData = [{ id: 0, name: 'Inprogress' }, { id: 1, name: 'Completed' }];
    fieldEnvData = [
        { id: 1, name: 'Onshore' },
        { id: 2, name: 'Swamp' },
        { id: 3, name: 'Offshore' },
        { id: 4, name: 'Deep Water' }
    ];
    depthData = [
        { name: 'ft' },
        { name: 'm' }
    ];
    constructor(private fb: FormBuilder,
        private service: ProjectService,
        private toastr: ToastrService,
        private router: Router,
        private formService: FormService,
        private commonService: CommonService) {}

    ngOnInit() {
        this.addproductForm = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)
            ]],
            blockName: ['', [Validators.required,
                Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)
            ]],
            fieldName: ['', [Validators.required,
                Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)
            ]],
            fieldEnv: [null, [Validators.required]],
            wellName: ['', [Validators.required]],
            depth: ['', Validators.required],
            depthType: [null, Validators.required],
            status: [null, [Validators.required]],
            country: [null, [Validators.required]]
            // address: ["", [Validators.required,
            //             Validators.minLength(this.validator.name.min),
            //             Validators.maxLength(this.validator.name.max)]],
            // city: ["", [Validators.required,
            //             Validators.minLength(this.validator.name.min),
            //             Validators.maxLength(this.validator.name.max)]],
            // state: ["", [Validators.required,
            //             Validators.minLength(this.validator.name.min),
            //             Validators.maxLength(this.validator.name.max)]],
            // client_name: ["", [Validators.required,
            //             Validators.minLength(this.validator.name.min),
            //             Validators.maxLength(this.validator.name.max)]],
            // client_email: ["", [Validators.required, ValidEmail,
            //             Validators.minLength(this.validator.email.min),
            //             Validators.maxLength(this.validator.email.max)]],
            // client_phone: ["", [Validators.required,
            //             Validators.minLength(this.validator.phone.min),
            //             Validators.maxLength(this.validator.phone.max)]],
        });
        // this.service.getUserType().subscribe(res => {
        //     console.log("getUserType", res);
        //     this.UserType = res.data;
        //     // for(var i in res.data) {
        //     //   if(res.data[i].webLogin == 1) {
        //     //     console.log('web user', res.data[i].name)
        //     //   }
        //     //   else {
        //     //     console.log('Mob user', res.data[i].name)
        //     //   }
        //     // }
        // });
        this.commonService.getRequestFormData().subscribe(res => {
            this.countryList = this.commonService.getCountryList();
        });
        // console.log('this.countryList', this.countryList)
    }

    get f() {
        return this.addproductForm.controls;
    }


    setsubmit() {
        this.submitted = false;
        this.addproductForm.reset();
    }

    submit(value) {
        this.submitted = true;
        this.disable = false;
        if (this.addproductForm.invalid) {
            console.log('this.addproductForm-not valid');
            this.formService.clearCustomError(this.addproductForm);
            this.addproductForm.markAllAsTouched();
            // this.submitted = false;
            return false;
        }

        if (this.addproductForm.valid) {
            this.button = true;
        }
        const params = {
            name: value.name,
            blockName: value.blockName,
            fieldName: value.fieldName,
            depth: value.depth,
            status: value.status,
            country: value.country,
            depthType: value.depthType,
            fieldEnv: value.fieldEnv,
            wellName: value.wellName
        };
        console.log('value', params);
        this.service.create(params).subscribe(res => {
            this.submitted = false;
            this.button = false;
            this.toastr.success('', res.message);
            this.addproductForm.reset();
            console.log('Project create response', res.data._id);
            // var scope = this;
            setTimeout(() => {
                this.router.navigate(['/project/list']);
            }, 1500);

        }, (err) => {
            this.submitted = false;
            this.button = false;
            console.log(err);
            if (err.errors.length > 0) {
                for (const fieldError of err.errors) {
                    const check = fieldError.param;
                    this.addproductForm.get(check).setErrors({ customError: fieldError.msg });
                }
            }
        });
    }
}
