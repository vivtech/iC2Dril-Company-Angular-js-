import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../@core/guards/auth.guard';
import { AuthRedirect } from '../../@core/guards/auth-redirect.guard';
import { RigComponent } from './rig.component';
import { RigListComponent } from './list/list.component';
import { RigDetailComponent } from './rig-detail/rig-detail.component';

const routes: Routes = [
    {
        path: '',
        component: RigComponent,
        children: [
            {
                path: 'list',
                component: RigListComponent,
            },
            {
                path: 'details/:id',
                component: RigDetailComponent,
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list/:data',
                component: RigListComponent
            }
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RigRoutingModule {
}
