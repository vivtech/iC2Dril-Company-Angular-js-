import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../@core/guards/auth.guard';
import { AuthRedirect } from '../../@core/guards/auth-redirect.guard';
import { MeetingComponent } from './meeting.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        component: MeetingComponent,
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
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MeetingRoutingModule {
}
