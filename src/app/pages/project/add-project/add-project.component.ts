import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProjectService } from "src/app/@core/services/project.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
    selector: "app-add-project",
    templateUrl: "./add-project.component.html",
    styleUrls: ["./add-project.component.css"]
})
export class AddProjectComponent implements OnInit {
    title = "Create Project";
    addproductForm: FormGroup;
    disable: boolean = true;
    UserType: any;
    webUser: any;
    mobileUser: any;
    validator = environment.validators;

    constructor(private fb: FormBuilder, 
      private service: ProjectService,
      private toastr: ToastrService) {}

    ngOnInit() {
        this.addproductForm = this.fb.group({
            name: ["", Validators.required],
            address: ["", Validators.required],
            city: ["", Validators.required],
            state: ["", Validators.required],
            country: [""],
            client_name: ["", Validators.required],
            client_email: ["", Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
            client_phone: ["", Validators.required],
            status: [""]
        });
        // this.service.getUserType().subscribe(res => {
        //     console.log("getUserType", res);
        //     this.UserType = res.data;
        //     // for(var i in res.data) {
        //     //   if(res.data[i].webLogin == 1) {
        //     //     console.log('web user', res.data[i].name)
        //     //   }
        //     //   else {
        //     //     console.log('Mob user', res.data[i].name)
        //     //   }
        //     // }
        // });
    }

    submit(value) {
        this.disable = false;
        var params = {
            'name': value.name,
            'address': value.address,
            'city': value.city,
            'state': value.state,
            'status': value.status,
            'country': value.country,
            'clientName': value.client_name,
            'clientEmail': value.client_email,
            'clientPhone': value.client_phone
        }
        console.log("value", value);
        this.service.create(params).subscribe(res => {
          console.log('Project create response', res)
          this.toastr.error('', res.message);
          this.addproductForm.reset();
        })
    }
}
