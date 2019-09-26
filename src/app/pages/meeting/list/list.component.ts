import { Component, OnInit, ViewChild, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
import { CancelModalComponent } from 'src/app/@theme/components/modals/cancel-modal/cancel-modal';
import { UserService } from 'src/app/@core/services/user.service';
import { MeetingService } from 'src/app/@core/services/meeting.service';
import { UserType } from 'src/app/@core/models/user-type.model';
import { User } from 'src/app/@core/models/user.model';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';
import { ProjectService } from 'src/app/@core/services/project.service';
import { ProjectWellService } from 'src/app/@core/services/project-well.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    permission = 'create';
    dateFormet;
    statusFilterData = [
        { id: '', name: 'All' },
        { id: 1, name: 'Active' },
        { id: 0, name: 'Cancelled' }
    ];
    blockedFilterData = [
        { id: '', name: 'All' },
        { id: 0, name: 'Unblocked' },
        { id: 1, name: 'Blocked' }
    ];
    activeList = [
        { id: 1, name: 'Active' },
        { id: 0, name: 'Cancelled' }
    ];
    blockList = [
        { id: 0, name: 'Unblocked' },
        { id: 1, name: 'Blocked' }
    ];
    statusFilter = '';
    typeFilter = '';
    blockFilter = '';
    dateRangeFilter = '';
    userTypeList: UserType[];
    userTypeFilterData: UserType[];
    subscription: Subscription;

    title = 'Meetings';
    dtOptions: DataTables.Settings = {};
    // companyList: Observable<CompanyRequest[]>;
    // callback: any;
    companyList: any[];
    requestDetail: User;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    countryList: Observable<Country[]>;
    packageList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    editing = false;
    minDate = {
        year: this.today.getFullYear(),
        month: this.today.getMonth() + 1,
        day: this.today.getDate()
    };
    modelData;
    MeetingType = [
        { id: 1, name: 'Occur once' },
        { id: 2, name: 'Daily Meeting' },
        { id: 3, name: 'Weekly Meeting' },
        { id: 4, name: 'Monthly Meeting' }];
        dayType = [
            { id: 0, name: 'Sunday' },
            { id: 1, name: 'Monday' },
            { id: 2, name: 'Tuesday' },
            { id: 3, name: 'Wednesday' },
            { id: 4, name: 'Thursday' },
            { id: 5, name: 'Friday' },
            { id: 6, name: 'Saturday' }];
    projectOptionData: any[];
    wellFilterData: any[];
    rigID: any;
    rigFilter: any;
    wellFilter: any;
    wellOptionData: any[];
    projectFilterData: any[];
    projectFilter = '';
    meetingUsers: any[];

    constructor(
        private commonService: CommonService,
        private apiService: UserService,
        private meetService: MeetingService,
        private modalService: NgbModal,
        private modalConfig: NgbModalConfig,
        private formService: FormService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectService: ProjectService,
        private wellService: ProjectWellService,
        private cd: ChangeDetectorRef
    ) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        const that = this;
        this.subscription = this.commonService
            .getUserTypeList()
            .subscribe( data => {
                this.userTypeList = data.slice();
                const temp = new UserType();
                temp.name = 'All';
                temp._id = '';
                data.unshift(temp);
                this.userTypeFilterData = data;
            });
        this.projectService.getAll().subscribe(response => {
            const allProjects = response.data;
            console.log('AllProject', allProjects);

            this.projectFilterData = [{_id: '', name: 'All'}, ...allProjects];
            this.projectOptionData = [...allProjects];
        });
        this.commonService.getUserTypeData().subscribe();

        // this.companyList = this.apiService.getCompanyRequestList();
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
                dataTablesParameters['filter'][0] = {
                    column: 'active',
                    data: this.statusFilter
                };
                dataTablesParameters['filter'][1] = {
                    column: 'status',
                    data: this.blockFilter
                };
                dataTablesParameters['filter'][2] = {column: 'well', data: this.rigFilter ? this.rigFilter : ''};
                console.log('data', dataTablesParameters);
                const responseData = this.meetService
                    .getList(dataTablesParameters)
                    .pipe(first())
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
                    });
            },
            columns: [
                { data: 'title' },
                { data: 'project' },
                { data: 'well' },
                // { data: 'desc' },
                // { data: 'startTime' },
                { data: 'duration' },
                { data: 'active' },
                { data: 'status' },
                { data: 'attenders'}
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
                }

            ]
        };
        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.validator.name.min),
                    Validators.maxLength(this.validator.name.max)
                ]
            ],
            type: [
                '',
                [
                    Validators.required
                ]
            ],
            startTime: [
                '',
                [
                    Validators.required
                ]
            ],
            duration: [
                ''
            ],
            project: ['', [Validators.required]],
            well: ['', [Validators.required]],
            desc: ['', [Validators.required]],
            attenders: [[], [Validators.required]],
            active: ['', [Validators.required]]
        });
        this.licenseForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.validator.name.min),
                    Validators.maxLength(this.validator.name.max)
                ]
            ],
            companyName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.validator.company.min),
                    Validators.maxLength(this.validator.company.max)
                ]
            ],
            email: [
                '',
                [
                    Validators.required,
                    ValidEmail
                ]
            ],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.validator.phone.min),
                    Validators.maxLength(this.validator.phone.max)
                ]
            ],
            country: ['', [Validators.required]],
            package: ['', [Validators.required]],
            userCount: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.validator.userCount.min),
                    Validators.min(this.validator.userCount.minValue),
                    Validators.max(this.validator.userCount.maxValue)
                ]
            ],
            licenseDate: ['', [Validators.required]]
        });
        // const data = this.commonService.getRequestFormData().subscribe();
        // this.countryList = this.commonService.getCountryList();
        // this.packageList = this.commonService.getPackageList();
    }

    ngOnChanges() {
        console.log()
    }

    projectOnchange(data, event) {
        // tslint:disable-next-line: no-var-keyword
        let id: any;
        id = event._id;
        if (id) {
            // tslint:disable-next-line: no-shadowed-variable
            this.wellService.getAll(id).subscribe(result => {
                console.log('result', result.data);
                this.wellFilterData = [{_id: '', name: 'All'}, ...result.data];
                if (this.rigID !== undefined) {
                    this.rigFilter = this.rigID;
                } else if (data === 'projectFlter') {
                    this.rigFilter = '';
                } else if (data === 'projectSelect') {
                    this.wellOptionData = [...result.data];
                    // this.f.well.setValue(result.data[0] ? result.data[0]._id : null);
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

    rigOnchange(event) {
        console.log('rigOnchange', event);
        this.meetService.getMeetingUser(event.project, event._id).subscribe(response => {
            console.log('meetinguser', response.data.currentProject);
            this.meetingUsers = [...response.data.currentProject];
        });
    }

    statusClass(status) {
        switch (status) {
            case 0:
                return 'badge-waning';
            case 1:
                return 'badge-success';
            case 2:
                return 'badge-danger';
        }
    }

    get f() {
        return this.editForm.controls;
    }
    get lf() {
        return this.licenseForm.controls;
    }

    view(detailModal, MeetId) {
        console.log('modleData', MeetId);
        this.meetService.getData(MeetId).subscribe(data => {
            console.log('data', data.data);
            this.modelData = data.data;
            switch (this.modelData.type) {
                case 1:
                    this.dateFormet =  'medium';
                    break;
                case 2:
                    this.dateFormet =  'h:mm a';
                    break;
                case 3:
                    this.dateFormet =  'h:mm a, ';
                    break;
                case 4:
                    this.dateFormet =   'd, h:mm a';
                    break;
            }
            this.modalService.open(detailModal, {
                size: 'lg'
            });
        })
        // this.apiService.getData(data).subscribe(
        //     response => {
        //         this.requestDetail = response.data;
        //         this.editForm.reset();
        //         this.f.data.setValidators([Validators.required]);
        //         this.f.active.setValidators([Validators.required]);
        //         this.f.block.setValidators([Validators.required]);
        //         this.editing = true;
        //         this.editForm.patchValue({
        //             data: this.requestDetail._id,
        //             name: this.requestDetail.name,
        //             designation: this.requestDetail.designation,
        //             email: this.requestDetail.email,
        //             phone: this.requestDetail.phone,
        //             userType: this.requestDetail.userType,
        //             active: this.requestDetail.active,
        //             block: this.requestDetail.blocked,
        //         });
        //         this.modalService.open(editModal, {
        //             size: 'lg'
        //         });
        //     },
        //     error => {
        //         // this.noti
        //     }
        // );
    }

    deleteRequest(data) {
        this.meetService.deleteData(data).subscribe(
            response => {
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
        this.apiService.getData(data).subscribe(
            response => {
                this.requestDetail = response.data;
                this.licenseForm.reset();
                this.licenseForm.patchValue({
                    data: this.requestDetail._id,
                    name: this.requestDetail.name,
                    // companyName: this.requestDetail.companyName,
                    email: this.requestDetail.email,
                    phone: this.requestDetail.phone,
                    // country: this.requestDetail.country._id,
                    // package: this.requestDetail.package._id,
                    // userCount: this.requestDetail.userCount
                    // notes: this.requestDetail.notes,
                });
                this.modalService.open(licenseModal, { size: 'lg' });
            },
            error => {
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

        if ( this.editing ) {
            this.apiService
                .updateData(this.editForm.getRawValue())
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
                                this.editForm
                                    .get(check)
                                    .setErrors({ customError: fieldError.msg });
                            }
                        }
                    },
                    () => {
                        this.submitted = false;
                    }
                );
        } else {
            const currentData = this.editForm.getRawValue();
            console.log(currentData);
            this.apiService
            .create(currentData)
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
                            this.editForm
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

    refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    deleteConfirmation(data) {
        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.data = data;
        modalRef.result.then(
            result => {
                if (result) {
                    this.deleteRequest(result);
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    CancelConfirmation(id, active) {
        var params:any;
        if(active == 0) {
            params = {
                "data" : id,
                "status" : 1
            }
        }
        else {
            params = {
                "data" : id,
                "status" : 0
            }
        }
        console.log(params)
        const modalRef = this.modalService.open(CancelModalComponent);
        modalRef.componentInstance.data = params;
        modalRef.result.then(
            result => {
                if (result) {
                    this.cancelRequest(result);
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    cancelRequest(data) {
        console.log(data)
        this.meetService.updateData(data).subscribe(
            response => {
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

    createData(createModal) {
        this.f.data.setValidators(null);
        this.f.active.setValidators(null);
        this.f.data.updateValueAndValidity();
        this.requestDetail = {
            name: '',
        };
        this.editing = false;
        this.editForm.reset();
        this.modalService.open(createModal, {
            size: 'lg'
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
