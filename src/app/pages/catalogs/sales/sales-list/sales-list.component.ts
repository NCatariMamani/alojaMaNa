import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { ISales } from 'src/app/core/models/catalogs/sales.model';
import { SalesService } from 'src/app/core/services/catalogs/sales.service';
import { BasePage } from 'src/app/core/shared';
import { PRODUCTSALES_COLUMNS, SALES_COLUMNS } from './columns';
import { SalesDetailComponent } from '../sales-detail/sales-detail.component';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { ProductSalesService } from 'src/app/core/services/catalogs/productSales.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductSales } from 'src/app/core/models/catalogs/productSales.model';
import { ProductSalesDetailComponent } from '../../productSales/productSales-detail/productSales-detail.component';
import { CustomersService } from 'src/app/core/services/catalogs/customers.service';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnFilters1: any = [];
  totalItems: number = 0;
  totalItems1: number = 0;
  sales?: ISales;
  validButton: boolean = false;
  reservations?: IReservations;
  settings1 = { ...this.settings };
  idSale: number = 0;
  productSales: boolean = true;
  buttonDet: boolean = false;
  idAloja: number = 0;

  constructor(
    private modalService: BsModalService,
    private salesService: SalesService,
    private modalRef: BsModalRef,
    private productSalesService: ProductSalesService,
    private customersService: CustomersService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },*/
      columns: { ...SALES_COLUMNS },
    };
    this.settings1 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...PRODUCTSALES_COLUMNS },
    };
  }

  ngOnInit() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'alojamientos':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nombre`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAllSales();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllSales());
    if (this.reservations) {
      this.validButton = true;
    } else {
      this.validButton = false;
    }

    this.form = this.fb.group({
      productoId: [null, [Validators.required]],
      ventaId: [null, [Validators.required]],
    });

  }

  getAllSales() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.reservations) {
      this.salesService.getAllVentaClientesById(this.reservations.id,params).subscribe({
        next: response => {
          console.log(response);
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          (this.loading = false);
          this.data.load([]);
          if (error.status == 403) {
            this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
          } else {
            //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
          }
        }
      });
    }else{
      this.loading = false;
    }
  }

  edit(shopping1: ISales) {
    this.openModal(shopping1);
  }


  openModal(sales?: ISales) {
    const reservations = this.reservations;
    const alojaId = this.idAloja;
    let config: ModalOptions = {
      initialState: {
        sales,
        reservations,
        alojaId,
        callback: (next: boolean) => {
          if (next) this.getAllSales();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SalesDetailComponent, config);
  }

  showDeleteAlert(sales: ISales) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(sales.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.salesService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'VENTA', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllSales());
      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
       
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  rowsSelected(event: any) {
    console.log(event);
    this.productSales = true;
    this.buttonDet = true;
    this.idSale = event.id;
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'alojamientos':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nombre`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getAllProductSales();
        }
      });

    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllProductSales());
  }


  getAllProductSales() {
    this.loading = true;
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    params['filter.ventaId'] = `$eq:${this.idSale}`;
    this.productSalesService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems1 = response.count;
        this.loading = false;
      },
      error: error => {
        (this.loading = false);
        this.data1.load([]);
      }
    }
    );
  }

  edit1(productSales: IProductSales) {
    this.openModal1(productSales);
  }


  openModal1(productSales?: IProductSales) {
    const idSale = this.idSale;
    const reservationsSales = this.reservations;
    const alojaId = this.idAloja;
    console.log(alojaId);
    let config: ModalOptions = {
      initialState: {
        productSales,
        idSale,
        reservationsSales,
        alojaId,
        callback: (next: boolean) => {
          if (next) this.getAllProductSales();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProductSalesDetailComponent, config);
  }

  showDeleteAlert1(sales: IProductSales) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(sales.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete1(id: string | number) {
    this.productSalesService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'PRODUCTO VENTA', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllProductSales());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

}
