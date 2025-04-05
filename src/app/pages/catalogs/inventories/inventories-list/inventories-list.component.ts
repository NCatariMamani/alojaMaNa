import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { InventoriesService } from 'src/app/core/services/catalogs/inventories.service';
import { BasePage } from 'src/app/core/shared';
import { INVENTORIES_COLUMNS } from './columns';
import { IInventories } from 'src/app/core/models/catalogs/inventories.model';
import { InventoriesDetailComponent } from '../inventories-detail/inventories-detail.component';

@Component({
  selector: 'app-inventories-list',
  templateUrl: './inventories-list.component.html',
  styleUrls: ['./inventories-list.component.css']
})
export class InventoriesListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  accommodation?: IAccommodation;
  inventories?: IInventories;

  constructor(
    private modalService: BsModalService,
    private accomodationService: AccomodationService,
    private inventoriesService: InventoriesService

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
      columns: { ...INVENTORIES_COLUMNS },
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
          this.getAllInventories();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllInventories());

  }

  getAllInventories() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.inventoriesService.getAll(params).subscribe({
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
    }

    );
  }

  edit(inventories: IInventories) {
    this.openModal(inventories);
  }


  openModal(inventories?: IInventories) {
    let config: ModalOptions = {
      initialState: {
        inventories,
        callback: (next: boolean) => {
          if (next) this.getAllInventories();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InventoriesDetailComponent, config);
  }

  showDeleteAlert(shopping: IInventories) {
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
    this.inventoriesService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Inventario', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllInventories());
      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }

}
