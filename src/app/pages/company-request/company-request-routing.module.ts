import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CompanyRequestComponent } from './company-request.component';


const routes: Routes = [{
  path: '',
  component: CompanyRequestComponent,
  children: [
    {
      path: 'list',
      component: ListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestRoutingModule { }
