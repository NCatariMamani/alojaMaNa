import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { BasePage } from 'src/app/core/shared';
import { BEDROOMS_COLUMNS } from './columns';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { IBedroom } from 'src/app/core/models/catalogs/bedrooms.model';
import { BedroomsDetailComponent } from '../bedrooms-detail/bedrooms-detail.component';

@Component({
  selector: 'app-bedrooms-list',
  templateUrl: './bedrooms-list.component.html',
  styleUrls: ['./bedrooms-list.component.css']
})
export class BedroomsListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  accommodation?: IAccommodation;

  constructor(
    private modalService: BsModalService,
    private accomodationService: AccomodationService,
    private bedrromsService: BedroomsService

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
    this.bedrromsService.getAll(params).subscribe({
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

  edit(shopping1: IBedroom) {
    this.openModal(shopping1);
  }


  openModal(shopping?: IBedroom) {
    let config: ModalOptions = {
      initialState: {
        shopping,
        callback: (next: boolean) => {
          if (next) this.getAllShopping();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(BedroomsDetailComponent, config);
  }

  showDeleteAlert(shopping: IBedroom) {
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
    this.bedrromsService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Compras', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllShopping());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

}
