import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ProjectWellService } from 'src/app/@core/services/project-well.service';
import { ProjectService } from 'src/app/@core/services/project.service';
import { ProjectWell } from 'src/app/@core/models/project.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/@core/services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class RigListComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;

    statusFilterData = [{id: '', name: 'All'}, {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusData = [ {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusFilter = '';
    editing = false;
    projectFilter = '';
    projectFilterData = [];
    projectOptionData = [];
    userOptionData = [];
    title = 'Rig location';
    dtOptions: DataTables.Settings = {};
    requestDetail: ProjectWell;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    dataList: ProjectWell[];
    countryList: Observable<Country[]>;
    submitted = false;
    today = new Date();
    minDate = {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};
    projectId: any;
    people = [];

    constructor(private commonService: CommonService,
                private projectWellService: ProjectWellService,
                private modalService: NgbModal,
                private modalConfig: NgbModalConfig,
                private formService: FormService,
                private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private projectService: ProjectService,
                private service: UserService) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log('route', params.data);
            const projectId = params.data;
            if (projectId !== undefined) {
                this.projectFilter = projectId;
            }
        });
        this.projectService.getAll().subscribe(response => {
            console.log('AllProject', response.data);
            const allProjects = response.data;
            this.projectFilterData = [{_id: '', name: 'All'}, ...allProjects];
            this.projectOptionData = [...allProjects];
        });
        this.service.getUserByType('MANAGER').subscribe(users => {
            console.log('userList', users.data);
            const array = [];
            // tslint:disable-next-line: forin
            for (const i in users.data) {
                array.push({name: users.data[i].name,
                     _id: users.data[i]._id,
                    profilePic: users.data[i].profilePic,
                    designation: users.data[i].designation});
            }
            this.people = array;
        });
        const that = this;
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
              // tslint:disable-next-line: no-string-literal
              dataTablesParameters['filter'] = [];
              // tslint:disable-next-line: no-string-literal
              dataTablesParameters['filter'][0] = {column: 'project', data: this.projectFilter};
              // tslint:disable-next-line: no-string-literal
              dataTablesParameters['filter'][1] = {column: 'active', data: this.statusFilter};
              console.log(dataTablesParameters);
              const responseData = this.projectWellService.getList(dataTablesParameters).pipe(first())
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
              }
              );


          },
          columns: [
                    { data: 'name' },
                    { data: 'project' },
                    { data: 'manager' },
                    { data: 'active' }, { data: '_id' }],
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
            }
        ]
        };

        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            fieldName: ['', [Validators.required, Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)]],
            rigLocation: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.minLength(this.validator.name.min),
                    Validators.maxLength(this.validator.name.max)]],
            active: [null, [Validators.required]],
            country: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            // project: ['', [Validators.required]]
        });
        this.commonService.getRequestFormData().subscribe(res => {
            this.countryList = this.commonService.getCountryList();
        });
    }


    get f(): any { return this.editForm.controls; }

    editDetail(editModal, data) {
        console.log('edit', data);
        this.editing = true;
        this.projectWellService.getData(data).subscribe(response => {
            console.log(response);
            this.requestDetail = response.data.data;
            this.editForm.reset();
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.editForm.patchValue({
                data: this.requestDetail._id,
                fieldName: this.requestDetail.fieldName,
                rigLocation: this.requestDetail.rigLocation,
                name: this.requestDetail.name,
                active: this.requestDetail.active,
                country: this.requestDetail.country._id,
                manager: this.requestDetail.manager._id,
                // project: this.requestDetail.project,
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

    deleteRequest(data) {

        this.projectWellService.deleteData(data).subscribe(response => {
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
        // this.editForm.controls['data'].setValue(this.projectId);
        this.formService.clearCustomError(this.editForm);
        this.submitted = true;
        this.editForm.markAllAsTouched();
        console.log(this.editForm.getRawValue());
        if (this.editForm.invalid) {
            console.log('this.editForm-not valid');
            this.submitted = false;
            return false;
        }

        if (this.editing) {
            // tslint:disable-next-line: no-var-keyword
            const value = this.editForm.getRawValue();
            console.log('this.editForm', this.editForm.getRawValue());
            this.projectWellService.updateData(value)
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
            const value1 = this.editForm.getRawValue();
            console.log('this.editForm', value1);
            this.projectWellService.create(value1)
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
        // this.f.data.updateValueAndValidity();
        this.requestDetail = {
            name: '',
            status: 1
        };
        this.editing = false;
        this.editForm.reset();
        // this.f.data.setValue(this.projectId);
        this.modalService.open(modal, {
            size: 'lg'
        });
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

    view(id) {
        this.router.navigate([]).then(result => {  window.open('riglocation/details/' +  id, '_blank'); });
        // this.router.navigateByUrl('riglocation/details/' +  id);
    }

}
