import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { MeetingRoutingModule } from './meeting-routing.module';
import { MeetingComponent } from './meeting.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { MinuteSecondsPipe } from 'src/app/@theme/pipes/time.pipe';
import { FilterPipe } from 'src/app/@theme/pipes/filter.pipe';

const COMPONENTS = [
    MeetingComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, MeetingRoutingModule, PerfectScrollbarModule, NgxDaterangepickerMd.forRoot() ],
  declarations: [...COMPONENTS, AddMeetingComponent, MinuteSecondsPipe, FilterPipe],
})
export class MeetingModule {}
