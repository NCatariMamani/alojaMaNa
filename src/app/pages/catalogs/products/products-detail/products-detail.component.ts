import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  accomodations = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      precio: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
    });
    if (this.products != null) {
      this.edit = true;
      this.form.patchValue(this.products);
    }
    
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let body = {
      nombre: this.form.controls['nombre'].getRawValue(),
      precio: parseFloat(this.form.controls['precio'].getRawValue())
    }
    this.productsService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
        this.loading = false
      }, error: err =>  {
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
    if (this.products) {
      this.loading = true;   
      let body = {
        nombre: this.form.controls['nombre'].getRawValue(),
        precio: parseFloat(this.form.controls['precio'].getRawValue())
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
          }
        }

        );
    }
  }

  close() {
    this.modalRef.hide();
  }


}
