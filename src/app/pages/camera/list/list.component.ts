import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyRequest } from 'src/app/@core/models/company-request.model';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { ProjectCamera } from 'src/app/@core/models/project.model';
import { ProjectCameraService } from 'src/app/@core/services/project-camera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/@core/services/user.service';
import { ProjectService } from 'src/app/@core/services/project.service';
import { ProjectWellService } from 'src/app/@core/services/project-well.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    passwordHidden = true;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    people = [];
    id = [];
    statusFilterData = [{ id: '', name: 'All' }, { id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
    statusData = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
    statusFilter = '';
    editing = false;
    hideProRig = false;
    button = false;
    title = 'Camera';
    dtOptions: DataTables.Settings = {};
    requestDetail: ProjectCamera;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    dataList: ProjectCamera[];
    projectFilterData = [];
    projectOptionData = [];
    wellOptionData = [];
    wellFilterData = [];
    projectFilter = '';
    rigFilter: any;
    rigID: any;
    // dataList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    wellId = '';
    projectId = '';
    selectedPeople = [];
    // tslint:disable-next-line: variable-name
    selectedPeople_Id = [];
    minDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
    checkCtrl: FormControl;
    hideConfirm: boolean = true;
    hourStep = 1;
    minuteStep = 15;
    projectName = '';
    rigName = '';


    constructor(private commonService: CommonService,
        private apiService: ProjectCameraService,
        private modalService: NgbModal,
        private modalConfig: NgbModalConfig,
        private formService: FormService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private service: UserService,
        private projectService: ProjectService,
        private wellService: ProjectWellService,
        private activeRoute: ActivatedRoute,
        private router: Router) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(params => {
            console.log('from Rig', params);
            const projectId = params;
            if (projectId.data !== undefined) {
                this.projectFilter = projectId.data;
                this.f.data.setValue(projectId.data);
                console.log('route', this.projectFilter);
                this.projectOnchange('', '');
            }
            if (params.proId !== undefined && params.rigId !== undefined) {
                this.projectFilter = projectId.proId;
                this.rigID = projectId.rigId;
                console.log('route', this.rigID);
                this.projectOnchange('', '');
            }
        });
        this.projectService.getAll().subscribe(response => {
            const allProjects = response.data;
            console.log('AllProject', allProjects);

            this.projectFilterData = [{ _id: '', name: 'All' }, ...allProjects];
            this.projectOptionData = [...allProjects];
        });
        this.service.getUserByType('OTHER').subscribe(users => {
            console.log('userList', users.data);
            const array = [];
            // tslint:disable-next-line: forin
            for (const i in users.data) {
                array.push({
                    name: users.data[i].name,
                    _id: users.data[i]._id,
                    profilePic: users.data[i].profilePic,
                    designation: users.data[i].designation
                });
            }
            this.people = array;
        });
        const that = this;
        this.activeRoute.params.subscribe(param => {
            this.wellId = param.data;
            this.projectId = param.project;
            console.log('project', param.project);
        });
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
                // dataTablesParameters['well'] = this.wellId;
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'] = [];
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'][0] = { column: 'well', data: this.rigFilter ? this.rigFilter : '' };
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'][1] = { column: 'active', data: this.statusFilter };
                // dataTablesParameters['filter'][1] = {column: 'project', data: this.projectId};
                console.log(dataTablesParameters);
                const responseData = this.apiService.getList(dataTablesParameters).pipe(first())
                    .subscribe(response => {
                        console.log(response);
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
                { data: 'project' },
                { data: 'well' },
                { data: 'active' }, { data: '_id' }
            ],
            columnDefs: [{
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
            data: [null, [Validators.required]],
            name: ['', [Validators.required, Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)
            ]],
            url: ['', [Validators.required, Validators.minLength(this.validator.camUrl.min),
                Validators.maxLength(this.validator.camUrl.max)
            ]],
            username: ['', [Validators.required, Validators.minLength(this.validator.camUsername.min),
                Validators.maxLength(this.validator.camUsername.max)
            ]],
            password: ['', [Validators.required, Validators.minLength(this.validator.camPassword.min),
                Validators.maxLength(this.validator.camPassword.max)
            ]],
            active: ['', [Validators.required]],
            confirm: [0, [Validators.required]],
            default: [0, [Validators.required]],
            project: [null, [Validators.required]],
            users: [null, [Validators.required]]
        });
        this.checkCtrl = this.editForm.get('default') as FormControl;

    }

    onAdd(event) {
        console.log('onAdd', event);
        // this.selectedPeople.push(event);
    }

    onRemove(event) {
        console.log('event', event.value);
        const removed = this.selectedPeople.filter(a => a.name !== event.value.name);
        console.log('removed', removed);
        // this.selectedPeople = removed;
    }

    onClear(event) {
        console.log('event', event);
        // this.selectedPeople = [];
    }

    get f(): any { return this.editForm.controls; }

    editDetail(editModal, data) {
        this.selectedPeople = [];
        this.apiService.getData(data).subscribe(response => {
                console.log(response);
                this.requestDetail = response.data;
                this.editForm.reset();
                this.editing = true;
                this.f.data.setValidators([Validators.required]);
                this.f.data.updateValueAndValidity();
                this.hideProRig = true;
                this.f.project.setValidators(null);
                // this.projectOnchange('edit', this.requestDetail.project._id);
                this.editForm.patchValue({
                    data: this.requestDetail._id,
                    name: this.requestDetail.name,
                    url: this.requestDetail.url,
                    username: this.requestDetail.username,
                    password: this.requestDetail.password,
                    active: this.requestDetail.active,
                    confirm: this.requestDetail.default,
                    default: this.requestDetail.default,
                    // project: this.requestDetail.project._id
                });
                this.modalService.open(editModal, {
                    size: 'lg'
                });
                this.projectName = this.requestDetail.project.name;
                this.rigName = this.requestDetail.well.name;
                // tslint:disable-next-line: forin
                const userId = [];
                for (const i in this.requestDetail.users) {
                    // tslint:disable-next-line: triple-equals
                    console.log('this.people', this.people);
                    console.log('this.requestDetail.users', this.requestDetail.users);
                    const filter = this.people.filter(a => a._id === this.requestDetail.users[i]._id);
                    // tslint:disable-next-line: forin
                    for (const f in filter) {
                        userId.push(filter[f]._id);
                    }
                }
                this.f.users.setValue(userId);
                console.log('filter', userId);
            },
            error => {
                // this.noti
            }
        );
    }

    view(id) {
        this.router.navigate([]).then(result => { window.open('camera/details/' + id, '_blank'); });
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

    setsubmit() {
        this.submitted = false;
    }

    updateRequest() {
        this.submitted = true;
        // const params = {
        //     data: this.editForm.getRawValue().data,
        //     name: this.editForm.getRawValue().name,
        //     url: this.editForm.getRawValue().url,
        //     username: this.editForm.getRawValue().username,
        //     password: this.editForm.getRawValue().password,
        //     active: this.editForm.getRawValue().active,
        //     users: this.editForm.getRawValue().users
        // };
        if (this.editForm.invalid) {
            console.log('invalid');
            // this.submitted = false;
            this.formService.clearCustomError(this.editForm);
            this.editForm.markAllAsTouched();
            return false;
        }

        if (this.editForm.valid) {
            this.button = true;
        }

        if (this.editing) {
            this.apiService.updateData(this.editForm.getRawValue())
                .pipe(first())
                .subscribe(
                    data => {
                        if (data.status === 'success') {
                            console.log(data);
                            this.toastr.success('', data.message);
                            this.modalService.dismissAll();
                            this.editForm.reset();
                            this.selectedPeople = [];
                            this.selectedPeople_Id = [];
                            this.refreshTable();
                            this.button = false;
                        }

                    },
                    error => {
                        this.submitted = false;
                        this.button = false;
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
                        this.button = false;
                    });
        } else {
            // console.log('params', params);
            this.apiService.create(this.editForm.getRawValue())
                .pipe(first())
                .subscribe(
                    data => {
                        if (data.status === 'success') {
                            console.log(data);
                            this.toastr.success('', data.message);
                            this.modalService.dismissAll();
                            this.editForm.reset();
                            this.selectedPeople = [];
                            this.selectedPeople_Id = [];
                            this.refreshTable();
                            this.button = false;
                        }

                    },
                    error => {
                        this.submitted = false;
                        this.button = false;
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
                        this.button = false;
                    });
        }
    }

    togglePassword() {
        this.passwordHidden = !this.passwordHidden;
    }

    projectOnchange(data, event) {
        // tslint:disable-next-line: no-var-keyword
        let id: any;
        if (data !== 'edit') {
            if (this.projectFilter) {
                id = this.projectFilter;
                console.log('this.projectFilter', id);
            } else {
                id = event._id;
                console.log('event', id);
            }
        } else {
            console.log('edit-projId', event);
            id = event;
        }
        if (id) {
            // tslint:disable-next-line: no-shadowed-variable
            this.wellService.getAll(id).subscribe(result => {
                this.wellFilterData = [{ _id: '', name: 'All' }, ...result.data];
                if (this.rigID !== undefined) {
                    this.rigFilter = this.rigID;
                } else if (data === 'projectFlter') {
                    this.rigFilter = '';
                }
                if (data === 'projectSelect') {
                    this.wellOptionData = [...result.data];
                    this.f.data.setValue(result.data[0] ? result.data[0]._id : null);
                }
                this.refreshTable();
            });
        } else {
            this.wellFilterData = [];
            this.rigFilter = null;
            this.refreshTable();
        }
        if (data !== 'projectFlter') {
            this.refreshTable();
        }
    }

    onchange(event) {
        console.log('event', event.target.checked);
        const checked = event.target.checked;
        if (checked) {
            this.hideConfirm = false;
            this.f.default.setValue(1);
            this.f.users.setValidators(null);
            this.f.users.setValue(null);
        } else {
            this.hideConfirm = true;
            this.f.default.setValue(0);
            this.f.confirm.setValue(0);
            this.f.users.setValidators([Validators.required]);
        }
    }

    onConfirmChange(event) {
        console.log('event', event.target.checked);
        const checked = event.target.checked;
        if (checked) {
            this.f.confirm.setValue(1);
        } else {
            this.f.confirm.setValue(0);
        }
    }

    refreshTable() {
        console.log('refresh');
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    createData(modal) {
        this.hideProRig = false;
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
        // this.f.data.setValue(this.wellId);
        this.f.confirm.setValue(0);
        this.f.default.setValue(0);
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

}
