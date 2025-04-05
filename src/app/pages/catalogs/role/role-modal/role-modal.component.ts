import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IRole } from 'src/app/core/models/catalogs/role.model';
import { RoleService } from 'src/app/core/services/authentication/role.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent extends BasePage implements OnInit {

  title: string = 'ROL';
  form: FormGroup = new FormGroup({});
  rol?: IRole;
  edit: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private roleService: RoleService,
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.rol != null) {
      this.edit = true;
      console.log(this.rol);
      this.form.patchValue(this.rol);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let body = {
      name: this.form.controls['name'].getRawValue(),
    }
    this.roleService.create(body).subscribe({
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
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }



  update() {
    if (this.rol) {
      this.loading = true;
      let body = {
        name: this.form.controls['name'].getRawValue(),
      }
      this.roleService
        .update(this.rol.id, body)
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

}
