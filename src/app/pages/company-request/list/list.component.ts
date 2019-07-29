import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyRequestService } from 'src/app/@core/services/company-request.service';
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

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'company-request-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;

    statusFilterData = [{id: '', name: 'All'}, {id: 0, name: 'Pending'}, {id: 1, name: 'Accepted'}, {id: 2, name: 'Cancelled'}];
    statusFilter = '';

    title = 'Company Request List';
    dtOptions: DataTables.Settings = {};
    //companyList: Observable<CompanyRequest[]>;
    //callback: any;
    companyList: any[];
    requestDetail: CompanyRequest;
    requestForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    countryList: Observable<Country[]>;
    packageList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    minDate = {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};

    constructor(private commonService: CommonService,
                private companyRequestService: CompanyRequestService,
                private modalService: NgbModal,
                private modalConfig: NgbModalConfig,
                private formService: FormService,
                private formBuilder: FormBuilder,
                private toastr: ToastrService) {
                    modalConfig.backdrop = 'static';
                    modalConfig.keyboard = false;
                }

    ngOnInit() {
        const that = this;



        //this.companyList = this.companyRequestService.getCompanyRequestList();
        this.dtOptions = {
            dom:    `<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
                    "<'row'<'col-sm-12'tr>>"
                    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
          pagingType: 'simple_numbers',
          renderer: 'bootstrap',
          pageLength: 10,
          serverSide: true,
          processing: true,
          ajax: (dataTablesParameters: object, callback) => {
              dataTablesParameters['filter'] = [];
              dataTablesParameters['filter'][0] = {column: 'status', data: this.statusFilter};
              console.log(dataTablesParameters);
              const responseData = this.companyRequestService.getCompanyRequests(dataTablesParameters).pipe(first())
              .subscribe( response => {
                  console.log(response);
                  if ( response.code === 200 ) {
                    this.companyList = response.data.data;
                    callback({
                    recordsTotal: response.data.recordsTotal,
                    recordsFiltered: response.data.recordsFiltered,
                    data : []
                  });
                  }

              }

              );


          },
          columns: [
                    { data: 'name' },
                    { data: 'companyName' }, { data: 'email' }, { data: 'phone' }, { data: 'status' }, { data: '_id' }],
          columnDefs: [
            {
                "searchable": false,
                "orderable": false,
                "targets": [-1]
            },
            {
                "searchable": false,
                "targets": [-2]
            }
        ]
        };
        this.requestForm = this.formBuilder.group({
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
            ]
        });
        this.licenseForm = this.formBuilder.group({
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
                licenseDate: ['', [
                Validators.required]
            ]
        });
        const data = this.commonService.getRequestFormData().subscribe();
        this.countryList = this.commonService.getCountryList();
        this.packageList = this.commonService.getPackageList();
    }

    statusClass(status){
        switch (status){
            case 0: return 'badge-waning';
            case 1: return 'badge-success';
            case 2: return 'badge-danger';
        }
    }

    get f() { return this.requestForm.controls; }
    get lf() { return this.licenseForm.controls; }


    viewDetail(viewModal, data) {

        this.companyRequestService.getCompanyRequest(data).subscribe(response => {
            this.requestDetail = response.data;
            this.modalService.open(viewModal, { scrollable: true,  size: 'lg' });
        },
        error => {
            //this.noti
        }
        );
    }

    editDetail(editModal, data) {

        this.companyRequestService.getCompanyRequest(data).subscribe(response => {
            this.requestDetail = response.data;
            this.requestForm.reset();
            this.requestForm.patchValue({
               data: this.requestDetail._id,
               name: this.requestDetail.name,
               companyName: this.requestDetail.companyName,
               email: this.requestDetail.email,
               phone: this.requestDetail.phone,
               country: this.requestDetail.country._id,
               package: this.requestDetail.package._id,
               userCount: this.requestDetail.userCount,
               notes: this.requestDetail.notes,
            });
            this.modalService.open(editModal, { scrollable: true,  size: 'lg' });
        },
        error => {
            //this.noti
        }
        );
    }

    deleteRequest(data) {

        this.companyRequestService.deleteCompanyRequest(data).subscribe(response => {
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

    getLicenseDetail(licenseModal, data) {

        this.companyRequestService.getCompanyRequest(data).subscribe(response => {
            this.requestDetail = response.data;
            this.licenseForm.reset();
            this.licenseForm.patchValue({
               data: this.requestDetail._id,
               name: this.requestDetail.name,
               companyName: this.requestDetail.companyName,
               email: this.requestDetail.email,
               phone: this.requestDetail.phone,
               country: this.requestDetail.country._id,
               package: this.requestDetail.package._id,
               userCount: this.requestDetail.userCount,
               //notes: this.requestDetail.notes,
            });
            this.modalService.open(licenseModal, {   size: 'lg' });
        },
        error => {
            //this.noti
        }
        );
    }

    updateRequest() {
        this.formService.clearCustomError(this.requestForm);
        this.submitted = true;
        this.requestForm.markAllAsTouched();
        console.log(this.requestForm.getRawValue());
        if (this.requestForm.invalid) {
            this.submitted = false;
            return false;
        }

        this.companyRequestService.updateCompanyRequest(this.requestForm.getRawValue())
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.toastr.error('', data.message);
                        this.modalService.dismissAll();
                        this.requestForm.reset();
                        this.refreshTable();
                    }

                },
                error => {
                    this.submitted = false;
                    console.log(error);
                    if (error.errors.length > 0) {
                        for (const fieldError of error.errors) {
                            const check = fieldError.param;
                            this.requestForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                        }
                    }
                },
                () => {
                    this.submitted = false;
                });

    }

    createLicense(){
        this.formService.clearCustomError(this.licenseForm);
        this.submitted = true;
        this.licenseForm.markAllAsTouched();
        console.log(this.licenseForm.getRawValue());
        if (this.licenseForm.invalid) {
            this.submitted = false;
            return false;
        }
        const currentData = this.licenseForm.getRawValue();
        const licenseDate = `${currentData.licenseDate.year}-${currentData.licenseDate.month}-${currentData.licenseDate.day}`;
        currentData.licenseDate = licenseDate;
        console.log(currentData);
        this.companyRequestService.createLicense(currentData)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.toastr.error('', data.message);
                        this.modalService.dismissAll();
                        this.licenseForm.reset();
                        this.refreshTable();
                    }

                },
                error => {
                    this.submitted = false;
                    console.log(error);
                    if (error.errors.length > 0) {
                        for (const fieldError of error.errors) {
                            const check = fieldError.param;
                            this.licenseForm.get(check).setErrors( { customError : fieldError.msg } ) ;
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

    deleteConfirmation(data){
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

}
