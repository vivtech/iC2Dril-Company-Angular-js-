import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [PaymentComponent, ListComponent],
  imports: [
    CommonModule
  ]
})
export class PaymentModule { }
