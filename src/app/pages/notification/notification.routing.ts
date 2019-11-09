import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { NotificationComponent } from './notification.component';

const routes: Routes = [
    {
        path: '',
        component: NotificationComponent,
        children: [
            {
                path: 'list',
                component: ListComponent
            },
            {
                path: '',
                redirectTo: 'list'
            }
        ]
    }
];

export const NotificationRoutes = RouterModule.forChild(routes);
