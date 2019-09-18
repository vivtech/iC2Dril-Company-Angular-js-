import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { RigListComponent } from './list/list.component';
import { RigRoutingModule } from './rig-routing.module';
import { RigComponent } from './rig.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AddRigComponent } from './add-rig/add-rig.component';
import { RigDetailComponent } from './rig-detail/rig-detail.component';

const COMPONENTS = [
    RigComponent,
    RigListComponent,
];

@NgModule({
  imports: [ThemeModule, RigRoutingModule, PerfectScrollbarModule, NgxDaterangepickerMd.forRoot() ],
  declarations: [...COMPONENTS, AddRigComponent, RigDetailComponent, ],
})
export class RigModule {}
