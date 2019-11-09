import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { ListComponent } from './list/list.component';
import { NotificationRoutes } from './notification.routing';

@NgModule({
  declarations: [NotificationComponent, ListComponent],
  imports: [
    CommonModule,
    NotificationRoutes
  ]
})
export class NotificationModule { }
