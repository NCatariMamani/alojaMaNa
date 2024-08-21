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
    CurrencyComponent
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
    CurrencyComponent
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