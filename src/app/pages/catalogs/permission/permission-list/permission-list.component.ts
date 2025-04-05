import { Component, OnInit } from '@angular/core';
import { PERMISSION_COLUMNS } from './columns';
import { BasePage } from 'src/app/core/shared';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { PermisionService } from 'src/app/core/services/authentication/permission.service';
import { IPermission } from 'src/app/core/models/catalogs/permission.model';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PermissionDetailComponent } from '../permission-detail/permission-detail.component';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css']
})
export class PermissionListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  arrayPermission: any = [];

  constructor(
    private permisionService: PermisionService,
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
      columns: { seleccion: {
        title: 'Selección',
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onSelectPermission(instance),
        sort: false,
        filter: false,
      },...PERMISSION_COLUMNS
       },
    };
  }

  onSelectPermission(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        //this.selectDelegation(data.row, data.toggle),
        console.log(data.toggle);
        if (data.toggle === true) {
          const exists = this.arrayPermission.some((item: any) => item.id === data.row.id);
          if (!exists) {
            let permi = {
              id: data.row.id,
              name: data.row.name
            }
            this.arrayPermission.push(permi);
          }
        } else {
          this.arrayPermission = this.arrayPermission.filter((item: any) => item.id !== data.row.id);
        }
        console.log(this.arrayPermission);
      },
    });
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
          this.getAllPermission();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllPermission());
  }

  getAllPermission() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.permisionService.getAll(params).subscribe({
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

  edit(permi: IPermission) {
    this.openModal(permi);
  }

  openModal(permi?: IPermission) {
    let config: ModalOptions = {
      initialState: {
        permi,
        callback: (next: boolean) => {
          if (next) this.getAllPermission();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PermissionDetailComponent, config);
  }

  showDeleteAlert(permi: IPermission) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(permi.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.permisionService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Ususario', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllPermission());
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
