import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProductInventory } from 'src/app/core/models/catalogs/productInventory.model';
import { IProducts } from 'src/app/core/models/catalogs/products.model';
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
  stockOut?: number;

  accomodations = new DefaultSelect();
  products = new DefaultSelect<IProducts>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productService: ProductsService,
    private productInventoryService: ProductInventoryService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    this.form = this.fb.group({
      salida: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      stock: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      productoId:  [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      //alojamientoId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
    });
    this.form.controls['stock'].disable();
    this.form.controls['productoId'].disable();
    if (this.productInventory != null) {
      this.edit = true;
      this.stockOut = this.productInventory.stock;
      this.form.patchValue(this.productInventory);
    }
    setTimeout(() => {
      //this.getAccomodation(new ListParams());
      this.getProducts(new ListParams());
    }, 100);
  }


  confirm() {
    //this.edit ? this.update() : this.create();
    this.update();
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

  getProducts(params: ListParams) {
    /*if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    params['filter.estado'] = `$ilike:SR`;
    if(this.depa){
      params['filter.departamento'] = `$ilike:${this.depa}`;
    }*/
    this.productService.getAll(params).subscribe({
      next: data => {
        this.result = data.data.map(async (item: any) => {
          item['name'] = item.nombre +' - '+ item.precio;
        });
        this.products = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.products = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeProducts(event: any){
    console.log(event);
  }


  onChangeCant(event: any){
    if(event){
      const inputElement = event.target as HTMLInputElement;
      const valor = Number(inputElement.value);
      const totStock =  Number(this.stockOut) - valor;
      if(valor > Number(this.stockOut)){
        this.alert('error', 'NO EXISTE', `La cantidad suficiente`);
        return;
      }else{
        console.log(totStock);
        this.form.controls['stock'].setValue(totStock);
      }
    }
  }


}
