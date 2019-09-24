import { Component, OnInit } from '@angular/core';
import { ProjectCameraService } from 'src/app/@core/services/project-camera.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-camera-detail',
  templateUrl: './camera-detail.component.html',
  styleUrls: ['./camera-detail.component.css']
})
export class CameraDetailComponent implements OnInit {
    title = 'Camera Details';
    name: any;
    project: any;
    rigLocation: any;
    url: any;
    username: any;
    password: any;
    users: any;
    defaultCamera: any;
    showPassword = false;

  constructor(private cameraService: ProjectCameraService,
              private router: ActivatedRoute) { }

  ngOnInit() {
      this.router.params.subscribe(paramData => {
          console.log('params', paramData);
          const camId = paramData.data;
          if (camId) {
              this.cameraService.getData(camId).subscribe(response => {
                  const cameraDetail = response.data;
                  console.log('response', cameraDetail);
                  this.name = cameraDetail.name;
                  this.project = cameraDetail.project.name;
                  this.rigLocation = cameraDetail.well.name;
                  this.url = cameraDetail.url;
                  this.username = cameraDetail.username;
                  this.password = cameraDetail.password;
                  this.defaultCamera = cameraDetail.default;
                  this.users = cameraDetail.users;
              });
          }
      });
  }

}
