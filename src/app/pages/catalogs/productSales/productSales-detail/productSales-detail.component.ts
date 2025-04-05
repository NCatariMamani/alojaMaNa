import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProductSales } from 'src/app/core/models/catalogs/productSales.model';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { ISales } from 'src/app/core/models/catalogs/sales.model';
import { OutputService } from 'src/app/core/services/catalogs/output.service';
import { ProductInventoryService } from 'src/app/core/services/catalogs/productInventory.service';
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
  title: string = 'PRODUCTO VENTA';
  status: string = 'Nuevo';
  edit: boolean = false;
  //products?: IProducts [];
  productSales?: IProductSales;
  editDate?: Date;
  maxDate: Date = new Date();
  idSale: number = 0;
  DateSale: any;
  reservationsSales?: IReservations;
  alojaId: number = 0;
  producInId?: number;
  descProducto?: string;

  reservations = new DefaultSelect();
  products = new DefaultSelect();

  validation?: string;

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
    private salesService: SalesService,
    private outputService: OutputService,
    private productInventoryService: ProductInventoryService,
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
      precioUni: [null, [Validators.required]],
      stock: [null, [Validators.required]]
    });
    this.form.controls['ventaId'].disable();
    this.form.controls['precioUni'].disable();
    this.form.controls['precioTotal'].disable();
    this.form.controls['stock'].disable();
    if (this.productSales != null) {
      this.edit = true;
      this.form.patchValue(this.productSales);
      this.previouStart(this.idSale);
      console.log(this.idSale);
    } else {
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

  async previouStart(idSales: number) {
    this.DateSale = await this.validSales(idSales);
    let saleDate = this.DateSale[0].id;
    console.log(saleDate);
    const date = new Date(saleDate);
    const formattedDate = this.datePipe.transform(new Date(date.getTime() + date.getTimezoneOffset() * 60000), 'dd/MM/yyyy');
    this.saleId.setValue(saleDate);
  }

  async validSales(idSale: number) {
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

    let bodyOutput = {
      cantidad: Number(this.form.controls['cantidad'].getRawValue()),
      descripcion: this.descProducto,
      fecha: this.maxDate,
      productoInventarioId: Number(this.producInId),
    }

    const stockAct = Number(this.form.controls['stock'].getRawValue()) - Number(this.form.controls['cantidad'].getRawValue());
    let bodyProInven = {
      salida: Number(this.form.controls['cantidad'].getRawValue()),
      stock: stockAct
    }
    this.productSalesService.create(body).subscribe({
      next: resp => {
        this.outputService.create(bodyOutput).subscribe({
          next: resp => {
            this.productInventoryService
              .update(Number(this.producInId), bodyProInven)
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
            this.loading = false;
            if (err.status == 403) {
              this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
            } else {
              //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
            }
          }
        }
        );
      }, error: err => {
        this.loading = false
        this.alert('error', 'Se debe llenar todos los campos', ``);
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
    if (this.productSales) {
      this.loading = true;
      let body = {
        productoId: Number(this.form.controls['productoId'].getRawValue()),
        ventaId: Number(this.form.controls['ventaId'].getRawValue()),
        precioVenta: this.form.controls['precioVenta'].getRawValue()
      }
      console.log(body);
      this.productSalesService
        .update(this.productSales.id, body)
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
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
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
    console.log(this.alojaId);
    this.productsService.getAllPoducInven(this.alojaId, params).subscribe({
      next: data => {
        console.log(data);
        this.result1 = data.data.map(async (item: any) => {
          //item['product'] = item.nombre + ' - ' + item.precio;
          item['product'] = item.nombre;
        });
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

  onChangeProducts(event: any) {
    if (event) {
      console.log(event.nombre, event.productoInventarios[0]);
      this.descProducto = event.nombre;
      this.producInId = event.productoInventarios[0].id;
      this.form.controls['stock'].setValue(event.productoInventarios[0].stock);
      const stock1 = event.productoInventarios[0].stock;
      if (stock1 > 4) {
        this.validation = 'OK';
      } else {
        this.validation = 'OF'
      }
      const cant = this.form.controls['cantidad'].getRawValue();
      if (event.precio) {
        this.price = event.precio;
        this.form.controls['precioUni'].setValue(event.precio);
      }
      if (event.precio && cant) {
        const currency = this.addCurrency(cant, event.precio);
        const priceTot = this.formatToBolivianCurrency(currency);
        this.form.controls['precioTotal'].setValue(priceTot);
      }
    }

  }

  onChangeAmount(event: any) {
    console.log(event);
    if (Number(this.form.controls['stock'].getRawValue()) < event) {
      this.alert('warning', `No cuenta con los productos suficientes`, '');
      return;
    } else {
      const price = this.form.controls['precioUni'].getRawValue();
      if (event && price) {
        const currency = this.addCurrency(event, price);
        const priceTot = this.formatToBolivianCurrency(currency);
        this.form.controls['precioTotal'].setValue(priceTot);
      }
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
