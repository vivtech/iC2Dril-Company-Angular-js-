import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CompanyRequestFormComponent } from './company-request-form/company-request-form.component';
import { AuthGuard } from '../@core/guards/auth.guard';
import { AuthRedirect } from '../@core/guards/auth-redirect.guard';
import { ResetTokenGuard } from '../@core/guards/rest-token-checker.guard';
import { ProfileComponent } from './profile/profile.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { PackageComponent } from './package/package.component';
import { CountryComponent } from './country/country.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthRedirect]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [AuthRedirect]
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent,
        canActivate: [ResetTokenGuard, AuthRedirect]
    },
    {
        path: 'request-form',
        component: CompanyRequestFormComponent
    },
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'company-request',
                loadChildren: './company-request/company-request.module#CompanyRequestModule'   //./pages/pages.module#PagesModule''
            },
            {
                path: 'company',
                loadChildren: './company/company.module#CompanyModule'
            },
            {
                path: 'user',
                loadChildren: './user/user.module#UserModule'
            },
            {
                path: 'meeting',
                loadChildren: './meeting/meeting.module#MeetingModule'
            },
            {
                path: 'project',
                loadChildren: './project/project.module#ProjectModule'
            },
            {
                path: 'riglocation',
                loadChildren: './rig-location/rig.module#RigModule'
            },
            {
                path: 'camera',
                loadChildren: './camera/camera.module#CameraModule'
            },
            {
                path: 'package',
                component:  PackageComponent
            },
            {
                path: 'country',
                component:  CountryComponent
            },
            {
                path: 'upgrade',
                loadChildren: './upgrade/upgrade.module#UpgradeModule'
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'user/details',
                component: UserdetailsComponent
            },
            {
                path: 'account',
                component: AccountComponent
            },
            {
                path: 'notification',
                loadChildren: './notification/notification.module#NotificationModule'
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },

            {
                path: '**',
                redirectTo: 'dashboard',
                //component: DashboardComponent,
            }
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
