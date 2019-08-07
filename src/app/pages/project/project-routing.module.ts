import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProjectComponent } from './project.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { WellComponent } from './well/well.component';
import { CameraComponent } from './camera/camera.component';
import { AddProjectComponent } from './add-project/add-project.component';

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
                path: 'well/:data',
                component: CameraComponent
                // canActivate: [CompanyGuard]
            },
            {
                path: ':data',
                component: WellComponent
                // canActivate: [CompanyGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule {}
