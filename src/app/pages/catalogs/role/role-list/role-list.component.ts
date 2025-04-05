import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { RoleService } from 'src/app/core/services/authentication/role.service';
import { BasePage } from 'src/app/core/shared';
import { ROLE_COLUMNS } from './columns';
import { IRole } from 'src/app/core/models/catalogs/role.model';
import { RoleDetailComponent } from '../role-detail/role-detail.component';
import { ButtonColumnPermissionComponent } from 'src/app/shared/components/button-column/button-column-permission.component';
import { RoleModalComponent } from '../role-modal/role-modal.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private roleService: RoleService,
    private modalService: BsModalService,
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
          title: 'Permisos',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnPermissionComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.permissions(row);
            });
          },
        }, ...ROLE_COLUMNS
      },
    };
  }

  permissions(row: any) {
    if (row) {
      this.openModalRoleDetail(row);
    }
  }

  openModalRoleDetail(role: IRole) {
    //const role = rol;
    let config: ModalOptions = {
      initialState: {
        role,
        callback: (next: boolean) => {
          if (next) this.getAllRole();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RoleDetailComponent, config);
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
          this.getAllRole();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllRole());
  }

  getAllRole() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.roleService.getAll(params).subscribe({
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

  edit(permi: IRole) {
    this.openModal(permi);
  }

  openModal(rol?: IRole) {
    let config: ModalOptions = {
      initialState: {
        rol,
        callback: (next: boolean) => {
          if (next) this.getAllRole();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RoleModalComponent, config);
  }

  showDeleteAlert(rol: IRole) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(rol.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.roleService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Ususario', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllRole());
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
