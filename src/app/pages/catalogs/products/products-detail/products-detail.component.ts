import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProducts } from 'src/app/core/models/catalogs/products.model';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { BasePage } from 'src/app/core/shared';
import { DOUBLE_POSITIVE_PATTERN, NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.css']
})
export class ProductsDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'PRODUCTO';
  status: string = 'Nuevo';
  edit: boolean = false;
  products?: IProducts;
  editDate?: Date;
  maxDate: Date = new Date();
  monto?: number;
  currencyFormat?: string = '';
  precio: number = 0;

  accomodations = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {
    super();
  }

  get estate() {
    return this.form.get('estado') as FormControl;
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      precio: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      departamento: [null, [Validators.required]],
      estado: [null, [Validators.required]]
    });
    if (this.products != null) {
      this.edit = true;
      this.form.controls['estado'].disable();
      this.form.patchValue(this.products);
    }else {
      this.estate.setValue('SR');
      this.form.controls['estado'].disable()
    }

  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let body = {
      nombre: this.form.controls['nombre'].getRawValue(),
      precio: this.form.controls['precio'].getRawValue(),
      estado: this.form.controls['estado'].getRawValue(),
      departamento: this.form.controls['departamento'].getRawValue()
    }
    this.productsService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
          this.loading = false
      }, error: err => {
        this.loading = false;
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      }
    }
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    if (this.products) {
      this.loading = true;
      let body = {
        nombre: this.form.controls['nombre'].getRawValue(),
        precio: this.form.controls['precio'].getRawValue(),
        estado: this.form.controls['estado'].getRawValue(),
        departamento: this.form.controls['departamento'].getRawValue()
      }
      this.productsService
        .update(this.products.id, body)
        .subscribe({
          next: response => {
            this.loading = false;
            this.handleSuccess()
          },
          error: error => {
            this.loading = false;
            if (error.status == 403) {
              this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
            } else {
              //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
            }
          }
        }

        );
    }
  }

  close() {
    this.modalRef.hide();
  }

  onMontoChange(event: string): void {
    // Eliminar cualquier carácter no numérico o de punto decimal
    if (event) {
      const numericValue = parseFloat(event.replace(/[^0-9.]/g, ''));
      this.monto = isNaN(numericValue) ? 0 : numericValue;
    }
  }

  updateCurrency(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const valor = Number(inputElement.value);
    console.log(valor, event.data);
    this.form.controls['precio'].setValue(this.formatToBolivianCurrency(valor));
  }
  formatToBolivianCurrency(value?: number): string | null {
    return this.currencyPipe.transform(value, 'Bs ', 'symbol', '1.2-2');
  }

  showHistory(event: any) {
    console.log(event);
  }

}
