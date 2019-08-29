import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { MeetingRoutingModule } from './meeting-routing.module';
import { MeetingComponent } from './meeting.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const COMPONENTS = [
    MeetingComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, MeetingRoutingModule, PerfectScrollbarModule ],
  declarations: [...COMPONENTS, ],
})
export class MeetingModule {}
