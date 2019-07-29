import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { LicenseHistoryComponent } from './license-history/license-history.component';

const components = [
    CompanyComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, CompanyRoutingModule ],
  declarations: [...components, LicenseHistoryComponent],
})
export class CompanyModule {}
