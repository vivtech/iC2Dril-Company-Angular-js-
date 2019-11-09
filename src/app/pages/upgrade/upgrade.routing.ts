import { Routes, RouterModule } from '@angular/router';
import { UpgradePackageComponent } from './upgrade-package/upgrade-package.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpgradeComponent } from './upgrade.component';

const routes: Routes = [
    {
        path: '',
        component: UpgradeComponent,
        children: [
            {
                path: 'package',
                component: UpgradePackageComponent
            },
            {
                path: 'adduser',
                component: AddUserComponent
            },
            {
                path: '',
                redirectTo: 'package'
            }
        ]
    }
];

export const UpgradeRoutes = RouterModule.forChild(routes);
