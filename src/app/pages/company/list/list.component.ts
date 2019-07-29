import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/@core/services/company.service';
import { Observable } from 'rxjs';
import { CompanyRequest } from 'src/app/@core/models/company-request.model';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { Country } from 'src/app/@core/models/country.model';
import { Package } from 'src/app/@core/models/package.model';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { Company } from 'src/app/@core/models/company.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;

    statusFilterData = [{ id: '', name: 'All' }, { id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
    statusData = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
    statusFilter = '';
    editing = false;

    title = 'Subscribed Company List';
    dtOptions: DataTables.Settings = {};
    companyList: Company[];
    requestDetail: Company;
    editForm: FormGroup;
    validator = environment.validators;
    countryList: Observable<Country[]>;
    packageList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    minDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };

    constructor(private commonService: CommonService,
                private companyService: CompanyService,
                private modalService: NgbModal,
                private modalConfig: NgbModalConfig,
                private formService: FormService,
                private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        const that = this;



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
                dataTablesParameters['filter'] = [];
                dataTablesParameters['filter'][0] = { column: 'active', data: this.statusFilter };
                console.log(dataTablesParameters);
                const responseData = this.companyService.getList(dataTablesParameters).pipe(first())
                    .subscribe(response => {
                        console.log(response);
                        if (response.code === 200) {
                            this.companyList = response.data.data;
                            callback({
                                recordsTotal: response.data.recordsTotal,
                                recordsFiltered: response.data.recordsFiltered,
                                data: []
                            });
                        }

                    }

                    );


            },
            columns: [
                { data: 'customerId' },
                { data: 'name' },
                { data: 'contactName' }, { data: 'email' }, { data: 'phone' }, { data: 'active' }, { data: '_id' }],
            columnDefs: [
                {
                    searchable: false,
                    orderable: false,
                    targets: [-1]
                },
                {
                    searchable: false,
                    targets: [-2]
                }
            ]
        };
        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
            companyName: ['', [Validators.required, Validators.minLength(this.validator.company.min),
            Validators.maxLength(this.validator.company.max)]],
            email: ['', [Validators.required, Validators.email, Validators.minLength(this.validator.email.min),
            Validators.maxLength(this.validator.email.max)]],
            phone: ['', [Validators.required, Validators.minLength(this.validator.phone.min),
            Validators.maxLength(this.validator.phone.max)]],
            country: ['', [Validators.required]],
            package: ['', [Validators.required]],
            userCount: ['', [Validators.required,
            Validators.minLength(this.validator.userCount.min),
            Validators.min(this.validator.userCount.minValue),
            Validators.max(this.validator.userCount.maxValue)]],
            notes: ['', [
                Validators.maxLength(this.validator.notes.max)]
            ],
            licenseDate: ['', [Validators.required]]
        });

        const data = this.commonService.getRequestFormData().subscribe();
        this.countryList = this.commonService.getCountryList();
        this.packageList = this.commonService.getPackageList();
    }


    get f() { return this.editForm.controls; }


    viewDetail(viewModal, data) {

        this.companyService.getData(data).subscribe(response => {
            this.requestDetail = response.data;
            this.modalService.open(viewModal, { scrollable: true, size: 'lg' });
        },
            error => {
                // this.noti
            }
        );
    }

    editDetail(editModal, data) {

        this.companyService.getData(data).subscribe(response => {
            this.requestDetail = response.data;
            this.editForm.reset();
            const licenseDate = new Date(this.requestDetail.expireAt);
            const expiryDate = { year: licenseDate.getFullYear(), month: licenseDate.getMonth() + 1, day: licenseDate.getDate() };
            this.editing = true;
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.editForm.patchValue({
                data: this.requestDetail._id,
                name: this.requestDetail.contactName,
                companyName: this.requestDetail.name,
                email: this.requestDetail.email,
                phone: this.requestDetail.phone,
                country: this.requestDetail.country._id,
                package: this.requestDetail.package._id,
                userCount: this.requestDetail.userCount,
                notes: this.requestDetail.notes,
                licenseDate: expiryDate,
            });
            this.modalService.open(editModal, { scrollable: true, size: 'lg' });
        },
            error => {
                // this.noti
            }
        );
    }

    deleteRequest(data) {

        this.companyService.deleteData(data).subscribe(response => {
            this.modalService.dismissAll();
            this.toastr.success('', response.message);
            this.refreshTable();
        },
            error => {
                this.modalService.dismissAll();
                // this.noti
            }
        );
    }

    updateRequest() {
        this.formService.clearCustomError(this.editForm);
        this.submitted = true;
        this.editForm.markAllAsTouched();
        console.log(this.editForm.getRawValue());
        if (this.editForm.invalid) {
            this.submitted = false;
            return false;
        }
        const currentData = this.editForm.getRawValue();
        const licenseDate = `${currentData.licenseDate.year}-${currentData.licenseDate.month}-${currentData.licenseDate.day}`;
        currentData.licenseDate = licenseDate;

        let service = null;
        if (this.editing) {
            service = this.companyService.updateData(currentData);
        } else {
            service = this.companyService.createData(currentData);
        }

        service.pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.toastr.error('', data.message);
                        this.modalService.dismissAll();
                        this.editForm.reset();
                        this.refreshTable();
                    }

                },
                error => {
                    this.submitted = false;
                    console.log(error);
                    if (error.errors.length > 0) {
                        for (const fieldError of error.errors) {
                            const check = fieldError.param;
                            this.editForm.get(check).setErrors({ customError: fieldError.msg });
                        }
                    }
                },
                () => {
                    this.submitted = false;
                });

    }


    refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }
    createData(modal) {
        this.f.data.setValidators(null);
        this.f.data.updateValueAndValidity();
        this.requestDetail = {
            name: '',
            active: 1
        };
        this.editing = false;
        this.editForm.reset();
        this.modalService.open(modal, { size: 'lg' });
    }
    deleteConfirmation(data) {
        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.data = data;
        modalRef.result.then((result) => {
            if (result) {
                this.deleteRequest(result);
            }
        },
            (error) => {
                console.log(error);
            });
    }

    goto(url) {
        console.log(url);
        this.router.navigate(['license-history']);
    }
}
