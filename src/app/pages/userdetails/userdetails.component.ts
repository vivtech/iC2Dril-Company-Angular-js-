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
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/@theme/components/modals/delete-modal/delete-modal.component';
import { UserService } from 'src/app/@core/services/user.service';
import { UserType } from 'src/app/@core/models/user-type.model';
import { User } from 'src/app/@core/models/user.model';
import { ValidEmail } from 'src/app/@core/validators/valid-email.validators';


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
	
	constructor(
		private commonService: CommonService,
		private apiService: UserService,
		private modalService: NgbModal,
		private modalConfig: NgbModalConfig,
		private formService: FormService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService
	) {
		modalConfig.backdrop = 'static';
		modalConfig.keyboard = false;
	}

	ngOnInit() {
		const that = this;
		this.subscription = this.commonService
			.getUserTypeList()
			.subscribe(data => {
				this.userTypeList = data.slice();
				const temp = new UserType();
				temp.name = 'All';
				temp._id = '';
				data.unshift(temp);
				this.userTypeFilterData = data;
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
				const responseData = this.apiService
					.projectDetails()
					.pipe(first())
					.subscribe(response => {
						if (response.code === 200) {
							this.companyList = response.data.cameradetails;
							callback({
								recordsTotal: response.data.cameradetails.length,
								recordsFiltered: response.data.cameradetails.length,
								data: []
							});
						}
					});
			},
			columns: [
				{ data: 'name' },
				{ data: 'project' },
				{ data: 'users' },				

			]
		};
	}
}
