import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { IProductInventory } from 'src/app/core/models/catalogs/productInventory.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { ProductInventoryService } from 'src/app/core/services/catalogs/productInventory.service';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-productInventory-detail',
  templateUrl: './productInventory-detail.component.html',
  styleUrls: ['./productInventory-detail.component.css']
})
export class ProductInventoryDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'PRODUCTO INVENTARIO';
  status: string = 'Nuevo';
  edit: boolean = false;
  editDate?: Date;
  maxDate: Date = new Date();
  productInventory?: IProductInventory;
  idInven?: number;
  result: any;
  depa?: string;
  productoInven: any;
  prodId?: number;

  accomodations = new DefaultSelect();
  products = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private productService: ProductsService,
    private datePipe: DatePipe,
    private productInventoryService: ProductInventoryService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private async prepareForm() {
    this.form = this.fb.group({
      cantidad: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      entrada: [0, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      salida: [0, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      stock: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      fecha: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      productoId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      //alojamientoId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
    });
    this.form.controls['fecha'].disable();
    this.form.controls['entrada'].disable();
    this.form.controls['salida'].disable();
    this.form.controls['stock'].disable();
    if (this.productInventory != null) {
      this.edit = true;
      const formattedDate = this.datePipe.transform(this.productInventory.fecha, 'dd/MM/yyyy');
      console.log(formattedDate);
      this.form.patchValue(this.productInventory);
      this.form.controls['fecha'].setValue(formattedDate);
    } else {
      const date = new Date();
      this.form.controls['fecha'].setValue(date);
    }
    if (this.idInven) {
      let prodInven: any = await this.producInven(this.idInven);
      this.productoInven = prodInven.data
      console.log(prodInven.data);
    }

    setTimeout(() => {
      this.getAccomodation(new ListParams());
      this.getProducts(new ListParams());
    }, 1000);
    console.log(this.idInven);
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    if (this.existeProductoId(this.productoInven, Number(this.prodId))) {
      this.alert('warning', 'Este producto ya esta inventariado', ``);
    } else {
      let body = {
        cantidad: Number(this.form.controls['cantidad'].getRawValue()),
        entrada: Number(this.form.controls['entrada'].getRawValue()),
        salida: Number(this.form.controls['salida'].getRawValue()),
        stock: Number(this.form.controls['stock'].getRawValue()),
        fecha: this.form.controls['fecha'].getRawValue(),
        productoId: Number(this.form.controls['productoId'].getRawValue()),
        inventarioId: this.idInven,
      }
      this.productInventoryService.create(body).subscribe({
        next: resp => {
          let body1 = {
            estado: 'R'
          };
          this.productService.update(Number(this.form.controls['productoId'].getRawValue()), body1)
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
          /*this.handleSuccess(),
          this.loading = false*/
        }, error: err => {
          this.loading = false
        }
      }
      );
    }

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
    if (this.productInventory) {
      this.loading = true;
      let setDate;
      let body = {
        cantidad: Number(this.form.controls['cantidad'].getRawValue()),
        entrada: Number(this.form.controls['entrada'].getRawValue()),
        salida: Number(this.form.controls['salida'].getRawValue()),
        stock: Number(this.form.controls['stock'].getRawValue()),
        fecha: this.editDate,
        productoId: Number(this.form.controls['productoId'].getRawValue()),
        inventarioId: this.idInven
      }
      this.productInventoryService
        .update(this.productInventory.id, body)
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

  getAccomodation(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.accomodationService.getAll(params).subscribe({
      next: data => {
        this.accomodations = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.accomodations = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeAccomodation(event: any) {
    console.log(event);
  }


  validateDate(event: any) {
    if (event) {
      this.editDate = event;
    }
  }

  getProducts(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    //params['filter.estado'] = `$ilike:SR`;
    if (this.depa) {
      params['filter.departamento'] = `$ilike:${this.depa}`;
    }
    this.productService.getAll(params).subscribe({
      next: data => {
        this.result = data.data.map(async (item: any) => {
          item['name'] = item.nombre + ' - ' + item.precio;
        });
        this.products = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.products = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeProducts(event: any) {
    this.prodId = event.id
    if (event && this.productoInven) {
      if (this.existeProductoId(this.productoInven, event.id)) {
        this.alert('warning', 'Este producto ya esta inventariado', ``);
      }
    }
  }

  existeProductoId(data: any, idBuscado: number): boolean {
    return data.some((item: any) => item.productoId === idBuscado);
  }


  onChangeCant(event: any) {
    if (event) {
      const inputElement = event.target as HTMLInputElement;
      const valor = Number(inputElement.value);
      console.log(valor);
      this.form.controls['entrada'].setValue(0);
      this.form.controls['stock'].setValue(valor);
    }
  }

  async producInven(inventarioId: number) {
    const params = new ListParams();
    params['filter.inventarioId'] = `$eq:${inventarioId}`;
    return new Promise((resolve, reject) => {
      this.productInventoryService.getAll(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }




}
