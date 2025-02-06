import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProductInventory } from 'src/app/core/models/catalogs/productInventory.model';
import { IProducts } from 'src/app/core/models/catalogs/products.model';
import { OutputService } from 'src/app/core/services/catalogs/output.service';
import { ProductInventoryService } from 'src/app/core/services/catalogs/productInventory.service';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-output-modal',
  templateUrl: './output-modal.component.html',
  styleUrls: ['./output-modal.component.css']
})
export class OutputModalComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'SALIDA';
  status: string = 'Nuevo';
  edit: boolean = false;
  editDate?: Date;
  maxDate: Date = new Date();
  productInventory?: IProductInventory;
  idInven?: number;
  result: any;
  depa?: string;
  proInId?: number;

  accomodations = new DefaultSelect();
  products = new DefaultSelect<IProducts>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productService: ProductsService,
    private productInventoryService: ProductInventoryService,
    private outputService: OutputService
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
      fecha:  [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    const date = new Date();
    this.form.controls['fecha'].setValue(date);
    this.form.controls['fecha'].disable();
    if (this.productInventory != null) {
      //this.edit = true;
      this.proInId = this.productInventory.id;
      let product = this.productInventory.productoId;
      let descPrduct:any = await this.getProduct(Number(product));
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
    let stock: number;
    let output: number;
    if(Number(this.form.controls['cantidad'].getRawValue()) < Number(this.productInventory?.stock)){
      stock = Number(this.productInventory?.stock) - Number(this.form.controls['cantidad'].getRawValue());
      output = Number(this.productInventory?.salida) + Number(this.form.controls['cantidad'].getRawValue());
    } else if(Number(this.form.controls['cantidad'].getRawValue()) === Number(this.productInventory?.stock)){
      this.alert('info', 'Ultimos productos en Stock "RECARGAR"', '');
      stock = Number(this.productInventory?.stock) - Number(this.form.controls['cantidad'].getRawValue());
      output = Number(this.productInventory?.salida) + Number(this.form.controls['cantidad'].getRawValue());
    } else {
      this.alert('error', `Exediste la cantidad en Stock: ${this.productInventory?.stock}`, '');
      return;
    }
    this.outputService.create(body).subscribe({
      next: resp => {
        let body1 = {
          salida: output,
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
          }
        }

        );
    }
  }

  close() {
    this.modalRef.hide();
  }

  onChangeAccomodation(event: any){
    console.log(event);
  }

  validateDate(event: any){
    if(event){
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

  onChangeProducts(event: any){
    console.log(event);
  }


  onChangeCant(event: any){
    
  }


}
