import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectWellService } from 'src/app/@core/services/project-well.service';

@Component({
  selector: 'app-rig-detail',
  templateUrl: './rig-detail.component.html',
  styleUrls: ['./rig-detail.component.css']
})
export class RigDetailComponent implements OnInit {
    title = 'Rig Details';
    name: string;
    fieldName: string;
    country: string;
    project: string;
    rigLocation: string;
    active: string;
    activeData = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }];
    rigId: any;
    projectId: any;
    rigData: any;

  constructor(private acitveRoute: ActivatedRoute,
              private rigService: ProjectWellService,
              private router: Router) { }

  ngOnInit() {
      this.acitveRoute.params.subscribe(data => {
          console.log('routeParams', data.id);
          const rigId: any = data.id;
          this.rigService.getData(rigId).subscribe(response => {
              console.log('rigDetail', response.data);
              this.rigData = response.data;
              const rigDetail: any = response.data.data;
              this.name = rigDetail.name;
              this.fieldName = rigDetail.fieldName;
              this.country = rigDetail.country.name;
              this.project = rigDetail.project.name;
              this.rigLocation = rigDetail.rigLocation;
              const filterStatus = this.activeData.filter(a => a.id === rigDetail.active);
              this.active = filterStatus[0].name;
              this.rigId = rigDetail._id;
              this.projectId = rigDetail.project._id;
          });
      });
  }

  view() {
      this.router.navigate(['camera/list/' + this.projectId + '/' + this.rigId]);
  }

}
