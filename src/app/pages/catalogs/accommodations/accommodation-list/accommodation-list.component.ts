import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, ListParamsFather, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ACCOMMODATIONS_COLUMNS, BEDROOMS_COLUMNS } from './columns';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AccommodatioDetailComponent } from '../accommodatio-detail/accommodatio-detail.component';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { IBedroom } from 'src/app/core/models/catalogs/bedrooms.model';
import { BedroomsDetailComponent } from '../../bedrooms/bedrooms-detail/bedrooms-detail.component';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.css']
})
export class AccommodationListComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  //data1: any = [];
  columnFilters: any = [];
  columnFilters2: any = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  accommodation?: IAccommodation;
  idAccom: number = 0;
  rowSelect: any;
  bedrooms: boolean = false;
  settings2 = { ...this.settings };


  constructor(
    private modalService: BsModalService,
    private accomodationService: AccomodationService,
    private bedroomsService: BedroomsService
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


  edit(accommodation1: IAccommodation) {
    this.openModal(accommodation1);
  }

  edit2(bedroom: IBedroom) {
    this.openModal2(bedroom);
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

  delete(id: string | number) {
    this.accomodationService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Alojamiento', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllAcommodations());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

}
