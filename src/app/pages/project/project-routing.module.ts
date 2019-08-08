import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProjectComponent } from './project.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { WellComponent } from './well/well.component';
import { CameraComponent } from './camera/camera.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { TokenGuard } from '../../@core/guards/token.guard';
// import { CameraGuard } from '../../@core/guards/camera.guard';

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
                path: 'location/:project/:data',
                component: CameraComponent,
                canActivate: [TokenGuard],
                data: {guard: 'well'}
            },
            {
                path: ':data',
                component: WellComponent,
                canActivate: [TokenGuard],
                data: {guard: 'project'}
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule {}
