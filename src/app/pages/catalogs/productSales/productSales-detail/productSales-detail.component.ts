import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProductSales } from 'src/app/core/models/catalogs/productSales.model';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
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
  DateSale: any;
  reservationsSales?: IReservations;

  reservations = new DefaultSelect();
  products = new DefaultSelect();

  result: any;
  result1: any;
  sales?: ISales;

  price?: string;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private datePipe: DatePipe,
    private productSalesService: ProductSalesService,
    private reservationsService: ReservationsService,
    private currencyPipe: CurrencyPipe,
    private salesService: SalesService
  ) {
    super();
  }

  get saleId() {
      return this.form.get('ventaId') as FormControl;
    }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      precioTotal: [null, [Validators.required]],
      productoId: [null, [Validators.required]],
      ventaId: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      precioUni: [null, [Validators.required]]
    });
    this.form.controls['ventaId'].disable();
    this.form.controls['precioUni'].disable();
    this.form.controls['precioTotal'].disable();
    if (this.productSales != null) {
      this.edit = true;
      this.form.patchValue(this.productSales);
      this.previouStart(this.idSale);
      console.log(this.idSale);
    }else{
      this.previouStart(this.idSale);
      console.log(this.idSale);
    }
    /*if(this.sales){
      this.idSale = this.sales.id;
    }*/
   //console.log(this.reservationsSales?.cambio);
    setTimeout(() => {
      this.getSales(new ListParams());
      this.getProducts(new ListParams());
    }, 100);

  }

  async previouStart(idSales:number){
    this.DateSale = await this.validSales(idSales);
    let saleDate = this.DateSale[0].id;
    console.log(saleDate);
    const date = new Date(saleDate);
    const formattedDate = this.datePipe.transform(new Date(date.getTime() + date.getTimezoneOffset() * 60000), 'dd/MM/yyyy');
    this.saleId.setValue(saleDate);
  }

  async validSales(idSale: number){
    const params = new ListParams();
    params['filter.id'] = `$eq:${idSale}`;
    return new Promise((resolve, reject) => {
      this.salesService.getAll(params).subscribe({
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


  confirm() {
    /*console.log(this.reservationsSales?.cambio);
    const change = this.reservationsSales?.cambio;
    if(this.edit){
      this.update()
    }else{
      if(change != '0,00 Bs'){
        console.log('Se va a descontar del cambios si o no');
        //this.create()
      }else{
        console.log('No se debe cambio');
      } 
    }*/
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;

    let body = {
      productoId: Number(this.form.controls['productoId'].getRawValue()),
      ventaId: Number(this.form.controls['ventaId'].getRawValue()),
      precioTotal: this.form.controls['precioTotal'].getRawValue(),
      cantidad: Number(this.form.controls['cantidad'].getRawValue()),
      precioUni: this.form.controls['precioUni'].getRawValue(),
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
        ventaId: Number(this.form.controls['ventaId'].getRawValue()),
        precioVenta: this.form.controls['precioVenta'].getRawValue()
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
          console.log(formattedDate);
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
    console.log(event.precio);
    const cant = this.form.controls['cantidad'].getRawValue();
    if(event.precio){
      this.price = event.precio;
      this.form.controls['precioUni'].setValue(event.precio);
    }
    if(event.precio && cant){
      const currency = this.addCurrency(cant, event.precio);
      const priceTot = this.formatToBolivianCurrency(currency);
      this.form.controls['precioTotal'].setValue(priceTot);
    }
  }

  onChangeAmount(event: any){
    console.log(event);
    const price = this.form.controls['precioUni'].getRawValue();
    if(event && price){
      const currency = this.addCurrency(event, price);
      const priceTot = this.formatToBolivianCurrency(currency);
      this.form.controls['precioTotal'].setValue(priceTot);
    }
  }

  addCurrency(value: string, value1: string): number {
    const numVal = Number(value);
    const numericAmount2 = parseFloat(value1.replace('Bs ', ''));
    const total = numVal * numericAmount2;
    return total;
  }

  formatToBolivianCurrency(value?: number): string | null {
    return this.currencyPipe.transform(value, 'Bs ', 'symbol', '1.2-2');
  }
}
