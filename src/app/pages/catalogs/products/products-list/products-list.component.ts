import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { ProductsService } from 'src/app/core/services/catalogs/products.service';
import { BasePage } from 'src/app/core/shared';
import { IProducts } from 'src/app/core/models/catalogs/products.model';
import { ProductsDetailComponent } from '../products-detail/products-detail.component';
import { PRODUCTS_COLUMNS } from './columns';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  validButton: boolean = false;

  constructor(
    private modalService: BsModalService,
    private productsService: ProductsService,
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
      columns: { ...PRODUCTS_COLUMNS },
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
              case 'precio':
                searchFilter = SearchFilter.EQ;
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
          this.getAllShopping();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllShopping());

  }

  getAllShopping() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.productsService.getAll(params).subscribe({
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

  edit(products: IProducts) {
    this.openModal(products);
  }


  openModal(products?: IProducts) {
    const validButton = this.validButton;
    let config: ModalOptions = {
      initialState: {
        products,
        validButton,
        callback: (next: boolean) => {
          if (next) this.getAllShopping();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProductsDetailComponent, config);
  }

  showDeleteAlert(shopping: IProducts) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(shopping.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.productsService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'PRODUCTO', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllShopping());
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

}
