import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { IProducts } from 'src/app/core/models/catalogs/products.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { BasePage } from 'src/app/core/shared';
import { PRODUCTINVENTORY_COLUMNS } from './columns';
import { ProductInventoryService } from 'src/app/core/services/catalogs/productInventory.service';
import { ProductInventoryDetailComponent } from '../productInventory-detail/productInventory-detail.component';
import { IProductInventory } from 'src/app/core/models/catalogs/productInventory.model';
import { ProductsListComponent } from '../../products/products-list/products-list.component';
import { ButtonColumnInputComponent } from 'src/app/shared/components/button-column/button-column-input.component';
import { ButtonColumnOutputComponent } from 'src/app/shared/components/button-column/button-column-output.component';
import { InputModalComponent } from '../input-modal/input-modal.component';
import { OutputModalComponent } from '../output-modal/output-modal.component';
import { InputListComponent } from '../input-list/input-list.component';
import { OutputListComponent } from '../output-list/output-list.component';

@Component({
  selector: 'app-productInventory-list',
  templateUrl: './productInventory-list.component.html',
  styleUrls: ['./productInventory-list.component.css']
})
export class ProductInventoryListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  accommodation?: IAccommodation;
  products?: IProducts;
  idInventory?: number;
  validButton: boolean = false;
  validProduct: boolean = false;
  departmen?: string;

  constructor(
    private modalService: BsModalService,
    private productInventoryService: ProductInventoryService,
    private modalRef: BsModalRef,
    private productService: ProductsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: {
        input: {
          title: 'Entrada',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnInputComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.input(row);
            });
          },
        },
        output: {
          title: 'Salida',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnOutputComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.output(row);
            });
          },
        }, ...PRODUCTINVENTORY_COLUMNS
      },
    };
  }

  input(row: any) {
    console.log(row);
    this.alertQuestion(
      'info',
      '¿Desea añadir nuevo registro o solo ver?',
      '',
      'Nuevo',
      'Ver'
    ).then(question => {
      if (question.isConfirmed) {
        this.openModalInput(row);
      }else{
        this.openModalInputList(row);
      }
    });
  }

  openModalInput(productInventory?: IProductInventory) {
    let config: ModalOptions = {
      initialState: {
        productInventory,
        callback: (next: boolean) => {
          if (next) this.getAllProductInventory();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InputModalComponent, config);
  }

  openModalInputList(productInventory?: IProductInventory) {
    let config: ModalOptions = {
      initialState: {
        productInventory,
        callback: (next: boolean) => {
          if (next) this.getAllProductInventory();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InputListComponent, config);
  }

  output(row: any) {
    this.alertQuestion(
      'info',
      '¿Desea añadir nuevo registro o solo ver?',
      '',
      'Nuevo',
      'Ver'
    ).then(question => {
      if (question.isConfirmed) {
        this.openModalOutput(row);
      }else{
        this.openModalOutputList(row);
      }
    });

  }

  openModalOutput(productInventory?: IProductInventory) {
    let config: ModalOptions = {
      initialState: {
        productInventory,
        callback: (next: boolean) => {
          if (next) this.getAllProductInventory();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OutputModalComponent, config);
  }

  openModalOutputList(productInventory?: IProductInventory) {
    let config: ModalOptions = {
      initialState: {
        productInventory,
        callback: (next: boolean) => {
          if (next) this.getAllProductInventory();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OutputListComponent, config);
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
              case 'cantidad':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'entrada':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'salida':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'stock':
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
          this.getAllProductInventory();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllProductInventory());

  }

  getAllProductInventory() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.idInventory) {
      params['filter.inventarioId'] = `$eq:${this.idInventory}`;
    }
    this.productInventoryService.getAll(params).subscribe({
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
      }
    }

    );
  }

  edit(productInventory: IProductInventory) {
    this.openModal(productInventory);
  }


  openModal(productInventory?: IProductInventory) {
    const idInven = this.idInventory;
    const depa = this.departmen;
    console.log(idInven);
    let config: ModalOptions = {
      initialState: {
        productInventory,
        idInven,
        depa,
        callback: (next: boolean) => {
          if (next) this.getAllProductInventory();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProductInventoryDetailComponent, config);
  }

  showDeleteAlert(productInventory: IProductInventory) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(productInventory.id, productInventory);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number, productInventory: IProductInventory) {
    this.productInventoryService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'PRODUCTO INVENTARIO', 'Borrado Correctamente');
        let body1 = {
          estado: 'SR'
        };
        this.productService.update(Number(productInventory.productoId), body1)
          .subscribe({
            next: response => {
              this.loading = false;
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getAllProductInventory());
            },
            error: error => {
              this.loading = false;
            }
          }
          );


      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  openModal1(productInventory?: IProductInventory) {
    const validButton = true;
    let config: ModalOptions = {
      initialState: {
        validButton,
        callback: (next: boolean) => {
          if (next) this.getAllProductInventory();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProductsListComponent, config);
  }


}
