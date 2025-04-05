import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/catalogs/users.service';
import { BasePage } from 'src/app/core/shared';
import { INCHARGE_COLUMNS, USERS_COLUMNS } from './columns';
import { IUser } from 'src/app/core/models/catalogs/users.model';
import { UsersDetailComponent } from '../users-detail/users-detail.component';
import { IInCharge } from 'src/app/core/models/catalogs/inCharge.model';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { InChargeDetailComponent } from '../../inCharge/inCharge-detail/inCharge-detail.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnFilters1: any = [];
  totalItems: number = 0;
  totalItems1: number = 0;
  user?: IUser;
  iInCharge?: IInCharge;
  settings1 = { ...this.settings };
  rowSelect: any;
  charge: boolean = true;
  idUser: number = 0;
  valid: boolean = true;

  constructor(
    private modalService: BsModalService,
    private usersService: UsersService,
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
      columns: { ...USERS_COLUMNS },
    };
    this.settings1 = {
      ...this.settings,
      hideSubHeader: true,
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
          this.getAllUsers();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllUsers());

  }
  rowsSelected(event: any){
    this.rowSelect = event.data;
    //this.valid = true;
    if(event){
      //this.charge = false;
      this.valid = false;
      this.idUser = event.data.id;
      this.params1.getValue()[
        'filter.userId'
      ] = `${SearchFilter.EQ}:${this.rowSelect.id}`;
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
          this.getAllInCharge();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllInCharge());
    }
  }

  getAllUsers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.usersService.getAll(params).subscribe({
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

  getAllInCharge() {
    this.loading = true;
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    this.inChargeService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems1 = response.count;
        this.loading = false;
      },
      error: error => {
        (this.loading = false);
        this.data1.load([]);
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      }
    }

    );
  }

  

  edit(user: IUser) {
    this.openModal(user);
  }

  edit1(inCharge: IInCharge) {
    this.openModal1(inCharge);
  }


  openModal(users?: IUser) {
    let config: ModalOptions = {
      initialState: {
        users,
        callback: (next: boolean) => {
          if (next) this.getAllUsers();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UsersDetailComponent, config);
  }

  openModal1(inCharges?: IInCharge) {
    const user = this.idUser;
    let config: ModalOptions = {
      initialState: {
        user,
        inCharges,
        callback: (next: boolean) => {
          if (next) this.getAllInCharge();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InChargeDetailComponent, config);
  }

  showDeleteAlert(shopping: IUser) {
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
  showDeleteAlert1(inCharge: IInCharge) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete1(inCharge.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.usersService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Ususario', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllUsers());
      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
       
      },
    });
  }

  delete1(id: string | number) {
    this.inChargeService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'ENCARGADO', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllInCharge());
      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
       
      },
    });
  }

  /*isDisabled(): boolean {
    return this.valid = true || this.arrayPermission.length === 0;
  }*/

}
