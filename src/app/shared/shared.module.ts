import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ColumnsSelectComponent } from './components/columns-select/columns-select.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CardComponent,
    ColumnsSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
  ],
  exports: [
    CardComponent,
    ColumnsSelectComponent
  ]
})
export class SharedModule { }
