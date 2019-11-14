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
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-project',
    templateUrl: './list-project.component.html',
    styleUrls: ['./list-project.component.css']
})

export class ListProjectComponent implements OnInit {

    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    depthData = [ {name: 'ft'}, {name: 'm'}];
    statusFilterData = [{ id: '', name: 'All' }, { id: 0, name: 'Inprogress' }, { id: 1, name: 'Completed' }];
    statusData = [{ id: 0, name: 'Inprogress' }, { id: 1, name: 'Completed' }];
    activeData = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
    statusFilter = '';
    editing = false;
    fieldEnvData = [
        { id: 1, name: 'Onshore' },
        { id: 2, name: 'Swamp' },
        { id: 3, name: 'Offshore' },
        { id: 4, name: 'Deep Water' }];
    title = 'Projects';
    dtOptions: DataTables.Settings = {};
    requestDetail: Project;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    countryList: Observable<Country[]>;
    dataList: Project[];
    // dataList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    minDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
    fieldEnvName: any;

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
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'][0] = { column: 'status', data: this.statusFilter };
                console.log(dataTablesParameters);
                const responseData = this.apiService.getList(dataTablesParameters).pipe(first())
                    .subscribe(response => {
                        console.log(response);
                        // this.fieldEnvName = response.data.data;
                        if (response.code === 200) {
                            this.dataList = response.data.data;
                            callback({
                                recordsTotal: response.data.recordsTotal,
                                recordsFiltered: response.data.recordsFiltered,
                                data: []
                            });
                        }
                    });
            },
            columns: [
                { data: 'name' },
                { data: 'blockName' },
                { data: 'fieldName' },
                { data: 'fieldEnv' },
                { data: 'wellName' },
                { data: 'depth' },
                { data: 'depthType' },
                // { data: 'country' },
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
                    orderable: false,
                    targets: [-2]
                },
                {
                    searchable: false,
                    orderable: false,
                    targets: [-3]
                },
                {
                    searchable: false,
                    orderable: false,
                    targets: [-4]
                },
                {
                    searchable: false,
                    targets: [-5]
                },
                {
                    searchable: false,
                    targets: [-6]
                },
                {
                    searchable: false,
                    targets: [6],
                    visible: false
                }
            ]
        };

        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            name: ['', [Validators.required,
            Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
            blockName: ['', [Validators.required,
            Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
            fieldName: ['', [Validators.required,
            Validators.minLength(this.validator.name.min),
            Validators.maxLength(this.validator.name.max)]],
            fieldEnv: ['', [Validators.required]],
            wellName: ['', [Validators.required]],
            depth: ['', [Validators.required]],
            depthType: ['', [Validators.required]],
            country: ['', [Validators.required]],
            status: ['', [Validators.required]],
            active: ['', [Validators.required]]
        });
        this.commonService.getRequestFormData().subscribe(res => {
            this.countryList = this.commonService.getCountryList();
        });
    }

    get f(): any { return this.editForm.controls; }

    editDetail(editModal, data) {

        this.apiService.getData(data).subscribe(response => {
            console.log(response);
            this.requestDetail = response.data.data;
            console.log('this.requestDetail', this.requestDetail);
            this.editForm.reset();
            this.editing = true;
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.editForm.patchValue({
                data: this.requestDetail._id,
                name: this.requestDetail.name,
                blockName: this.requestDetail.blockName,
                fieldName: this.requestDetail.fieldName,
                fieldEnv: this.requestDetail.fieldEnv,
                country: this.requestDetail.country,
                wellName: this.requestDetail.wellName,
                depth: this.requestDetail.depth,
                depthType: this.requestDetail.depthType,
                status: this.requestDetail.status,
                active: this.requestDetail.active,
            });

            // var country = this.countryList.subscribe(country => {
            //     // var country = res.filter(a => a._id == this.requestDetail.country)
            //     console.log('country', country)
            // })

            this.modalService.open(editModal, {
                size: 'lg'
            });
        },
            error => {
                // this.noti
            });
    }

    view(id) {
        this.router.navigate([]).then(result => {  window.open('project/details/' + id, '_blank'); });
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
            });
    }

    updateRequest() {
        this.formService.clearCustomError(this.editForm);
        this.submitted = true;
        this.editForm.markAllAsTouched();
        console.log(this.editForm.getRawValue());
        if (this.editForm.invalid) {
            console.log('EditForm not valid');
            this.submitted = false;
            return false;
        }

        if (this.editing) {
            const value = this.editForm.getRawValue();
            console.log('this.editForm', value);
            const params = {
                name: value.name,
                blockName: value.blockName,
                fieldName: value.fieldName,
                fieldEnv: value.fieldEnv,
                status: value.status,
                country: value.country,
                wellName: value.wellName,
                depth: value.depth,
                depthType: value.depthType,
                data: value.data,
                active: value.active
            };
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
                                this.editForm.get(check).setErrors({ customError: fieldError.msg });
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
                                this.editForm.get(check).setErrors({ customError: fieldError.msg });
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

    deleteConfirmation(data) {
        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.data = data;
        modalRef.result.then((result) => {
            if (result) {
                console.log('delete', data);
                this.deleteRequest(result);
            }
        },
            (error) => {
                console.log(error);
            });
    }

}
