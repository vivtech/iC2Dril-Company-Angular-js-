import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CountryService } from 'src/app/@core/services/country.service';
import { ProjectService } from 'src/app/@core/services/project.service';
import { Project } from 'src/app/@core/models/project.model';
import { Router }  from '@angular/router';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';

@Component({
    selector: 'app-list-project',
    templateUrl: './list-project.component.html',
    styleUrls: ['./list-project.component.css']
  })
export class ListProjectComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;

    statusFilterData = [{id: '', name: 'All'}, {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusData = [ {id: 1, name: 'Inprogress'}, {id: 0, name: 'Completed'}];
    activeData = [ {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusFilter = '';
    editing = false;

    title = 'Projects';
    dtOptions: DataTables.Settings = {};
    requestDetail: Project;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    dataList: Project[];
    //dataList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    minDate = {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};

    constructor(
        private commonService: CommonService,
        private apiService: ProjectService,
        private modalService: NgbModal,
        private modalConfig: NgbModalConfig,
        private formService: FormService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private router: Router) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        const that = this;
        this.dtOptions = {
            dom:`<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"
                "<'row'<'col-sm-12'tr>>"
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
            pagingType: 'simple_numbers',
            renderer: 'bootstrap',
            pageLength: 10,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: object, callback) => {
              dataTablesParameters['filter'] = [];
              dataTablesParameters['filter'][0] = {column: 'active', data: this.statusFilter};
              console.log(dataTablesParameters);
              const responseData = this.apiService.getList(dataTablesParameters).pipe(first())
              .subscribe( response => {
                console.log(response);
                    if ( response.code === 200 ) {
                    this.dataList = response.data.data;
                    callback({
                        recordsTotal: response.data.recordsTotal,
                        recordsFiltered: response.data.recordsFiltered,
                        data : []
                    });
                }
              });
            },
            columns: [
                { data: 'name' },
                { data: 'client' },
                // { data: 'state' },
                { data: 'active' },
                { data: 'status' },
                { data: '_id' }
            ],
            columnDefs: [
                {
                    "searchable": true,
                    "orderable": false,
                    "targets": [-1]
                },
                {
                    "searchable": false,
                    "targets": [-2]
                }
            ]
        };

        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            name: ['', [Validators.required, 
                        Validators.minLength(this.validator.name.min),
                        Validators.maxLength(this.validator.name.max)]],
            address: ['', [Validators.required, 
                        Validators.minLength(this.validator.name.min),
                        Validators.maxLength(this.validator.name.max)]],
            city: ['', [Validators.required, 
                        Validators.minLength(this.validator.name.min),
                        Validators.maxLength(this.validator.name.max)]],
            state: ['', [Validators.required, 
                        Validators.minLength(this.validator.name.min),
                        Validators.maxLength(this.validator.name.max)]],
            country: ['', [Validators.required, 
                        Validators.minLength(this.validator.name.min),
                        Validators.maxLength(this.validator.name.max)]],
            client_name: ['', [Validators.required, 
                        Validators.minLength(this.validator.name.min),
                        Validators.maxLength(this.validator.name.max)]],
            client_email: ['', [Validators.required, ValidEmail, ValidEmail, 
                        Validators.minLength(this.validator.email.min),
                        Validators.maxLength(this.validator.email.max)]],
            client_phone: ['', [Validators.required, 
                        Validators.minLength(this.validator.phone.min),
                        Validators.maxLength(this.validator.phone.max)]],
            active: ['',  [Validators.required]],
            status: ['',  [Validators.required]]
        });
    }

    get f() { return this.editForm.controls; }

    editDetail(editModal, data) {

        this.apiService.getData(data).subscribe(response => {
            console.log(response);
            this.requestDetail = response.data;
            console.log('this.requestDetail', this.requestDetail)
            this.editForm.reset();
            this.editing = true;
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.editForm.patchValue({
                data: this.requestDetail._id,
                name: this.requestDetail.name,
                address: this.requestDetail.address,
                city: this.requestDetail.city,
                state: this.requestDetail.state,
                country: this.requestDetail.country,
                client_name: this.requestDetail.client.name,
                client_email: this.requestDetail.client.email,
                client_phone: this.requestDetail.client.phone,
                status: this.requestDetail.status,
                active: this.requestDetail.active
            });
            this.modalService.open(editModal, {
                size: 'lg'
            });
        },
        error => {
            // this.noti
        }
        );
    }

    view(id) {
         this.router.navigate(['project/'+ id]);
    }

    deleteRequest(data) {

        this.apiService.deleteData(data).subscribe(response => {
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

        if (this.editing) {
            var value = this.editForm.getRawValue()
            console.log('this.editForm', this.editForm.getRawValue());
            var params = {
                'name': value.name,
                'address': value.address,
                'city': value.city,
                'state': value.state,
                'status': value.status,
                'country': value.country,
                'clientName': value.client_name,
                'clientEmail': value.client_email,
                'clientPhone': value.client_phone,
                'data': value.data,
                'active': value.active
            }
            this.apiService.updateData(params)
            .pipe(first())
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
                            this.editForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                        }
                    }
                },
                () => {
                    this.submitted = false;
                });
        } else {
            this.apiService.create(this.editForm.getRawValue())
            .pipe(first())
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
                            this.editForm.get(check).setErrors( { customError : fieldError.msg } ) ;
                        }
                    }
                },
                () => {
                    this.submitted = false;
                });
        }

    }



    refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    createData(modal) {
        this.f.data.setValidators(null);
        this.f.data.updateValueAndValidity();
        this.editing = false;
        this.editForm.reset();
        this.modalService.open(modal);
    }

    deleteConfirmation(data){
        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.data = data;
        modalRef.result.then((result) => {
            if (result) {
                console.log('delete', data)
                this.deleteRequest(result);
            }
        },
        (error) => {
            console.log(error);
        });
    }

}

