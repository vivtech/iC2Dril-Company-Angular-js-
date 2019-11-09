import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { Country } from 'src/app/@core/models/country.model';
import { Package } from 'src/app/@core/models/package.model';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { CancelModalComponent } from 'src/app/@theme/components/modals/cancel-modal/cancel-modal';
import { MeetingService } from 'src/app/@core/services/meeting.service';
import { UserType } from 'src/app/@core/models/user-type.model';
import { Meeting } from 'src/app/@core/models/meeting.model';
import { ProjectService } from 'src/app/@core/services/project.service';
import { ProjectWellService } from 'src/app/@core/services/project-well.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    permission = 'create';
    dateFormet;
    minDate: any;
    selecttime = true;
    selectdate = false;
    selectday = false;
    newDate = new Date();
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
    requestDetail: Meeting;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    countryList: Observable<Country[]>;
    packageList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    editing = false;
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
    selectedDate: any;
    selectedTime: any;
    dayOptionData = [
        { _id: 0, name: 'Sunday' },
        { _id: 1, name: 'Monday' },
        { _id: 2, name: 'Tuesday' },
        { _id: 3, name: 'Wednesday' },
        { _id: 4, name: 'Thursday' },
        { _id: 5, name: 'Friday' },
        { _id: 6, name: 'Saturday' }
    ];
    meetingProjectUsers: any[];
    meetingRigUsers: any[];
    fullTimeFormat: any;
    durationOptiondata = [
        { _id: 15, name: '15 mins' },
        { _id: 30, name: '30 mins' },
        { _id: 45, name: '45 mins' },
        { _id: 60, name: '60 mins' },
        { _id: 90, name: '90 mins(1.5 hr)' },
        { _id: 120, name: '120 mins(2 hrs)' },
        { _id: 150, name: '150 mins(2.5 hrs)' },
        { _id: 180, name: '180 mins(3 hrs)' },
        { _id: 240, name: '240 mins(4 hrs)' },
        { _id: 300, name: '300 mins(5 hrs)' },
        { _id: 360, name: '360 mins(6 hrs)' },
        { _id: 420, name: '420 mins(7 hrs)' },
        { _id: 480, name: '480 mins(8 hrs)' }
    ];
    utcOptions = [];
    time: any;
    meetingDate = true;

    constructor(
        private commonService: CommonService,
        private meetService: MeetingService,
        private modalService: NgbModal,
        private modalConfig: NgbModalConfig,
        private formService: FormService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectService: ProjectService,
        private wellService: ProjectWellService,
        private cd: ChangeDetectorRef,
        private config: NgbDatepickerConfig
    ) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
        config.minDate = {year: this.newDate.getFullYear(), month: this.newDate.getMonth() + 1, day: this.newDate.getDate()};
        config.maxDate = {year: 2099, month: 12, day: 31};
        config.outsideDays = 'hidden';
    }

    ngOnInit() {
        const comId: any = localStorage.getItem('companyId');
        // tslint:disable-next-line: radix
        // console.log('CompanyId', comId, parseInt(comId));
        this.meetService.getlicenceData(comId).subscribe(response => {
            console.log('license-history', response);
        });
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
        this.meetService.getUtcOptions().subscribe(utcData => {
            console.log('UTC-options', utcData.data.timezones);
            const timezone = utcData.data.timezones;
            this.utcOptions = timezone;
        });
        this.commonService.getUserTypeData().subscribe();
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
                dataTablesParameters['filter'][0] = {
                    column: 'active',
                    data: this.statusFilter
                };
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'][1] = {
                    column: 'status',
                    data: this.blockFilter
                };
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'][2] = {column: 'well', data: this.rigFilter ? this.rigFilter : ''};
                console.log('data+++', dataTablesParameters);
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
                { data: 'type' },
                { data: 'startDate' },
                { data: 'duration' },
                { data: 'active' },
                { data: 'createdAt' },
                // { data: 'status' },
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
                    targets: [-7]
                },
                {
                    searchable: false,
                    targets: [-8]
                }

            ],
            order: [
                [7, 'desc']
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
            desc: ['',
                [
                    Validators.required,
                    Validators.minLength(this.validator.notes.min),
                    Validators.maxLength(this.validator.notes.max)
                ]
            ],
            startTime: [
                '',
                [
                    Validators.required
                ]
            ],
            duration: [ '', [Validators.required]],
            timezone: ['', [ Validators.required]],
            project: ['', [Validators.required]],
            well: ['', [Validators.required]],
            attenders: [[]],
            projectUsers: [[]],
            active: ['', [Validators.required]]
        });
        // const data = this.commonService.getRequestFormData().subscribe();
        // this.countryList = this.commonService.getCountryList();
        // this.packageList = this.commonService.getPackageList();
    }

    checkMeetingDate(data: string) {
        console.log('checkMeet', data);
        const cDate = Date.parse(data);
        const expireDate =  Date.now() < cDate;
        return expireDate;
    }

    editDetail(createModal, data) {
        this.selecttime = true;
        this.selectdate = false;
        this.selectday = false;
        this.meetService.getData(data).subscribe(response => {
            console.log('Edit', response);
            this.requestDetail = response.data;
            const event = {
                project: this.requestDetail.project._id,
                _id: this.requestDetail.well._id
            };
            this.rigOnchange(event);
            this.meetingTypeOnchange({id: this.requestDetail.type});
            this.editForm.reset();
            this.minDate = null;
            this.time = '';
            this.editing = true;
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.f.project.setValidators(null);
            this.f.well.setValidators(null);
            // this.projectOnchange('edit', this.requestDetail.project._id);
            this.editForm.patchValue({
                data: this.requestDetail._id,
                title: this.requestDetail.title,
                type: this.requestDetail.type,
                startTime: this.requestDetail.startTime,
                startDate: this.requestDetail.startDate,
                duration: this.requestDetail.duration,
                timezone: this.requestDetail.timezone._id,
                active: this.requestDetail.active,
                desc: this.requestDetail.desc,
                project: this.requestDetail.project._id,
                well: this.requestDetail.well._id,
                day: this.requestDetail.day
            });
            // tslint:disable-next-line: triple-equals
            if (this.requestDetail.type == 1 || this.requestDetail.type == 4) {
                const editDate = new Date(this.requestDetail.startDate);
                this.minDate = {
                    year: editDate.getFullYear(),
                    month: editDate.getMonth() + 1,
                    day: editDate.getDate()
                };
            } else {
                this.editForm.patchValue({
                    startDate: null
                });
            }
            this.modalService.open(createModal, {
                size: 'lg'
            });
            const splitedT = this.requestDetail.startTime.substr(0, this.requestDetail.startTime.indexOf('.'));
            this.time = splitedT;
            console.log('minDate', this.requestDetail.startTime.substr(0, this.requestDetail.startTime.indexOf('.')));

        },
        error => {
            // this.noti
        }
        );
    }

    meetingTypeOnchange(event) {
        console.log('meetingType', event);
        switch (event.id) {
            case 1:
                this.selectdate = true;
                this.selecttime = false;
                this.selectday = false; // if condtion
                this.editForm.removeControl('day');
                this.editForm.addControl('startDate', new FormControl(null, Validators.required));
                break;
            case 2:
                this.selectdate = false;
                this.selecttime = false;
                this.selectday = false; // if condtion
                this.editForm.removeControl('day');
                this.editForm.removeControl('startDate');
                break;
            case 3:
                this.selectdate = false;
                this.selecttime = false;
                this.selectday = true; // if condtion
                this.editForm.addControl('day', new FormControl(null, Validators.required));
                this.editForm.removeControl('startDate');
                break;
            case 4:
                this.selectdate = true;
                this.selecttime = false;
                this.selectday = false; // if condtion
                this.editForm.removeControl('day');
                this.editForm.addControl('startDate', new FormControl(null, Validators.required));
                break;
        }
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
            console.log('meetinguser', response.data);
            const meetingProjectUsers = response.data.currentProject;
            const meetingRigUsers = response.data.currentRig;
            const otherrig = meetingProjectUsers.map(v => ({...v, type: 'otherrig'}));
            const currentrig = meetingRigUsers.map(v => ({...v, type: 'currentrig'}));
            this.meetingProjectUsers = [...otherrig, ...currentrig];
            if (this.editing) {
                if (this.meetingProjectUsers.length !== 0) {
                    const result = this.filterUser(this.meetingProjectUsers);
                    this.f.projectUsers.setValue(result);
                }
                // if (this.meetingRigUsers.length !== 0) {
                //     const result2 = this.filterUser(this.meetingRigUsers);
                //     this.f.rigUsers.setValue(result2);
                // }
            }
        });
    }

    filterUser(peoples) {
        console.log('this.people', peoples);
        console.log('this.requestDetail.attenders', this.requestDetail.attenders);
        const userId = [];
        for (const i in this.requestDetail.attenders) {
            const filter = peoples.filter(a => a._id === this.requestDetail.attenders[i]._id);
            // tslint:disable-next-line: forin
            for (const f in filter) {
                // console.log('filter[f]._id', filter[f]._id);
                userId.push(filter[f]._id);
            }
        }
        return userId;
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

    timeInput(event) {
        console.log('eventt', event);
        let time: any;
        if (event) {
            const currenttime = event;
            const currentHour = (currenttime.hour < 9) ? `${0}` + currenttime.hour : currenttime.hour;
            const currentTime = (currenttime.minute < 9) ? `${0}` + currenttime.minute : currenttime.minute;
            const fullTime  = (currentHour + ':' + currentTime).toString();
            console.log('fullTime', fullTime);
            this.fullTimeFormat = fullTime;
            const newDate = new Date();
            const month = 1;
            if (this.f.startDate) {
                // tslint:disable-next-line: max-line-length
                time = `${this.f.startDate.value.year}-${this.f.startDate.value.month}-${this.f.startDate.value.day}` + ' ' + this.fullTimeFormat;
                console.log('TimeWithSelectedDate', time);
            } else {
                // tslint:disable-next-line: max-line-length
                time = `${newDate.getFullYear()}-${newDate.getMonth() + month}-${newDate.getDate() + month}` + ' ' + this.fullTimeFormat;
                console.log('TimeWithoutSelectedDate', time);
            }
            this.time = time;
        }
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
                    this.dateFormet =   'dd, h:mm a';
                    break;
            }
            this.modalService.open(detailModal, {
                size: 'lg'
            });
        });
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

    updateRequest() {
        // this.formService.clearCustomError(this.editForm);
        this.submitted = true;
        this.editForm.markAllAsTouched();
        const currentData = this.editForm.getRawValue();
        console.log('currentData', currentData);
        // tslint:disable-next-line: max-line-length
        currentData.attenders = currentData.projectUsers ? currentData.projectUsers : [];
        if (currentData.attenders.length === 0) {
            // this.f.rigUsers.setValidators(Validators.required);
            this.f.projectUsers.setValidators(Validators.required);
        } else {
            // this.f.rigUsers.setValidators(null);
            this.f.projectUsers.setValidators(null);
        }
        let meetingDate: any;
        if (currentData.startDate) {
            if (this.fullTimeFormat) {
                // tslint:disable-next-line: max-line-length
                meetingDate = `${currentData.startDate.year}-${currentData.startDate.month}-${currentData.startDate.day}` + ' ' + this.fullTimeFormat;
            } else if (this.time) {
                const oldTime = new Date(this.time);
                // tslint:disable-next-line: max-line-length
                meetingDate = `${currentData.startDate.year}-${currentData.startDate.month}-${currentData.startDate.day}` + ' ' +  `${oldTime.getHours()}:${oldTime.getMinutes()}`;
            }
            this.editForm.addControl('day', new FormControl(null));
            console.log('meetTypeWithDate', meetingDate);
        } else {
            console.log('meetTypeWithoutDate');
            const month = 1;
            const cDate = new Date();
            if (this.fullTimeFormat) {
                // tslint:disable-next-line: max-line-length
                meetingDate = `${cDate.getFullYear()}-${cDate.getMonth() + month}-${cDate.getDate()}` + ' ' + this.fullTimeFormat;
            } else if (this.time) {
                const oldTime = new Date(this.time);
                // tslint:disable-next-line: max-line-length
                meetingDate = `${cDate.getFullYear()}-${cDate.getMonth() + month}-${cDate.getDate()}` + ' ' +  `${oldTime.getHours()}:${oldTime.getMinutes()}`;
            }
            console.log('Date', meetingDate);
            this.editForm.addControl('day', new FormControl(null));
            this.editForm.addControl('startDate', new FormControl(null));
        }
        const params = {
            data: currentData.data,
            title: currentData.title,
            type: currentData.type,
            startTime: meetingDate,
            startDate: meetingDate,
            duration: currentData.duration,
            timezone: currentData.timezone,
            active: currentData.active,
            desc: currentData.desc,
            project: currentData.project,
            well: currentData.well,
            users: currentData.attenders,
            day: currentData.day
        };
        console.log('params', params);
        console.log('form', this.editForm.getRawValue());
        if (this.editForm.invalid) {
            this.submitted = false;
            console.log('Invalid');
            return false;
        }

        if ( this.editing ) {
            this.meetService
                .updateData(params)
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
            // console.log(params);
            this.meetService
            .create(params)
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

    CancelConfirmation(id, active, type) {
        let params: any;
        // tslint:disable-next-line: triple-equals
        if (active == 0) {
            params = {
                data : id,
                status : 1
            };
        } else {
            params = {
                data : id,
                status : 0
            };
        }
        console.log(params);
        const modalRef = this.modalService.open(CancelModalComponent);
        modalRef.componentInstance.data = params;
        modalRef.componentInstance.type = type;
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
        console.log(data);
        this.meetService.updateStatus(data).subscribe(
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
        this.selecttime = true;
        this.selectdate = false;
        this.selectday = false;
        this.f.data.setValidators(null);
        this.f.active.setValidators(null);
        this.f.data.updateValueAndValidity();
        this.requestDetail = {
            title: '',
        };
        this.editing = false;
        this.editForm.reset();
        this.minDate = null;
        this.time = '';
        this.meetingProjectUsers = [];
        this.modalService.open(createModal, {
            size: 'lg'
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
