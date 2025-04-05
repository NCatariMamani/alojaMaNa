import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IRole } from 'src/app/core/models/catalogs/role.model';
import { PermisionService } from 'src/app/core/services/authentication/permission.service';
import { RoleService } from 'src/app/core/services/authentication/role.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { PERMISSION_COLUMNS } from '../../permission/permission-list/columns';
import { LocalDataSource } from 'ng2-smart-table';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { IPermission } from 'src/app/core/models/catalogs/permission.model';
import { PermissionDetailComponent } from '../../permission/permission-detail/permission-detail.component';
import { RolePermissionsService } from 'src/app/core/services/authentication/rolePermissions.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent extends BasePage implements OnInit {

  title: string = 'ROLES';
  form: FormGroup = new FormGroup({});
  rol?: IRole;
  edit1: boolean = false;
  arrayPermission: any = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  role?: IRole;
  userRole: number = 0;
  roleLength: number = 0;
  permissionList: any = [];
  roleDet: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private roleService: RoleService,
    private permisionService: PermisionService,
    private modalService: BsModalService,
    private authService: AuthService,
    private rolePermissionsService: RolePermissionsService
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
        seleccion: {
          title: 'Selección',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectPermission(instance),
          valuePrepareFunction: (isSelected: any, row: any) => {
            //console.log(row, this.arrayPermission);
            return this.arrayPermission.some((item: any) => item.permissionId === row.id) ? true : false;
          },
          sort: false,
          filter: false,
        }, ...PERMISSION_COLUMNS
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
              roleId: this.role?.id,
              permissionId: data.row.id
            }
            this.arrayPermission.push(permi);
          }
        } else {
          this.arrayPermission = this.arrayPermission.filter((item: any) => item.permissionId !== data.row.id);
        }
        console.log(this.arrayPermission);
      },
    });
  }

  isDisabled(): boolean {
    return this.form.invalid || this.arrayPermission.length === 0;
  }

  ngOnInit() {
    this.reviewPermissions();
    this.prepareForm();
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

  getUser() {
    const info = this.authService.getUserInfo();
    this.userRole = info.role;
  }

  async reviewPermissions() {
    if (this.userRole != 0) {
      let rolePermi: any = await this.getByIdRolePermission(this.userRole);
      console.log(rolePermi);
    }
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
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
        
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.role != null) {
      //this.edit1 = true;
      this.roleDet = this.role;
      console.log(this.roleDet.permissions, this.roleDet);
      this.form.patchValue(this.role);
      this.form.controls['name'].disable();

      if (this.roleDet.permissions && this.roleDet.permissions.length > 0) {
        this.edit1 = true;
        console.log('tiene permisos');

        // Inicializar arrayPermission con permisos existentes
        this.arrayPermission = this.roleDet.permissions.map((p: any) => ({
          roleId: p.roleId,
          permissionId: p.permissionId
        }));



        /*this.loading = true;
        this.roleService
          .update(this.role.id, this.arrayPermission)
          .subscribe({
            next: response => {
              this.loading = false;
              this.handleSuccess()
            },
            error: error => {
              this.loading = false;
            }
          }

          );*/

        /*this.permissionList = roleDet.permissions.map((perm: any) => {
          const isChecked = this.arrayPermission.some(
            (item: any) =>
              item.permissionId === perm.id && item.roleId === this.role?.id
          );
          return {
            ...perm,
            checked: isChecked
          };
        });*/
      }
    }
  }

  confirm() {
    this.edit1 ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    console.log(this.arrayPermission);
    this.rolePermissionsService.create(this.arrayPermission).subscribe({
      next: resp => {
        this.handleSuccess(),
          this.loading = false
      }, error: err => {
        this.loading = false;
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      }
    }
    );
  }

  handleSuccess() {
    const message: string = this.edit1 ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }



  update() {
    if (this.roleDet.permissions) {
      this.loading = true;
      this.rolePermissionsService
        .update(this.roleDet.id, this.arrayPermission)
        .subscribe({
          next: response => {
            this.loading = false;
            this.handleSuccess()
          },
          error: error => {
            this.loading = false;
            if (error.status == 403) {
              this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
            } else {
              //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
            }
          }
        }

        );
    }
  }

  close() {
    this.modalRef.hide();
  }


  async getByIdRolePermission(idRole: number) {
    const params = new ListParams();
    params['filter.roleId'] = `$eq:${idRole}`;
    return new Promise((resolve, reject) => {
      this.rolePermissionsService.getAll(params).subscribe({
        next: response => {
          console.log(response);
          resolve(response);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

}
