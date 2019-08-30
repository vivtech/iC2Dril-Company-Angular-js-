import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { MeetingRoutingModule } from './meeting-routing.module';
import { MeetingComponent } from './meeting.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const COMPONENTS = [
    MeetingComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, MeetingRoutingModule, PerfectScrollbarModule, NgxDaterangepickerMd.forRoot() ],
  declarations: [...COMPONENTS, ],
})
export class MeetingModule {}
