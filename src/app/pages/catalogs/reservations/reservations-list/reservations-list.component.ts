import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { RESERVATIONS_COLUMNS } from './columns';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { ReservationsDetailComponent } from '../reservations-detail/reservations-detail.component';
import { ButtonColumnComponent } from 'src/app/shared/components/button-column/button-column.component';
import { ButtonColumnAddComponent } from 'src/app/shared/components/button-column/button-column-add.component';
import { ButtonColumnDeleteComponent } from 'src/app/shared/components/button-column/button-column-delete.component';
import { ReservationsModalComponent } from '../reservations-modal/reservations-modal.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { ButtonColumnOutputComponent } from 'src/app/shared/components/button-column/button-column-output.component';
import { SalesListComponent } from '../../sales/sales-list/sales-list.component';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  infoUser: number = 0;
  idInCharge: any;

  reservarions?: IReservations;

  constructor(
    private modalService: BsModalService,
    private reservationsService: ReservationsService,
    private authService: AuthService,
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
      columns: { 
        officialConclusion: {
          title: 'Añadir Horas',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnAddComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.increase(row);
            });
          },
        },  
        officialConclusion1: {
          title: 'Venta',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.sales(row);
            });
          },
        }, 
        officialConclusion2: {
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
        },
        ...RESERVATIONS_COLUMNS },
    };
  }

  ngOnInit() {
    this.getUser();
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
          this.getAllReservations();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllReservations());


  }

  getUser(){
    const info = this.authService.getUserInfo();
    this.infoUser = info.id;
  }

  async validInCharge(idUser: number) {
    const params = new ListParams();
    params['filter.userId'] = `$eq:${idUser}`;
    return new Promise((resolve, reject) => {
      this.inChargeService.getAll(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  increase(event: IReservations){
    console.log(event);
    this.openModalIncrease(event);
  }

  openModalIncrease(reservations?: IReservations) {
    let config: ModalOptions = {
      initialState: {
        reservations,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ReservationsModalComponent, config);
  }

  sales(event: IReservations){
    console.log(event);
    this.openModalSales(event);
  }

  openModalSales(reservations?: IReservations) {
    let config: ModalOptions = {
      initialState: {
        reservations,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SalesListComponent, config);
  }


  output(event: any){
    console.log(event);
  }

  async getAllReservations() {
    this.loading = true;
    let inCharge: any = await this.validInCharge(this.infoUser);
    this.idInCharge = inCharge.data[0].alojamientoId;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(this.idInCharge);
    params['filter.alojamientoId'] = `$eq:${this.idInCharge}`;
    this.reservationsService.getAll(params).subscribe({
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

  edit(reservations: IReservations) {
    this.openModal(reservations);
  }


  openModal(reservations?: IReservations) {
    let config: ModalOptions = {
      initialState: {
        reservations,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ReservationsDetailComponent, config);
  }

  showDeleteAlert(reservarions: IReservations) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(reservarions.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.reservationsService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'RESERVACIÓN', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllReservations());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
  }

}
