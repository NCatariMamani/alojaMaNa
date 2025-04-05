import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared';
import { CUSTOMERS_COLUMNS } from './columns';
import { CustomersService } from 'src/app/core/services/catalogs/customers.service';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CustomersDetailComponent } from '../customers-detail/customers-detail.component';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  totalItems: number = 0;
  accommodation?: IAccommodation;
  customer?: ICustomer;

  constructor(
    private accomodationService: AccomodationService,
    private customersService: CustomersService,
    private modalService: BsModalService
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
      columns: { ...CUSTOMERS_COLUMNS },
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
          this.getAllCustomers();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllCustomers());
  }

  getAllCustomers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.customersService.getAll(params).subscribe({
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
    });
  }

  edit(customer: ICustomer) {
    this.openModal(customer);
  }

  openModal(customer?: ICustomer) {
    let config: ModalOptions = {
      initialState: {
        customer,
        callback: (next: boolean) => {
          if (next) this.getAllCustomers();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CustomersDetailComponent, config);
  }


  showDeleteAlert(customer: ICustomer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(customer.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.customersService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Cliente', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllCustomers());
      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }


}
