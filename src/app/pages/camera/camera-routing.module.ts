import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../@core/guards/auth.guard';
import { AuthRedirect } from '../../@core/guards/auth-redirect.guard';
import { CameraComponent } from './camera.component';
import { ListComponent } from './list/list.component';
import { CameraDetailComponent } from './camera-detail/camera-detail.component';

const routes: Routes = [
    {
        path: '',
        component: CameraComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list/:proId/:rigId',
                component: ListComponent
            },
            {
                path: 'list/:data',
                component: ListComponent
            },
            {
                path: 'details/:data',
                component: CameraDetailComponent
            }
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CameraRoutingModule {
}
