import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/@core/services/common.service';
import { Package, UpgradePackage } from 'src/app/@core/models/package.model';
import { Currency } from 'src/app/@core/models/currency.model';
import { PackageService } from 'src/app/@core/services/package.service';
import { first } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';

@Component({
  selector: 'app-upgrade-package',
  templateUrl: './upgrade-package.component.html',
  styleUrls: ['./upgrade-package.component.css']
})

export class UpgradePackageComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    title = 'Upgrade';
    passwordVisible = false;
    hidden = false;
    hideduration = false;
    upgradeForm: FormGroup;
    packageList: Observable<Package[]>;
    currencyList: Observable<Currency[]>;
    myRequestList: UpgradePackage[];
    dtOptions: DataTables.Settings = {};
    subscriptionList = [
        {text: 'Upgrade package', value : 'RENEW'},
        {text: 'Add user', value : 'ADD_USER'}
    ];
    durationList = [
        { text: '1 Month', value: 1 },
        { text: '2 Months', value: 2 },
        { text: '3 Months', value: 3 },
        { text: '4 Months', value: 4 },
        { text: '5 Months', value: 5 },
        { text: '6 Months', value: 6 },
        { text: '7 Months', value: 7 },
        { text: '8 Months', value: 8 },
        { text: '9 Months', value: 9 },
        { text: '10 Months', value: 10 },
        { text: '11 Months', value: 11 },
        { text: '1 Year', value: 12 },
        { text: '2 Years', value: 24 },
        // { text: "3 Year", value: 36 },
        // { text: "4 Year", value: 48 },
        // { text: "5 Year", value: 60 },
        // { text: "6 Year", value: 72 }
    ];
    validator = environment.validators;
    today = new Date();
    submitted = false;
    minDate = {
        year: this.today.getFullYear(),
        month: this.today.getMonth() + 1,
        day: this.today.getDate()
    };
    customValidation = {
        package: [Validators.required],
        userCount: [
            Validators.required,
            Validators.minLength(this.validator.userCount.min),
            Validators.min(this.validator.userCount.minValue),
            Validators.max(this.validator.userCount.maxValue)
        ]
    };
    mysubDetails: any;
    hideAdduser: boolean = false;
  constructor(private packageService: PackageService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private commonService: CommonService,
              private formService: FormService,
              private toastr: ToastrService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.dtOptions = {
        dom: `<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
                "<'row'<'col-sm-12'tr>>"
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
        pagingType: 'simple_numbers',
        renderer: 'bootstrap',
        pageLength: 10,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: object, callback) => {
            // tslint:disable-next-line: no-string-literal
            dataTablesParameters['filter'] = [];
            console.log(dataTablesParameters);
            const responseData = this.packageService
                .getPackages(dataTablesParameters)
                .pipe(first())
                .subscribe(response => {
                    console.log(response);
                    if (response.code === 200) {
                        this.myRequestList = response.data.data;
                        callback({
                            recordsTotal: response.data.recordsTotal,
                            recordsFiltered: response.data.recordsFiltered,
                            data: []
                        });
                    }
                });
        },
        columns: [
            { data: 'subscriptionType' },
            { data: 'package' },
            { data: 'userCount' },
            { data: 'duration' },
            { data: 'status' },
            { data: '_id' }
        ],
        columnDefs: [
            {
                searchable: false,
                orderable: false,
                targets: [-1]
            },
            {
                searchable: false,
                targets: [-2]
            },
            {
                searchable: false,
                targets: [-3]
            },
            {
                searchable: false,
                targets: [-4]
            },
            {
                searchable: false,
                targets: [-5]
            }
        ]
    };
    this.upgradeForm = this.formBuilder.group({
        package: [null, this.customValidation.package],
        // notes: ['', this.customValidation.transactionId],
        subscriptionType: [null, [Validators.required]],
    });
    this.commonService.getRequestFormData().subscribe(res => {
        this.packageList = this.commonService.getPackageList();
    });
    this.commonService.getCurrencyData().subscribe(res => {
        this.currencyList = this.commonService.getCurrencyList();
    });
  }

    refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    togglePassword() {
        // this.submitted = false;
        this.passwordVisible = !this.passwordVisible;
    }

    upgradeFormDetail(model) {
        const userId = localStorage.getItem('companyId');
        this.authenticationService.getSubscriptions(userId).subscribe(mySub => {
            // console.log('My Subs', mySub)
            const result = mySub.data.company;
            this.mysubDetails = result;
            this.upgradeForm.patchValue({
                package: result.package._id
            });
            this.hidden = false;
            this.modalService.open(model, {
                size: 'lg'
            });
        });
    }

    get uf(): any { return this.upgradeForm.controls; }

    onchangePackage(event) {
        console.log('onchange', event);
        if (event.custom === 1) {
            this.hidden = true;
            const validators = [Validators.required];
            this.upgradeForm.addControl('userCount', new FormControl(''));
            this.upgradeForm.patchValue({
                userCount: this.mysubDetails.userCount
            });
        } else {
            this.hidden = false;
            this.upgradeForm.removeControl('userCount');
        }
    }

    onchangeType(event) {
        console.log('onchangeType', event);
        // tslint:disable-next-line: triple-equals
        if (event.value == 'RENEW') {
            this.hideduration = true;
            this.hideAdduser = false;
            this.upgradeForm.addControl('duration', new FormControl(null, [Validators.required]));
            this.upgradeForm.removeControl('adduser');
        } else {
            this.hideduration = false;
            this.hideAdduser = true;
            this.upgradeForm.removeControl('duration');
            this.upgradeForm.addControl('adduser', new FormControl(null, [Validators.required]));

        }
    }

    upgradePackage() {
        this.formService.clearCustomError(this.upgradeForm);
        this.submitted = true;
        this.upgradeForm.markAllAsTouched();
        console.log(this.upgradeForm.getRawValue());
        if (this.upgradeForm.invalid) {
            console.log('userForm-notvalid');
            this.submitted = false;
            return false;
        }  else {
            const currentData = this.upgradeForm.getRawValue();
            if (currentData.adduser) {
                currentData.userCount = currentData.adduser;
                delete currentData.adduser;
            }
            console.log('currentData', currentData);
            this.packageService
            .create(currentData)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.toastr.success('', data.message);
                        this.modalService.dismissAll();
                        this.upgradeForm.reset();
                        this.refreshTable();
                    }
                },
                error => {
                    this.submitted = false;
                    console.log(error);
                    if (error.errors.length > 0) {
                        for (const fieldError of error.errors) {
                            const check = fieldError.param;
                            this.upgradeForm
                                .get(check)
                                .setErrors({ customError: fieldError.msg });
                        }
                    }
                },
                () => {
                    this.submitted = false;
                }
            );
        }
    }

}
