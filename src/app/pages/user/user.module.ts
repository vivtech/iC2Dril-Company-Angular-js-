import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { ListComponent } from './list/list.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

const COMPONENTS = [
    UserComponent,
    ListComponent,
];

@NgModule({
  imports: [ThemeModule, UserRoutingModule ],
  declarations: [...COMPONENTS, ],
})
export class UserModule {}
