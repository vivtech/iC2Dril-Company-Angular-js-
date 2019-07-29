import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { CompanyRequestRoutingModule } from './company-request-routing.module';
import { CompanyRequestComponent } from './company-request.component';
import { CompanyRequestViewModalComponent } from './modal/company-request-view-modal/company-request-view-modal.component';

const components = [
    CompanyRequestComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, CompanyRequestRoutingModule, ],
  declarations: [...components, CompanyRequestViewModalComponent],
})
export class CompanyRequestModule {}
