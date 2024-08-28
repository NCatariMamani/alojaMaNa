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

  constructor(
    private modalService: BsModalService,
    private productInventoryService: ProductInventoryService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...PRODUCTINVENTORY_COLUMNS },
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
    if(this.idInventory){
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
    console.log(idInven);
    let config: ModalOptions = {
      initialState: {
        productInventory,
        idInven,
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

        this.delete(productInventory.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.productInventoryService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Inventario', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllProductInventory());
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
