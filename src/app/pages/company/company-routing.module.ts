import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CompanyComponent } from './company.component';
import { LicenseHistoryComponent } from './license-history/license-history.component';
import { CompanyGuard } from 'src/app/@core/guards/company.guard';


const routes: Routes = [{
  path: '',
  component: CompanyComponent,
  children: [
    {
      path: 'list',
      component: ListComponent,
    },
    {
        path: 'license-history/:data',
        component: LicenseHistoryComponent,
        canActivate: [CompanyGuard]
      },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule { }
