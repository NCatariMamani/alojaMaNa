import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProducts } from 'src/app/core/models/catalogs/products.model';
import { IProductShopping } from 'src/app/core/models/catalogs/productShopping.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { ProductShoppingService } from 'src/app/core/services/catalogs/productShopping.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-productShopping-detail',
  templateUrl: './productShopping-detail.component.html',
  styleUrls: ['./productShopping-detail.component.css']
})
export class ProductShoppingDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'PRODUCTO COMPRA';
  status: string = 'Nuevo';
  edit: boolean = false;
  //products?: IProducts [];
  productShopping?: IProductShopping;
  editDate?: Date;
  maxDate: Date = new Date();

  accomodations = new DefaultSelect();
  products = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private datePipe: DatePipe,
    private productShoppingService: ProductShoppingService,
    private accomodationService: AccomodationService,
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    this.form = this.fb.group({
      productoId: [null, [Validators.required]],
      alojamientoId: [null, [Validators.required]],
    });
    if (this.productShopping != null) {
      this.edit = true;
      this.form.patchValue(this.productShopping);
    }
    setTimeout(() => {
      this.getAccomodation(new ListParams());
      this.getProducts(new ListParams());
    }, 1000);
    
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    
    let body = {
      productoId: Number(this.form.controls['productoId'].getRawValue()),
      alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue())
    }
    this.productShoppingService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
        this.loading = false
      }, error: err =>  {
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
    if (this.productShopping) {
      this.loading = true;   
      let body = {
        productoId: Number(this.form.controls['productoId'].getRawValue()),
        alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue())
      }
      this.productShoppingService
        .update(this.productShopping.id, body)
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
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
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
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.productsService.getAll(params).subscribe({
      next: data => {
        this.products = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.products = new DefaultSelect();
        this.loading = false;
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }

  onChangeProducts(event: any){
    console.log(event);
  }

}
