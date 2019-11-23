import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradePackageComponent } from './upgrade-package/upgrade-package.component';
import { UpgradeRoutes } from './upgrade.routing';
import { UpgradeComponent } from './upgrade.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [UpgradeComponent, UpgradePackageComponent],
  imports: [
    CommonModule,
    UpgradeRoutes,
    ReactiveFormsModule,
    ThemeModule
  ]
})
export class UpgradeModule { }
