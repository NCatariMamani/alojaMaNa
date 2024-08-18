import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { BasePage } from 'src/app/core/shared';
import { INCHARGE_COLUMNS } from './columns';
import { IInCharge } from 'src/app/core/models/catalogs/inCharge.model';
import { InChargeDetailComponent } from '../inCharge-detail/inCharge-detail.component';

@Component({
  selector: 'app-inCharge-list',
  templateUrl: './inCharge-list.component.html',
  styleUrls: ['./inCharge-list.component.css']
})
export class InChargeListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  iInCharge?: IInCharge;
  constructor(
    private modalService: BsModalService,
    private inChargeService: InChargeService

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
      columns: { ...INCHARGE_COLUMNS },
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
              case 'celular':
                searchFilter = SearchFilter.EQ;
                break;
              case 'alojamiento':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nombre`;
                break;
              case 'user':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.email`;
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
    this.inChargeService.getAll(params).subscribe({
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

  edit(inCharges: IInCharge) {
    this.openModal(inCharges);
  }


  openModal(inCharges?: IInCharge) {
    let config: ModalOptions = {
      initialState: {
        inCharges,
        callback: (next: boolean) => {
          if (next) this.getAllShopping();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InChargeDetailComponent, config);
  }

  showDeleteAlert(inCharge: IInCharge) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(inCharge.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.inChargeService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'ENCARGADO', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllShopping());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }


}
