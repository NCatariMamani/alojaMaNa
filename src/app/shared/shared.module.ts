import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ColumnsSelectComponent } from './components/columns-select/columns-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginateComponent } from './components/pagination/paginate.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxCurrencyModule } from 'ngx-currency';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { CustomDatepickerEs } from './utils/CustomDatepickerEs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from './components/modal/modal.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';
import { CustomDateFilterComponent } from './utils/custom-date-filter';
import { SelectComponent } from './components/select/select.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { ButtonColumnAddComponent } from './components/button-column/button-column-add.component';
import { ButtonColumnDeleteComponent } from './components/button-column/button-column-delete.component';
import { ButtonColumnComponent } from './components/button-column/button-column.component';
import { ButtonColumnOutputComponent } from './components/button-column/button-column-output.component';
import { ButtonColumnInputComponent } from './components/button-column/button-column-input.component';
import { CheckboxDisabledElementComponent } from './components/checkbox-element-smarttable/checkbox-disabled-element';
import { CheckboxElementRecordAccountStatementsComponent } from './components/checkbox-element-smarttable/checkbox-element-record-account-statements';
import { ButtonColumnPermissionComponent } from './components/button-column/button-column-permission.component';
import { NewButtonComponent } from './components/new-button/new-button.component';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: false,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: true,
};

@NgModule({
  declarations: [
    CardComponent,
    ColumnsSelectComponent,
    PaginationComponent,
    PaginateComponent,
    ModalComponent,
    FormFieldComponent,
    ConfirmButtonComponent,
    CustomDateFilterComponent,
    SelectComponent,
    CurrencyComponent,
    ButtonColumnAddComponent,
    ButtonColumnDeleteComponent,
    ButtonColumnComponent,
    ButtonColumnOutputComponent,
    ButtonColumnInputComponent,
    CheckboxDisabledElementComponent,
    CheckboxElementRecordAccountStatementsComponent,
    ButtonColumnPermissionComponent,
    NewButtonComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    Ng2SmartTableModule,
    PaginationModule,
    NgScrollbarModule,
    BsDatepickerModule.forRoot(),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)

  ],
  exports: [
    CardComponent,
    ColumnsSelectComponent,
    Ng2SmartTableModule,
    PaginationComponent,
    BsDropdownModule,
    NgxCurrencyModule,
    NgScrollbarModule,
    BsDatepickerModule,
    FormsModule,
    NgSelectModule,
    ModalComponent,
    FormFieldComponent,
    ConfirmButtonComponent,
    ReactiveFormsModule,
    SelectComponent,
    CurrencyComponent,
    ButtonColumnAddComponent,
    ButtonColumnDeleteComponent,
    ButtonColumnComponent,
    ButtonColumnOutputComponent,
    ButtonColumnInputComponent,
    CheckboxDisabledElementComponent,
    CheckboxElementRecordAccountStatementsComponent,
    ButtonColumnPermissionComponent,
    NewButtonComponent
  ],
  providers: [{ provide: BsDatepickerConfig, useFactory: getDatepickerConfig }],
})
export class SharedModule {
  constructor(private localeService: BsLocaleService) {
    defineLocale('es', CustomDatepickerEs);
    this.localeService.use('es');
  }
}

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    showWeekNumbers: false,
  });
}