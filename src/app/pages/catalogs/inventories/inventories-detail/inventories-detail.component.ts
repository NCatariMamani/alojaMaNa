import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { IInventories } from 'src/app/core/models/catalogs/inventories.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { InventoriesService } from 'src/app/core/services/catalogs/inventories.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-inventories-detail',
  templateUrl: './inventories-detail.component.html',
  styleUrls: ['./inventories-detail.component.css']
})
export class InventoriesDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'INVENTARIO';
  status: string = 'Nuevo';
  edit: boolean = false;
  accommodation?: IAccommodation;
  inventories?: IInventories;
  editDate?: Date;
  maxDate: Date = new Date();
  idAccom: number = 0;
  

  accomodations = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private inventoriesService: InventoriesService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      alojamientoId: [this.idAccom, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ]
    });
    this.form.controls['alojamientoId'].disable();
    this.form.controls['descripcion'].disable();
    if (this.inventories != null) {
      this.edit = true;
      const formattedDate = this.datePipe.transform(this.inventories.fecha, 'dd/MM/yyyy');
      this.form.patchValue(this.inventories);
      this.form.controls['fecha'].setValue(formattedDate);
      const dateObj = new Date(this.inventories.fecha);
      /*console.log(dateObj);
      const year = dateObj.getFullYear();*/
    }

    setTimeout(() => {
      this.getAccomodation(new ListParams());
    }, 1000);
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const dateDescri = this.form.controls['descripcion'].value;
    console.log(dateDescri);
    const mesLiteral = formatDate(dateDescri, 'MMMM', 'es-ES');
    console.log(mesLiteral.toUpperCase());
    let body = {
      descripcion: mesLiteral.toUpperCase(),
      fecha: this.form.controls['fecha'].getRawValue(),
      alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
    }
    this.inventoriesService.create(body).subscribe({
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
    if (this.inventories) {
      this.loading = true;
      let setDate;
      const dateDescri = this.form.controls['descripcion'].value;
      const mesLiteral = formatDate(dateDescri, 'MMMM', 'es-ES');
      let body = {
        descripcion: mesLiteral.toUpperCase(),
        fecha: this.editDate,
        alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
      }
      this.inventoriesService
        .update(this.inventories.id, body)
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

  getAccomodation(params: ListParams) {
    /*if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }*/
    params['filter.id'] = `$eq:${this.idAccom}`;
    this.accomodationService.getAll(params).subscribe({
      next: data => {
        this.accomodations = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.accomodations = new DefaultSelect();
        this.loading = false;
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }

  onChangeAccomodation(event: any) {
    console.log(event);
  }


  validateDate(event: any) {
    if (event) {
      this.editDate = event;
      this.form.controls['descripcion'].setValue(this.editDate);
    }
  }


}
