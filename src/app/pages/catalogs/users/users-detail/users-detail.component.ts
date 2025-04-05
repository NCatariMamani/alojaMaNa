import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRole } from 'src/app/core/models/catalogs/role.model';
import { IUser } from 'src/app/core/models/catalogs/users.model';
import { RoleService } from 'src/app/core/services/authentication/role.service';
import { UsersService } from 'src/app/core/services/catalogs/users.service';
import { BasePage } from 'src/app/core/shared';
import { DOUBLE_POSITIVE_PATTERN, EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'USUARIO';
  status: string = 'Nuevo';
  edit: boolean = false;
  users?: IUser;
  editDate?: Date;
  maxDate: Date = new Date();
  result?: any[];

  roles = new DefaultSelect<IRole>();

  deleteClass: boolean = true;
  showPassword: boolean = false;

  accomodations = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private usersService: UsersService,
    private datePipe: DatePipe,
    private roleService: RoleService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      password: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      roleId: [null, [Validators.required]],
    });
    if (this.users != null) {
      this.edit = true;
      this.form.patchValue(this.users);
    }

    this.getRole(new ListParams());
    
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.usersService.create(this.form.getRawValue()).subscribe({
      next: resp => {
        this.handleSuccess(),
        this.loading = false
      }, error: err =>  {
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
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    if (this.users) {
      this.loading = true;   
      this.usersService
        .update(this.users.id, this.form.getRawValue())
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

  clean(){
    this.form.reset();
  }

  getRole(params: ListParams) {
      //params['filter.alojamientoId'] = `$eq:${this.idAccom}`;
      if (params.text) {
        const valid = Number(params.text);
        if (!isNaN(valid)) {
          // Si es un número
          params['filter.id'] = `$eq:${params.text}`;
        } else {
          // Si es un string
          params['filter.name'] = `$ilike:${params.text}`;
        }
      }
  
      this.roleService.getAll(params).subscribe({
        next: data => {
          this.result = data.data.map(async (item: any) => {
            item['idName'] = item.id + ' ' + item.name ;
          });
          this.roles = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.roles = new DefaultSelect();
          this.loading = false;
          if (error.status == 403) {
            this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
          } else {
            //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
          }
        },
      });
    }

    onChangeRole(event: any){
      console.log(event);
    }

}
