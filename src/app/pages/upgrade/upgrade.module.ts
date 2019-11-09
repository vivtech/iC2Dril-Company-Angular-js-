import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradePackageComponent } from './upgrade-package/upgrade-package.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpgradeRoutes } from './upgrade.routing';
import { UpgradeComponent } from './upgrade.component';

@NgModule({
  declarations: [UpgradeComponent, UpgradePackageComponent, AddUserComponent],
  imports: [
    CommonModule,
    UpgradeRoutes
  ]
})
export class UpgradeModule { }
