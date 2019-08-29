import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyRequest } from 'src/app/@core/models/company-request.model';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { ProjectCamera } from 'src/app/@core/models/project.model';
import { ProjectCameraService } from 'src/app/@core/services/project-camera.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/@core/services/user.service';

@Component({
    selector: 'app-camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.css']
  })
export class CameraComponent implements OnInit {
    passwordHidden = true;
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    people = [];
    id = [];
    statusFilterData = [{id: '', name: 'All'}, {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusData = [ {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusFilter = '';
    editing = false;

    title = 'Camera';
    dtOptions: DataTables.Settings = {};
    requestDetail: ProjectCamera;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    dataList: ProjectCamera[];
    // dataList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    wellId = '';
    projectId = '';
    selectedPeople = [];
    selectedPeople_Id= [];
    minDate = {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};

    constructor(private commonService: CommonService,
                private apiService: ProjectCameraService,
                private modalService: NgbModal,
                private modalConfig: NgbModalConfig,
                private formService: FormService,
                private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private service: UserService,
                private activeRoute: ActivatedRoute) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        this.service.getAllUser().subscribe(users => {
            console.log('userList', users.data);
            var array = []
            for(var i in users.data) {
                array.push({"name": users.data[i].name, "_id": users.data[i]._id})
            }
            this.people = array;
        })
        const that = this;
        this.activeRoute.params.subscribe(param => {
            this.wellId = param.data;
            this.projectId = param.project;
            console.log('project', param.project)
        });
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
              dataTablesParameters['well'] = this.wellId;
              dataTablesParameters['filter'] = [];
              dataTablesParameters['filter'][0] = {column: 'active', data: this.statusFilter};
              // dataTablesParameters['filter'][1] = {column: 'project', data: this.projectId};
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
              }
              );


          },
          columns: [
                    { data: 'name' },
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
            }
        ]
        };

        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)]],
            url: ['', [Validators.required, Validators.minLength(this.validator.camUrl.min),
                    Validators.maxLength(this.validator.camUrl.max)]],
            username: ['', [Validators.required, Validators.minLength(this.validator.camUsername.min),
                        Validators.maxLength(this.validator.camUsername.max)]],
            password: ['', [Validators.required, Validators.minLength(this.validator.camPassword.min),
                            Validators.maxLength(this.validator.camPassword.max)]],
            active: ['', [Validators.required]],
            users: ['', [Validators.required]]
        });


    }

    onAdd(event) {
        console.log('onAdd', event);
        this.selectedPeople.push(event);
    }

    onRemove(event) {
        console.log('event', event.value);
        let removed = this.selectedPeople.filter( a => a.name !== event.value.name);
        console.log('removed', removed);
        this.selectedPeople = removed;
    }

    onClear(event) {
        console.log('event', event);
        this.selectedPeople = [];
    }


    get f() { return this.editForm.controls; }

    editDetail(editModal, data) {
        this.selectedPeople = [];
        this.apiService.getData(data).subscribe(response => {
            console.log(response);
            this.requestDetail = response.data;
            this.editForm.reset();
            this.editing = true;
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.editForm.patchValue({
               data: this.requestDetail._id,
               name: this.requestDetail.name,
               url: this.requestDetail.url,
               username: this.requestDetail.username,
               password: this.requestDetail.password,
               active: this.requestDetail.active,
               users: this.requestDetail.users
            });
            this.modalService.open(editModal, {
                size: 'lg'
            });
            for(var i in this.requestDetail.users) {
                var filter = this.people.filter(a => a._id == this.requestDetail.users[i]);
                console.log('filter', filter);
                for(var j in filter) {
                    this.selectedPeople.push(filter[j])
                }
                console.log('this.requestDetail.users[i]', this.requestDetail.users[i]);
            }
        },
        error => {
            // this.noti
        }
        );
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
        var params = {
            data: this.editForm.getRawValue().data,
            name: this.editForm.getRawValue().name,
            url: this.editForm.getRawValue().url,
            username: this.editForm.getRawValue().username,
            password: this.editForm.getRawValue().password,
            active: this.editForm.getRawValue().active,
            users: this.editForm.getRawValue().users
        }
        console.log(this.editForm.getRawValue());
        if (this.editForm.invalid) {
            this.submitted = false;
            return false;
        }

        if (this.editing) {
            this.apiService.updateData(params)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.toastr.error('', data.message);
                        this.modalService.dismissAll();
                        this.editForm.reset();
                        this.selectedPeople = [];
                        this.selectedPeople_Id = [];
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
            console.log('params', params)
            this.apiService.create(params)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status === 'success') {
                        console.log(data);
                        this.toastr.error('', data.message);
                        this.modalService.dismissAll();
                        this.editForm.reset();
                        this.selectedPeople = [];
                        this.selectedPeople_Id = [];
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

    togglePassword(){
        this.passwordHidden = !this.passwordHidden
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
        this.selectedPeople_Id = [];
        this.selectedPeople = [];
        this.f.data.setValue(this.wellId);
        this.modalService.open(modal, {
            size: 'lg'
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
