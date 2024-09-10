import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProductSales } from 'src/app/core/models/catalogs/productSales.model';
import { ISales } from 'src/app/core/models/catalogs/sales.model';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { ProductSalesService } from 'src/app/core/services/catalogs/productSales.service';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { SalesService } from 'src/app/core/services/catalogs/sales.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-productSales-detail',
  templateUrl: './productSales-detail.component.html',
  styleUrls: ['./productSales-detail.component.css']
})
export class ProductSalesDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'PRODUCTO COMPRA';
  status: string = 'Nuevo';
  edit: boolean = false;
  //products?: IProducts [];
  productSales?: IProductSales;
  editDate?: Date;
  maxDate: Date = new Date();
  idSale: number = 0;

  reservations = new DefaultSelect();
  products = new DefaultSelect();

  result: any;
  result1: any;
  sales?: ISales;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private datePipe: DatePipe,
    private productSalesService: ProductSalesService,
    private reservationsService: ReservationsService,
    private salesService: SalesService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      productoId: [null, [Validators.required]],
      ventaId: [this.idSale, [Validators.required]],
    });
    this.form.controls['ventaId'].disable();
    if (this.productSales != null) {
      this.edit = true;
      this.form.patchValue(this.productSales);
    }
    /*if(this.sales){
      this.idSale = this.sales.id;
    }*/
    setTimeout(() => {
      this.getSales(new ListParams());
      this.getProducts(new ListParams());
    }, 100);

  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;

    let body = {
      productoId: Number(this.form.controls['productoId'].getRawValue()),
      ventaId: Number(this.form.controls['ventaId'].getRawValue())
    }
    this.productSalesService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
          this.loading = false
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
    if (this.productSales) {
      this.loading = true;
      let body = {
        productoId: Number(this.form.controls['productoId'].getRawValue()),
        ventaId: Number(this.form.controls['ventaId'].getRawValue())
      }
      this.productSalesService
        .update(this.productSales.id, body)
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

  getSales(params: ListParams) {
    if (this.sales) {
      params['filter.id'] = `$eq:${this.sales.id}`;
    }
    this.salesService.getAll(params).subscribe({
      next: data => {
        this.result = data.data.map(async (item: any) => {
          const localDate = new Date(item.fecha);
          const formattedDate = this.datePipe.transform(new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000), 'dd/MM/yyyy');
          item['idSales'] = item.id + ' - ' + formattedDate;
        });
        this.reservations = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.reservations = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeReservations(event: any) {
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
    this.productsService.getAll(params).subscribe({
      next: data => {
        this.result1 = data.data.map(async (item: any) => {
          item['product'] = item.nombre + ' - ' + item.precio;
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
    console.log(event);
  }

}
