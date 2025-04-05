import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProductInventory } from 'src/app/core/models/catalogs/productInventory.model';
import { InputService } from 'src/app/core/services/catalogs/input.service';
import { ProductInventoryService } from 'src/app/core/services/catalogs/productInventory.service';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.css']
})
export class InputModalComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'ENTRADA';
  status: string = 'Nuevo';
  edit: boolean = false;
  editDate?: Date;
  maxDate: Date = new Date();
  productInventory?: IProductInventory;
  idInven?: number;
  depa?: string;
  proInId?: number;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productService: ProductsService,
    private productInventoryService: ProductInventoryService,
    private inputService: InputService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  async prepareForm() {
    this.form = this.fb.group({
      cantidad: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      descripcion: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fecha: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      //productoInventarioId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
    });
    const date = new Date();
    this.form.controls['fecha'].setValue(date);
    this.form.controls['fecha'].disable();
    if (this.productInventory != null) {
      //this.edit = true;
      this.proInId = this.productInventory.id;
      let product = this.productInventory.productoId;
      let descPrduct: any = await this.getProduct(Number(product));
      console.log(descPrduct[0].nombre);
      this.form.controls['descripcion'].setValue(descPrduct[0].nombre);
      this.form.controls['descripcion'].disable();
    }
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let body = {
      cantidad: Number(this.form.controls['cantidad'].getRawValue()),
      descripcion: this.form.controls['descripcion'].getRawValue(),
      fecha: this.form.controls['fecha'].getRawValue(),
      productoInventarioId: Number(this.proInId),
    }
    const stock = Number(this.productInventory?.stock) + Number(this.form.controls['cantidad'].getRawValue());
    const input = Number(this.productInventory?.entrada) + Number(this.form.controls['cantidad'].getRawValue());

    this.inputService.create(body).subscribe({
      next: resp => {
        let body1 = {
          entrada: input,
          stock: stock
        }
        this.productInventoryService
          .update(Number(this.proInId), body1)
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
      }, error: err => {
        this.loading = false
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
    if (this.productInventory) {
      this.loading = true;
      let body = {
        salida: Number(this.form.controls['salida'].getRawValue()),
        stock: Number(this.form.controls['stock'].getRawValue()),
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

  onChangeAccomodation(event: any) {
    console.log(event);
  }

  validateDate(event: any) {
    if (event) {
      this.editDate = event;
    }
  }

  async getProduct(idProduct: number) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${idProduct}`;
    return new Promise((resolve, reject) => {
      this.productService.getAll(params).subscribe({
        next: response => {
          const data = response.data;
          resolve(data);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  onChangeProducts(event: any) {
    console.log(event);
  }


  onChangeCant(event: any) {

  }

}
