import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

// import { ListComponent } from './list/list.component';
// import { CompanyRoutingModule } from './company-routing.module';
// import { CompanyComponent } from './company.component';
// import { LicenseHistoryComponent } from './license-history/license-history.component';
import { WellComponent } from './well/well.component';
import { ProjectRoutingModule } from './project-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { CameraComponent } from './camera/camera.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { RigModule } from '../rig-location/rig.module';
import { CameraModule } from '../camera/camera.module';


const COMPONENTS = [
    ProjectComponent,
    AddProjectComponent,
    CameraComponent,
    ListProjectComponent,
    WellComponent,
];

@NgModule({
  imports: [ThemeModule, ProjectRoutingModule, RigModule, CameraModule ],
  declarations: [...COMPONENTS, ProjectDetailComponent],
})
export class ProjectModule {}
