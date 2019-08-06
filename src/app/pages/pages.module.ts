import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CompanyRequestFormComponent } from './company-request-form/company-request-form.component';
import { ProfileComponent } from './profile/profile.component';
import { PackageComponent } from './package/package.component';
import { CountryComponent } from './country/country.component';
import { ProjectComponent } from './project/project.component';
import { ViewProjectComponent } from './project/view-project/view-project.component';
import { AddProjectComponent } from './project/add-project/add-project.component';

import { MatTabsModule } from '@angular/material/tabs';

const COMPONENETS = [PagesComponent,
                    DashboardComponent,
                    NotFoundComponent,
                    LoginComponent,
                    ForgotPasswordComponent,
                    ResetPasswordComponent,
                    CompanyRequestFormComponent,
                    ProfileComponent,
                    PackageComponent,
                    CountryComponent
                ];

@NgModule({
    declarations: [...COMPONENETS, ProjectComponent, ViewProjectComponent, AddProjectComponent],
    imports: [
        PagesRoutingModule,
        ThemeModule,
        MatTabsModule
    ]
})
export class PagesModule { }
