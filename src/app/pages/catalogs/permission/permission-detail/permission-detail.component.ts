import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IPermission } from 'src/app/core/models/catalogs/permission.model';
import { PermisionService } from 'src/app/core/services/authentication/permission.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-permission-detail',
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.css']
})
export class PermissionDetailComponent extends BasePage implements OnInit {

  title: string = 'PERMISO';
  form: FormGroup = new FormGroup({});
  permi?: IPermission;
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private permisionService: PermisionService,
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
    if (this.permi != null) {
      this.edit = true;
      console.log(this.permi);
      this.form.patchValue(this.permi);
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
    this.permisionService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
          this.loading = false
      }, error: err => {
        this.loading = false
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
    if (this.permi) {
      this.loading = true;
      let body = {
        name: this.form.controls['name'].getRawValue(),
      }
      this.permisionService
        .update(this.permi.id, body)
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
