import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebComponent } from './layouts/web/web.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { PageScrollModule } from './modules/page-scroll/page-scroll.module';
import { NotificationDropdownComponent } from './components/notification-dropdown/notification-dropdown.component';
import { NotificationToggleDirective } from './directives/notification-toggle.directive';
import { ProfileDropdownComponent } from './components/profile-dropdown/profile-dropdown.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { GuestComponent } from './layouts/guest/guest.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LogoutComponent } from './components/modals/logout/logout.component';
import { NotyfToast } from './components/utils/notyf/notyf.component';
import { PasswordFieldComponent } from './components/utils/password-field/password-field.component';
import { ErrorLabelComponent } from './components/utils/error-label/error-label.component';
import { SubmitButtonComponent } from './components/utils/submit-button/submit-button.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { DeleteModalComponent } from './components/modals/delete-modal/delete-modal.component';
import { CancelModalComponent } from './components/modals/cancel-modal/cancel-modal';
import { PopoverOptionComponent } from './components/utils/popover-option/popover-option.component';
import { BreadcrumbComponent } from './components/utils/breadcrumb/breadcrumb.component';
import { FilterPipe } from './pipes/filter.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { MeetingPipe } from './pipes/meeting.pipe';
import { MinuteSecondsPipe } from './pipes/dateformat.pipe';
import { BaseURLPipe } from './pipes/baseurl.pipe';

const COMPONENTS = [
    WebComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    SideMenuComponent,
    NotificationDropdownComponent,
    NotificationToggleDirective,
    ProfileDropdownComponent,
    MenuItemComponent,
    GuestComponent,
    ErrorLabelComponent,
    SubmitButtonComponent,
    DeleteModalComponent,
    CancelModalComponent,
    PopoverOptionComponent,
    BreadcrumbComponent
];

const DIRECTIVE = [
    DigitOnlyDirective
];

const BASE_MODULES = [
    CommonModule,
    PageScrollModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule,
    NgbModule,
    RouterModule
];

const PIPES = [
    CapitalizePipe,
    FilterPipe,
    DurationPipe,
    MeetingPipe,
    MinuteSecondsPipe,
    BaseURLPipe
];

const ENTRY_COMPONENTS = [
    NotyfToast,
    DeleteModalComponent,
    CancelModalComponent
];

@NgModule({
    exports: [...BASE_MODULES, ...COMPONENTS, ...DIRECTIVE, ...PIPES],
    declarations: [...COMPONENTS, ...DIRECTIVE, ...PIPES, LogoutComponent, NotyfToast, PasswordFieldComponent, DataTableComponent, ],
    imports: [...BASE_MODULES],
    entryComponents: [ ...ENTRY_COMPONENTS ]

})
export class ThemeModule { }
