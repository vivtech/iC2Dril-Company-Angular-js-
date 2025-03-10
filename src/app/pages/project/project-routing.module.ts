import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProjectComponent } from './project.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { TokenGuard } from '../../@core/guards/token.guard';
// import { CameraGuard } from '../../@core/guards/camera.guard';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ListComponent } from '../camera/list/list.component';
import { RigListComponent } from '../rig-location/list/list.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectComponent,
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'create',
                component: AddProjectComponent
            },
            {
                path: 'list',
                component: ListProjectComponent
            },
            {
                path: 'details/:data',
                component: ProjectDetailComponent
            },
            {
                path: 'riglocation/list/:data',
                component: RigListComponent
            },
            {
                path: 'camera/list/:data',
                component: ListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule {}
