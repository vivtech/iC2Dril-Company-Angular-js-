import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { NgModule } from '@angular/core';
import { ListComponent } from '../payment/list/list.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentComponent,
        children: [
            {
                path: 'list',
                component: ListComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PaymentRoutingModule {
}
