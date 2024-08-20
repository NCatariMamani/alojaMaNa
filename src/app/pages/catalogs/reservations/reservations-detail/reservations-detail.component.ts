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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { IInCharge } from 'src/app/core/models/catalogs/inCharge.model';

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
  infoInCharge: number = 0;

  result2?: any [];
  result?: any [];

  editDate?: Date;
  maxDate: Date = new Date();

  bedrooms = new DefaultSelect();
  inCharge = new DefaultSelect<IInCharge>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reservationsService: ReservationsService,
    private bedroomsService: BedroomsService,
    private inChargeService: InChargeService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
    this.getInCharges();
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
      tiempo: ['MOMENTANEO', [Validators.required]],
      compania: ['SOLO', [Validators.required]],
      costoHabitacion: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      costoExtra: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      total: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      habitacionId: [null, [Validators.required]],
      encargadoId: [null, [Validators.required]],
    });

    this.form.controls['nombreA'].disable();
    this.form.controls['paternoA'].disable();
    this.form.controls['maternoA'].disable();
    this.form.controls['edadA'].disable();
    this.form.controls['ciA'].disable();
    this.form.controls['extencionA'].disable();
    this.form.controls['fecha'].disable();
    this.form.controls['horaEntrada'].disable();
    this.form.controls['horaSalida'].disable();
    this.form.controls['costoHabitacion'].disable();
    this.form.controls['total'].disable();
    //this.form.controls['encargadoId'].disable();

    if (this.reservarions != null) {
      this.edit = true;
      this.form.patchValue(this.reservarions);
    }else{
      const date = new Date();
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      this.form.controls['fecha'].setValue(formattedDate);
      this.form.controls['horaEntrada'].setValue(this.getCurrentFormattedTime());
      this.form.controls['horaSalida'].setValue(this.getTimeTwo());
    }
    setTimeout(() => {
      this.getBedroom(new ListParams());
      
    }, 1000);

  }

  getInCharges(){
    const info = this.authService.getUserInfo();
    this.infoInCharge = info.id;
    console.log(this.infoInCharge);
    this.getInCharge(new ListParams());
  }


  getCurrentFormattedTime(): string {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // Si es 0, lo cambiamos a 12

    return `${hours}:${minutes} ${ampm}`;
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
      }, error: err => {
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
        this.result = data.data.map(async (item: any) => {
          item['noHabPref'] = item.noHabitacion + ' - ' + item.preferencias + ' ' + item.estado;
        });
        this.bedrooms = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.bedrooms = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeBedroom(event: any) {
    console.log(event);
  }


  validateDate(event: any) {
    if (event) {
      this.editDate = event;
    }
  }

  getInCharge(params: ListParams) {
    params['filter.userId'] = `$eq:${this.infoInCharge}`;
    this.inChargeService.getAll(params).subscribe({
      next: data => {
        this.result2 = data.data.map(async (item: any) => {
          item['idUser'] = item.id + ' - ' + item.nombre + item.paterno +' '+ item.materno;
        });
        this.inCharge = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.inCharge = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeInCharge(event: any){
    console.log(event);
  }

  onChangeCompanion(event: any) {
    console.log(event);
    if (event == 'CON PAREJA') {
      this.form.controls['nombreA'].enable();
      this.form.controls['paternoA'].enable();
      this.form.controls['maternoA'].enable();
      this.form.controls['edadA'].enable();
      this.form.controls['ciA'].enable();
      this.form.controls['extencionA'].enable();
    } else {
      this.form.controls['nombreA'].disable();
      this.form.controls['paternoA'].disable();
      this.form.controls['maternoA'].disable();
      this.form.controls['edadA'].disable();
      this.form.controls['ciA'].disable();
      this.form.controls['extencionA'].disable();
    }
  }

  onChangeTime(event: any){
    console.log(event);
    if(event == 'MOMENTANEO'){
      this.form.controls['horaSalida'].setValue(this.getTimeTwo());
    }else if(event == 'TODA LA NOCHE'){
      const time = '12:00 pm';
      this.form.controls['horaSalida'].setValue(time);
    }
  }

  getTimeTwo(): string {
    const date = new Date();
    
    // Sumar 2 horas a la hora actual
    date.setHours(date.getHours() + 2);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // Si es 0, lo cambiamos a 12

    return `${hours}:${minutes} ${ampm}`;
  }


  

}
