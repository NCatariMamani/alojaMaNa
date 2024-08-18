import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IBedroom } from 'src/app/core/models/catalogs/bedrooms.model';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { BasePage } from 'src/app/core/shared';
import { DOUBLE_POSITIVE_PATTERN, NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-reservations-detail',
  templateUrl: './reservations-detail.component.html',
  styleUrls: ['./reservations-detail.component.css']
})
export class ReservationsDetailComponent extends BasePage implements OnInit {
  reservarions?: IReservations;

  form: FormGroup = new FormGroup({});
  title: string = 'RESERVACIÓN';
  status: string = 'Nuevo';
  edit: boolean = false;
  //products?: IProducts [];

  editDate?: Date;
  maxDate: Date = new Date();

  bedrooms = new DefaultSelect();
  inCharge = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reservationsService: ReservationsService,
    private bedroomsService: BedroomsService,
    private inChargeService: InChargeService

  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      paterno: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      materno: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      edad: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      ci: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      extencion: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      nombreA: [null, [Validators.pattern(STRING_PATTERN)]],
      paternoA: [null, [Validators.pattern(STRING_PATTERN)]],
      maternoA: [null, [Validators.pattern(STRING_PATTERN)]],
      edadA: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ciA: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      extencionA: [null, [Validators.pattern(STRING_PATTERN)]],
      fecha: [null, [Validators.required]],
      horaEntrada: [null, [Validators.required]],
      horaSalida: [null, [Validators.required]],
      tiempo: [null, [Validators.required]],
      compania: [null, [Validators.required]],
      costoHabitacion: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      costoExtra: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      total: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN) ]],
      habitacionId: [null, [Validators.required]],
      encargadoId: [null, [Validators.required]],
    });
    if (this.reservarions != null) {
      this.edit = true;
      this.form.patchValue(this.reservarions);
    }
    setTimeout(() => {
      this.getBedroom(new ListParams());
      this.getInCharge(new ListParams());
    }, 1000);
    
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true; 
    let body = {
      nombre: this.form.controls['nombre'].getRawValue(),
      paterno: this.form.controls['paterno'].getRawValue(),
      materno: this.form.controls['materno'].getRawValue(),
      edad: Number(this.form.controls['edad'].getRawValue()),
      ci: Number(this.form.controls['ci'].getRawValue()),
      extencion: this.form.controls['extencion'].getRawValue(),
      nombreA: this.form.controls['nombreA'].getRawValue(),
      paternoA: this.form.controls['paternoA'].getRawValue(),
      maternoA: this.form.controls['maternoA'].getRawValue(),
      edadA: Number(this.form.controls['edadA'].getRawValue()),
      ciA: Number(this.form.controls['ciA'].getRawValue()),
      extencionA: this.form.controls['extencionA'].getRawValue(),
      fecha: Number(this.form.controls['fecha'].getRawValue()),
      horaEntrada: this.form.controls['horaEntrada'].getRawValue(),
      horaSalida: this.form.controls['horaSalida'].getRawValue(),
      tiempo: this.form.controls['tiempo'].getRawValue(),
      compania: this.form.controls['compania'].getRawValue(),
      costoHabitacion: parseFloat(this.form.controls['costoHabitacion'].getRawValue()),
      costoExtra: parseFloat(this.form.controls['costoExtra'].getRawValue()),
      total: parseFloat(this.form.controls['total'].getRawValue()),
      habitacionId: Number(this.form.controls['habitacionId'].getRawValue()),
      encargadoId: Number(this.form.controls['encargadoId'].getRawValue()),
    }
    this.reservationsService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
        this.loading = false
      }, error: err =>  {
        this.loading = false
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
    if (this.reservarions) {
      this.loading = true;   
      let body = {
        nombre: this.form.controls['nombre'].getRawValue(),
        paterno: this.form.controls['paterno'].getRawValue(),
        materno: this.form.controls['materno'].getRawValue(),
        edad: Number(this.form.controls['edad'].getRawValue()),
        ci: Number(this.form.controls['ci'].getRawValue()),
        extencion: this.form.controls['extencion'].getRawValue(),
        nombreA: this.form.controls['nombreA'].getRawValue(),
        paternoA: this.form.controls['paternoA'].getRawValue(),
        maternoA: this.form.controls['maternoA'].getRawValue(),
        edadA: Number(this.form.controls['edadA'].getRawValue()),
        ciA: Number(this.form.controls['ciA'].getRawValue()),
        extencionA: this.form.controls['extencionA'].getRawValue(),
        fecha: Number(this.form.controls['fecha'].getRawValue()),
        horaEntrada: this.form.controls['horaEntrada'].getRawValue(),
        horaSalida: this.form.controls['horaSalida'].getRawValue(),
        tiempo: this.form.controls['tiempo'].getRawValue(),
        compania: this.form.controls['compania'].getRawValue(),
        costoHabitacion: parseFloat(this.form.controls['costoHabitacion'].getRawValue()),
        costoExtra: parseFloat(this.form.controls['costoExtra'].getRawValue()),
        total: parseFloat(this.form.controls['total'].getRawValue()),
        habitacionId: Number(this.form.controls['habitacionId'].getRawValue()),
        encargadoId: Number(this.form.controls['encargadoId'].getRawValue()),
      }
      this.reservationsService
        .update(this.reservarions.id, body)
        .subscribe({
          next: response => {
            this.loading = false;
            this.handleSuccess()
          },
          error: error => {
            this.loading = false;
          }
        }

        );
    }
  }

  close() {
    this.modalRef.hide();
  }

  getBedroom(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.bedroomsService.getAll(params).subscribe({
      next: data => {
        this.bedrooms = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.bedrooms = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeAccomodation(event: any){
    console.log(event);
  }


  validateDate(event: any){
    if(event){
      this.editDate = event;
    }
  }

  getInCharge(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.inChargeService.getAll(params).subscribe({
      next: data => {
        this.inCharge = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.inCharge = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeProducts(event: any){
    console.log(event);
  }


  onTimeChange(event: any){

  }

}
