import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CompanyRequest } from 'src/app/@core/models/company-request.model';
import { first } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from 'src/app/@core/services/form-validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/@core/services/common.service';
import { Country } from 'src/app/@core/models/country.model';
import { Package } from 'src/app/@core/models/package.model';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectCamera } from 'src/app/@core/models/project.model';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/@core/services/project.service';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { UserService } from 'src/app/@core/services/user.service';
import { UserType } from 'src/app/@core/models/user-type.model';
import { User } from 'src/app/@core/models/user.model';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';
import { ProjectWellService } from 'src/app/@core/services/project-well.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;

	userTypeList: UserType[];
	userTypeFilterData: UserType[];
	subscription: Subscription;

	companyList: any[];
	title = 'Users Details';
	dtOptions: DataTables.Settings = {};
	projectFilterData = [];
	projectFilter = '';
	id = [];
	projectOptionData =[];
	rigID: any;
	people = [];
	wellId = '';
    projectId = '';
	selectedPeople = [];
	dataList: ProjectCamera[];
	rigFilter: any;
	wellOptionData = [];
	wellFilterData = [];
	f: any;
	
	constructor(
		private commonService: CommonService,
		private apiService: UserService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private formService: FormService,
		private formBuilder: FormBuilder,
		private activeRoute: ActivatedRoute,
		private projectService: ProjectService,
		private service: UserService,
		private wellService: ProjectWellService,
		private toastr: ToastrService
	) {
		modalConfig.backdrop = 'static';
		modalConfig.keyboard = false;
	}

	ngOnInit() {
		//const that = this;
		// this.subscription = this.commonService
		// 	.getUserTypeList()
		// 	.subscribe(data => {
		// 		this.userTypeList = data.slice();
		// 		const temp = new UserType();
		// 		temp.name = 'All';
		// 		temp._id = '';
		// 		data.unshift(temp);
		// 		this.userTypeFilterData = data;
		// 	});
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
			//const that = this;
			this.activeRoute.params.subscribe(param => {
				this.wellId = param.data;
				this.projectId = param.project;
				console.log('project', param.project);
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
                // dataTablesParameters['well'] = this.wellId;
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'] = [];
                // tslint:disable-next-line: no-string-literal
                dataTablesParameters['filter'][0] = { column: 'well', data: this.rigFilter ? this.rigFilter : '' };
                // tslint:disable-next-line: no-string-literal
                //dataTablesParameters['filter'][1] = { column: 'active', data: this.statusFilter };
                // dataTablesParameters['filter'][1] = {column: 'project', data: this.projectId};
                console.log(dataTablesParameters);
                const responseData = this.apiService.projectDetails(dataTablesParameters).pipe(first())
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
	}
	refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
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

}
