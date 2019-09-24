import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { RigListComponent } from './list/list.component';
import { RigRoutingModule } from './rig-routing.module';
import { RigComponent } from './rig.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RigDetailComponent } from './rig-detail/rig-detail.component';
import { CameraModule } from '../camera/camera.module';

const COMPONENTS = [
    RigComponent,
    RigListComponent,
];

@NgModule({
  imports: [ThemeModule, RigRoutingModule, CameraModule, PerfectScrollbarModule, NgxDaterangepickerMd.forRoot() ],
  declarations: [...COMPONENTS, RigDetailComponent, ],
})
export class RigModule {}
