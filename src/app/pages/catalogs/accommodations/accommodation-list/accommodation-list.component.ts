import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, ListParamsFather, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ACCOMMODATIONS_COLUMNS } from './columns';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AccommodatioDetailComponent } from '../accommodatio-detail/accommodatio-detail.component';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.css']
})
export class AccommodationListComponent  extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  accommodation?: IAccommodation;

  constructor(
    private modalService: BsModalService,
    private accomodationService: AccomodationService
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

  edit(accommodation1: IAccommodation) {
    this.openModal(accommodation1);
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

  showDeleteAlert(accom: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Alojamiento', 'Borrado Correctamente');
        this.delete(accom.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.accomodationService.remove(id).subscribe({
      next: () => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllAcommodations());
      },
    });
  }

}
