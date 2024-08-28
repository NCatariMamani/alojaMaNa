import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, ListParamsFather, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ACCOMMODATIONS_COLUMNS, BEDROOMS_COLUMNS, INVENTORIES_COLUMNS } from './columns';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AccommodatioDetailComponent } from '../accommodatio-detail/accommodatio-detail.component';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { IBedroom } from 'src/app/core/models/catalogs/bedrooms.model';
import { BedroomsDetailComponent } from '../../bedrooms/bedrooms-detail/bedrooms-detail.component';
import { InventoriesService } from 'src/app/core/services/catalogs/inventories.service';
import { IInventories } from 'src/app/core/models/catalogs/inventories.model';
import { InventoriesDetailComponent } from '../../inventories/inventories-detail/inventories-detail.component';
import { ProductInventoryListComponent } from '../../productInventory/productInventory-list/productInventory-list.component';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.css']
})
export class AccommodationListComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  data3: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  //data1: any = [];
  columnFilters: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  accommodation?: IAccommodation;
  idAccom: number = 0;
  rowSelect: any;
  bedrooms: boolean = false;
  settings2 = { ...this.settings };
  settings3 = { ...this.settings };

  constructor(
    private modalService: BsModalService,
    private accomodationService: AccomodationService,
    private bedroomsService: BedroomsService,
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
      columns: { ...ACCOMMODATIONS_COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...BEDROOMS_COLUMNS },
    };
    this.settings3 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...INVENTORIES_COLUMNS }
    }
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
              case 'noHabitaciones':
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
          this.getAllAcommodations();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllAcommodations());

  }

  getAllAcommodations() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.accomodationService.getAll(params).subscribe({
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

  rowsSelected(event: any) {
    console.log(event.data);
    this.rowSelect = event.data;
    if (event) {
      this.bedrooms = true;
      this.idAccom = event.data.id;
      this.params2.getValue()[
        'filter.alojamientoId'
      ] = `${SearchFilter.EQ}:${this.rowSelect.id}`;
      //this.getBeddroms();
      this.data2
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
                case 'noHabitacion':
                  searchFilter = SearchFilter.EQ;
                  break;
                default:
                  searchFilter = SearchFilter.ILIKE;
                  break;
              }

              if (filter.search !== '') {
                this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
              } else {
                delete this.columnFilters2[field];
              }
            });
            this.params2 = this.pageFilter(this.params2);
            this.getBeddroms();
          }
        });
      this.params2
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getBeddroms());

      this.params3.getValue()[
        'filter.alojamientoId'
      ] = `${SearchFilter.EQ}:${this.rowSelect.id}`;

      this.data3
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
                this.columnFilters3[field] = `${searchFilter}:${filter.search}`;
              } else {
                delete this.columnFilters3[field];
              }
            });
            this.params3 = this.pageFilter(this.params3);
            this.getAllInventories();
          }
        });

      this.params3
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getAllInventories());

    }
  }

  getBeddroms() {
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.bedroomsService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data2.load(response.data);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => {
        (this.loading = false);
        this.data2.load([]);
      }
    }
    );
  }

  getAllInventories() {
    this.loading = true;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    this.inventoriesService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data3.load(response.data);
        this.data3.refresh();
        this.totalItems3 = response.count;
        this.loading = false;
      },
      error: error => {
        (this.loading = false);
        this.data3.load([]);
      }
    }

    );
  }


  edit(accommodation1: IAccommodation) {
    this.openModal(accommodation1);
  }

  edit2(bedroom: IBedroom) {
    this.openModal2(bedroom);
  }

  edit3(inventori: IInventories) {
    this.openModal3(inventori);
  }

  openModal(accommodation?: IAccommodation) {
    let config: ModalOptions = {
      initialState: {
        accommodation,
        callback: (next: boolean) => {
          if (next) this.getAllAcommodations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AccommodatioDetailComponent, config);
  }

  openModal2(bedroom?: IBedroom) {
    const idAccom = this.idAccom;
    let config: ModalOptions = {
      initialState: {
        idAccom,
        bedroom,
        callback: (next: boolean) => {
          if (next) this.getBeddroms();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(BedroomsDetailComponent, config);
  }

  openModal3(inventories?: IInventories) {
    const idAccom = this.idAccom;
    let config: ModalOptions = {
      initialState: {
        idAccom,
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


  showDeleteAlert(accom: IAccommodation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(accom.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  showDeleteAlert2(bedroom: IBedroom) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(bedroom.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  showDeleteAlert3(inventori: IInventories) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete3(inventori.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.accomodationService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'ALOJAMIENTO', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllAcommodations());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

  delete2(id: string | number) {
    this.bedroomsService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'HABITACIÓN', 'Borrado Correctamente');
        this.params2
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getBeddroms());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

  delete3(id: string | number) {
    this.inventoriesService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'INVENTARIO', 'Borrado Correctamente');
        this.params3
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllInventories());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }


  rowsSelected1(event: IInventories){
    console.log(event);
    this.openModal4(event);
  }


  openModal4(inventories?: any) {
    console.log(inventories.data);
    const idInventory = inventories.data?.id;
    const validButton = true;
    const validProduct = true;
    let config: ModalOptions = {
      initialState: {
        idInventory,
        validButton,
        validProduct,
        callback: (next: boolean) => {
          if (next) this.getAllInventories();
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProductInventoryListComponent, config);
  }

}
