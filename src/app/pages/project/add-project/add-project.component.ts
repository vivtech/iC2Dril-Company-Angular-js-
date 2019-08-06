import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProjectService } from "src/app/@core/services/project-service";

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

    constructor(private fb: FormBuilder, private service: ProjectService) {}

    ngOnInit() {
        this.addproductForm = this.fb.group({
            name: ["", Validators.required],
            address: ["", Validators.required],
            city: ["", Validators.required],
            state: ["", Validators.required],
            country: [""],
            client_name: ["", Validators.required],
            client_email: ["", Validators.required],
            client_phone: ["", Validators.required],
            status: [""]
        });
        this.service.getUserType().subscribe(res => {
            console.log("getUserType", res);
            this.UserType = res.data;
            // for(var i in res.data) {
            //   if(res.data[i].webLogin == 1) {
            //     console.log('web user', res.data[i].name)
            //   }
            //   else {
            //     console.log('Mob user', res.data[i].name)
            //   }
            // }
        });
    }

    submit(value) {
        this.disable = false;
        console.log("value", value);
    }
}
