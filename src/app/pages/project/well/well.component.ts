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
import { ProjectWellService } from 'src/app/@core/services/project-well.service';
import { ProjectWell } from 'src/app/@core/models/project.model';
import { Router, ActivatedRoute }  from '@angular/router';

@Component({
    selector: 'app-well',
    templateUrl: './well.component.html',
    styleUrls: ['./well.component.css']
  })
export class WellComponent implements OnInit {

    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;

    statusFilterData = [{id: '', name: 'All'}, {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusData = [ {id: 1, name: 'Active'}, {id: 0, name: 'Inactive'}];
    statusFilter = '';
    editing = false;

    title = 'Well List';
    dtOptions: DataTables.Settings = {};
    requestDetail: ProjectWell;
    editForm: FormGroup;
    licenseForm: FormGroup;
    validator = environment.validators;
    dataList: ProjectWell[];
    //dataList: Observable<Package[]>;
    submitted = false;
    today = new Date();
    minDate = {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};
    projectId: any;

    constructor(private commonService: CommonService,
                private projectWellService: ProjectWellService,
                private modalService: NgbModal,
                private modalConfig: NgbModalConfig,
                private formService: FormService,
                private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private route: ActivatedRoute) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log('route', params);
            this.projectId = params.data;
        })
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
              dataTablesParameters['filter'] = [];
              dataTablesParameters['project'] = this.projectId;
              dataTablesParameters['filter'][0] = {column: 'active', data: this.statusFilter};
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
                    { data: 'active' }, { data: '_id' }],
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

        this.editForm = this.formBuilder.group({
            data: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.minLength(this.validator.name.min),
                Validators.maxLength(this.validator.name.max)]],
            active: ['', [Validators.required]]
        });


    }


    get f() { return this.editForm.controls; }

    editDetail(editModal, data) {

        this.projectWellService.getData(data).subscribe(response => {
            console.log(response);
            this.requestDetail = response.data;
            this.editForm.reset();
            this.editing = true;
            this.f.data.setValidators([Validators.required]);
            this.f.data.updateValueAndValidity();
            this.editForm.patchValue({
               data: this.requestDetail._id,
               name: this.requestDetail.name,
               active: this.requestDetail.active
            });
            this.modalService.open(editModal);
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
            console.log('this.editForm-not valid')
            this.submitted = false;
            return false;
        }

        if (this.editing) {
            var value = this.editForm.getRawValue();
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
            var value = this.editForm.getRawValue();
            console.log('this.editForm', this.editForm.getRawValue());
            // var params = {
            //     'active': value.active,
            //     'data': value.data,
            //     'name': value.name
            // }
            this.projectWellService.create(value)
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
        // this.f.data.setValidators(null);
        // this.f.data.updateValueAndValidity();
        this.requestDetail = {
            name: '',
            active: 1
        };
        this.editing = false;
        this.editForm.reset();
        this.f.data.setValue(this.projectId);
        this.modalService.open(modal);
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

    view(id) {
         this.router.navigate(['project/well/'+ id]);
    }

}
