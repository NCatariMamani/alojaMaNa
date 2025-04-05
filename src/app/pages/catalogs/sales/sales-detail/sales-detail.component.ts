import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { ISales } from 'src/app/core/models/catalogs/sales.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { SalesService } from 'src/app/core/services/catalogs/sales.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'VENTA';
  status: string = 'Nuevo';
  edit: boolean = false;
  reservations?: IReservations;
  sales?: ISales;
  maxDate: Date = new Date();
  editDate?: Date;
  idReser: number = 0;
  result: any;

  accomodations = new DefaultSelect<IReservations>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private reservationsService: ReservationsService,
    private salesService: SalesService,
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
      reservacionId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
    });
    //this.form.controls['alojamientoId'].disable();
    if (this.sales != null) {
      this.edit = true;
      console.log(this.sales);
      this.form.patchValue(this.sales);
    }
    if (this.reservations != null) {
      const date = this.reservations.fecha;
      this.idReser = this.reservations.id;
      const localDate = new Date(this.reservations.fecha);
      const formattedDate = this.datePipe.transform(new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000), 'dd/MM/yyyy');
      this.form.controls['fecha'].setValue(formattedDate);
      this.form.controls['fecha'].disable();
      this.form.controls['reservacionId'].setValue(this.idReser);
    }
    setTimeout(() => {
      this.getReservation(new ListParams());
    }, 100);
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const dateString = this.form.controls['fecha'].getRawValue();
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const isoString = date.toISOString();
    let body = {
      fecha: isoString,
      reservacionId: Number(this.form.controls['reservacionId'].getRawValue())
    }
    this.salesService.create(body).subscribe({
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
    if (this.sales) {
      this.loading = true;
      const dateString = this.form.controls['fecha'].getRawValue();
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      const isoString = date.toISOString();
      let body = {
        fecha: isoString,
        reservacionId: Number(this.form.controls['reservacionId'].getRawValue())
      }
      this.salesService
        .update(this.sales.id, body)
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

  getReservation(params: ListParams) {
    if (this.idReser || this.idReser != 0) {
      params['filter.id'] = `$eq:${this.idReser}`;
    }
    this.reservationsService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.result = data.data.map(async (item: any) => {
          console.log(item.clientes);
          let clien = item.clientes;
          item['name'] = clien.nombre +' '+ clien.paterno + ' ' + clien.materno;
        });
        this.accomodations = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.accomodations = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeReservation(event: any) {
    console.log(event);
  }

  close() {
    this.modalRef.hide();
  }

  validateDate(event: any) {
    if (event) {
      this.editDate = event;
    }
  }

}
