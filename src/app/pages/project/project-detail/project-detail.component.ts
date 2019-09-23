import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/@core/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
    projectDetail: any;
    title = 'Project details';
    projectId: any;
    projectName: any;
    blockName: any;
    fieldName: any;
    fieldEnv: any;
    wellName: any;
    depth: any;
    depthType: any;
    status: any;
    depthData = [ {name: 'ft'}, {name: 'm'}];
    fieldEnvData = [
        { id: 1, name: 'Onshore' },
        { id: 2, name: 'Swamp' },
        { id: 3, name: 'Offshore' },
        { id: 4, name: 'Deep Water' }];
    statusData = [{ id: 0, name: 'Inprogress' }, { id: 1, name: 'Completed' }];
  constructor(private activeRoute: ActivatedRoute,
              private projectService: ProjectService,
              private router: Router) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(param => {
        console.log('project', param.data);
        const projId = param.data;
        this.projectService.getData(projId).subscribe(response => {
            console.log('projectData', response.data);
            this.projectDetail = response.data;
            const proData = this.projectDetail.data;
            this.projectName = proData.name;
            this.blockName = proData.blockName;
            this.fieldName = proData.fieldName;
            const filterEnv = this.fieldEnvData.filter(a => a.id === proData.fieldEnv);
            const filterStatus = this.statusData.filter(a => a.id === proData.status);
            const depthType = this.depthData.filter(a => a.name === proData.depthType);
            console.log('filterEnv', filterEnv);
            console.log('filterStatus', filterStatus);
            console.log('depthType', depthType);
            this.depth = proData.depth;
            this.wellName = proData.wellName;
            this.fieldEnv = filterEnv[0].name;
            this.depthType = depthType[0].name;
            this.status = filterStatus[0].name;
            this.projectId = proData._id;
        });
    });
  }

  view(data) {
      switch (data) {
        case 'rig' :
            this.router.navigate(['riglocation/list/' + this.projectId]);
            break;
        case 'camera' :
            this.router.navigate(['camera/list/' + this.projectId]);
            break;
      }
  }

}
