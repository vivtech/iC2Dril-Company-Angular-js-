import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { CameraRoutingModule } from './camera-routing.module';
import { CameraComponent } from './camera.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AddCameraComponent } from './add-camera/add-camera.component';

const COMPONENTS = [
    CameraComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, CameraRoutingModule, PerfectScrollbarModule, NgxDaterangepickerMd.forRoot() ],
  declarations: [...COMPONENTS, AddCameraComponent, ],
})
export class CameraModule {}
