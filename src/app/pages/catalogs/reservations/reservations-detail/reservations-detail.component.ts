import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { CustomersService } from 'src/app/core/services/catalogs/customers.service';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { CustomersDetailComponent } from '../../customers/customers-detail/customers-detail.component';

@Component({
  selector: 'app-reservations-detail',
  templateUrl: './reservations-detail.component.html',
  styleUrls: ['./reservations-detail.component.css']
})
export class ReservationsDetailComponent extends BasePage implements OnInit {
  reservations?: IReservations;

  form: FormGroup = new FormGroup({});
  title: string = 'RESERVACIÓN';
  status: string = 'Nuevo';
  edit: boolean = false;
  //products?: IProducts [];
  infoInCharge: number = 0;
  idAccom: number = 0;

  result2?: any[];
  result?: any[];

  editDate?: Date;
  maxDate: Date = new Date();

  bedrooms = new DefaultSelect<IBedroom>();
  inCharge = new DefaultSelect<IInCharge>();
  accomodations = new DefaultSelect<IAccommodation>();
  customers = new DefaultSelect<ICustomer>();

  idInCharge?: number;

  prefe?: string;

  inCharge1: any;
  couple: boolean = false;

  name?: string;
  pather?: string;
  mather?: string;
  ci?: number;
  extencion?: string;

  idAloja: number = 0;
  eventReserId?: number;
  eventHabId?: number


  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reservationsService: ReservationsService,
    private bedroomsService: BedroomsService,
    private inChargeService: InChargeService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private accomodationService: AccomodationService,
    private customersService: CustomersService,
    private modalService: BsModalService,
  ) {
    super();
    this.form = this.fb.group({
      alojamientoId: [null, Validators.required],
    });
  }

  get alojaId() {
    return this.form.get('alojamientoId') as FormControl;
  }

  get inChargeId() {
    return this.form.get('encargadoId') as FormControl;
  }

  get cliente() {
    return this.form.get('clienteId') as FormControl;
  }

  get habitaId() {
    return this.form.get('habitacionId') as FormControl;
  }

  ngOnInit() {
    this.getInCharges();
    this.prepareForm();
  }

  private prepareForm() {
    //console.log(this.infoInCharge,this.idInCharge, this.inCharge1);
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      horaEntrada: [null, [Validators.required]],
      horaProgramada: [null, [Validators.required]],
      tiempo: ['MOMENTANEO', [Validators.required]],
      compania: ['OCUPADO', [Validators.required]],
      costoHabitacion: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      costoExtra: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      total: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      montoEntregado: [null, [Validators.required]],
      cambio: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      estadoCambio: ['P', [Validators.required]],
      habitacionId: [null, [Validators.required]],
      encargadoId: [null, [Validators.required]],
      alojamientoId: [null, [Validators.required]],
      clienteId: [null, [Validators.required]]
      //
    });
    this.form.disable();
    //this.form.controls['tiempo'].enable();
    this.form.controls['habitacionId'].enable();
    this.form.controls['clienteId'].enable();
    /*this.form.controls['fecha'].disable();
    this.form.controls['horaEntrada'].disable();
    this.form.controls['horaProgramada'].disable();
    this.form.controls['costoHabitacion'].disable();
    this.form.controls['total'].disable();
    this.form.controls['compania'].disable();
    this.form.controls['costoExtra'].disable();
    this.form.controls['encargadoId'].disable();
    this.form.controls['alojamientoId'].disable();
    this.form.controls['cambio'].disable();
    this.form.controls['estadoCambio'].disable();
    this.form.controls['montoEntregado'].disable();*/


    if (this.reservations != null) {
      this.edit = true;
      const localDate = new Date(this.reservations.fecha);
      const formattedDate = this.datePipe.transform(new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000), 'dd/MM/yyyy');
      this.eventReserId = this.reservations.id;
      this.eventHabId = this.reservations.habitacionId;
      this.habitaId.setValue(this.reservations.habitacionId);
      this.form.patchValue(this.reservations);
      this.cliente.setValue(this.reservations.clienteId);

      //this.form.controls['encargadoId'].setValue();
      this.form.controls['fecha'].setValue(formattedDate);
      //this.form.controls['habitacionId'].disable();
      this.form.controls['encargadoId'].disable();
      this.form.controls['tiempo'].disable();
      this.form.controls['compania'].disable();

      //this.form.controls['habitacionId'].setValue(this.reservations.habitacionId);
      console.log(this.reservations.habitacionId);
    } else {
      const date = new Date();
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      this.form.controls['fecha'].setValue(formattedDate);
      this.form.controls['horaEntrada'].setValue(this.getCurrentFormattedTime());
      this.canExecuteProcess();
    }
    setTimeout(() => {
      this.getBedroom(new ListParams());
      this.getInCharge(new ListParams());
      this.getAccomodation(new ListParams());
      this.getCustomer(new ListParams());
    }, 100);

  }

  async getInCharges() {

    const info = this.authService.getUserInfo();
    this.infoInCharge = info.id;
    console.log(this.infoInCharge);
    this.inCharge1 = await this.validInCharge(info.id);
    if (this.idAloja != 0) {
      this.alojaId.setValue(this.idAloja);
    } else {
      this.idAccom = this.inCharge1[0].alojamientoId;
      this.alojaId.setValue(this.idAccom);
    }
    const idInCharge = this.inCharge1[0].id;
    this.inChargeId.setValue(idInCharge);
    console.log(this.inCharge1);
  }

  async validInCharge(idUser: number) {
    const params = new ListParams();
    params['filter.userId'] = `$eq:${idUser}`;
    return new Promise((resolve, reject) => {
      this.inChargeService.getAll(params).subscribe({
        next: response => {
          const data = response.data;
          resolve(data);
        },
        error: err => {
          resolve(0);
        },
      });
    });
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

  canExecuteProcess() {
    /*const date = this.addHoursToTime(2);
    let currentHour = date.getHours();
    const currentMinutes = date.getMinutes();*/
    const now = new Date();
    let currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    //console.log(date, currentHour, currentMinutes);
    // Verificar si es después de las 10:00 PM (22:00)
    if (currentHour > 22 || (currentHour === 22 && currentMinutes >= 0) || (currentHour >= 0 && currentHour <= 5)) {
      setTimeout(() => {
        this.alert('info', 'A partir de las 10:00 PM solo se ofrecen habitaciones por toda la noche', ``);
      }, 500);
      const time = '12:00 pm';
      this.form.controls['horaProgramada'].setValue(time);
      this.form.controls['tiempo'].setValue('TODA LA NOCHE');
      //this.onChangeTime('TODA LA NOCHE');
      this.form.controls['montoEntregado'].enable();
      this.form.controls['tiempo'].disable();
    } else {
      this.form.controls['horaProgramada'].setValue(this.getTimeTwo());
      console.log(this.getTimeTwo());
      this.form.controls['tiempo'].enable();
    }
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  formatToBolivianCurrency(value: number): string | null {
    return this.currencyPipe.transform(value, 'Bs ', 'symbol', '1.2-2');
  }

  create() {
    this.loading = true;
    const dateString = this.form.controls['fecha'].getRawValue();
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const isoString = date.toISOString();

    let body = {
      fecha: isoString,
      horaEntrada: this.form.controls['horaEntrada'].getRawValue(),
      horaProgramada: this.form.controls['horaProgramada'].getRawValue(),
      tiempo: this.form.controls['tiempo'].getRawValue(),
      compania: this.form.controls['compania'].getRawValue(),
      montoEntregado: this.form.controls['montoEntregado'].getRawValue(),
      cambio: this.form.controls['cambio'].getRawValue(),
      estadoCambio: this.form.controls['estadoCambio'].getRawValue(),
      costoHabitacion: this.form.controls['costoHabitacion'].getRawValue(),
      total: this.form.controls['total'].getRawValue(),
      clienteId: this.form.controls['clienteId'].getRawValue(),
      habitacionId: Number(this.form.controls['habitacionId'].getRawValue()),
      encargadoId: Number(this.form.controls['encargadoId'].getRawValue()),
      alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue())
    };
    let body1 = {
      estado: 'OCUPADO'
    }

    this.reservationsService.create(body).subscribe({
      next: resp => {
        this.bedroomsService.update(this.form.controls['habitacionId'].getRawValue(), body1).subscribe({
          next: data => {
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
        });

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
    if (this.reservations) {
      this.loading = true;
      const dateString = this.form.controls['fecha'].getRawValue();
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      const isoString = date.toISOString();
      let body = {
        /*compania: this.form.controls['compania'].getRawValue(),
        fecha: isoString,
        horaEntrada: this.form.controls['horaEntrada'].getRawValue(),
        horaProgramada: this.form.controls['horaProgramada'].getRawValue(),
        tiempo: this.form.controls['tiempo'].getRawValue(),
        montoEntregado: this.form.controls['montoEntregado'].getRawValue(),
        cambio: this.form.controls['cambio'].getRawValue(),
        estadoCambio: this.form.controls['estadoCambio'].getRawValue(),
        costoHabitacion: this.form.controls['costoHabitacion'].getRawValue(),
        total: this.form.controls['total'].getRawValue(),
        habitacionId: Number(this.form.controls['habitacionId'].getRawValue()),
        encargadoId: Number(this.form.controls['encargadoId'].getRawValue()),
        alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
        clienteId: this.form.controls['clienteId'].getRawValue(),*/

        //habitacionId: Number(this.form.controls['habitacionId'].getRawValue()),
        clienteId: this.form.controls['clienteId'].getRawValue(),

      }
      this.reservationsService
        .update(this.reservations.id, body)
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

  getBedroom(params: ListParams) {
    //let aloja: number;
    if (!this.reservations) {
      params['filter.estado'] = `$ilike:LIBRE`;
    }
    if (params.text) {
      const valid = Number(params.text);
      if (!isNaN(valid)) {
        params['filter.noHabitacion'] = `$eq:${params.text}`;
      } else {
        params['filter.preferencias'] = `$ilike:${params.text}`;
      }
    }
    //params['filter.estado'] = `$ilike:LIBRE`;
    if (this.idAloja != 0) {
      //this.idAloja;
      params['filter.alojamientoId'] = `$eq:${this.idAloja}`;
      this.bedroomsService.getAll(params).subscribe({
        next: data => {
          console.log(data);
          this.result = data.data.map(async (item: any) => {
            item['noHabPref'] = item.noHabitacion + ' - ' + item.preferencias + ' ' + item.estado;
          });
          this.bedrooms = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.bedrooms = new DefaultSelect();
          this.loading = false;
          if (error.status == 403) {
            this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
          } else {
            //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
          }
        },
      });
    } else {
      const info = this.authService.getUserInfo();
      this.infoInCharge = info.id;
      console.log(info.id);

      this.bedroomsService.getAllHabUserById(info.id, params).subscribe({
        next: data => {
          console.log(data);
          this.result = data.data.map(async (item: any) => {
            item['noHabPref'] = item.noHabitacion + ' - ' + item.preferencias + ' ' + item.estado;
          });
          this.bedrooms = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.bedrooms = new DefaultSelect();
          this.loading = false;
          if (error.status == 403) {
            this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
          } else {
            //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
          }
        },
      });
    }

  }

  onChangeBedroom(event: any) {
    console.log(event);
    this.prefe = event;
    if (event.preferencias == 'SIMPLE' && this.form.controls['tiempo'].value == 'MOMENTANEO') {
      const formatCos = this.formatToBolivianCurrency(30);
      this.form.controls['costoHabitacion'].setValue(formatCos);
      this.form.controls['total'].setValue(formatCos);
      this.form.controls['montoEntregado'].enable();
      this.form.controls['estadoCambio'].enable();
    } else if (event.preferencias == 'SIMPLE' && this.form.controls['tiempo'].value == 'TODA LA NOCHE') {
      const formatCos1 = this.formatToBolivianCurrency(60);
      this.form.controls['costoHabitacion'].setValue(formatCos1);
      this.form.controls['total'].setValue(formatCos1);
      this.form.controls['montoEntregado'].enable();
      this.form.controls['estadoCambio'].enable();
    } else if (event.preferencias == 'BAÑO PRIVADO' && this.form.controls['tiempo'].value == 'MOMENTANEO') {
      const formatCost2 = this.formatToBolivianCurrency(40);
      this.form.controls['costoHabitacion'].setValue(formatCost2);
      this.form.controls['total'].setValue(formatCost2);
      this.form.controls['montoEntregado'].enable();
      this.form.controls['estadoCambio'].enable();
    } else {
      const formatCost3 = this.formatToBolivianCurrency(70);
      this.form.controls['costoHabitacion'].setValue(formatCost3);
      this.form.controls['total'].setValue(formatCost3);
      this.form.controls['montoEntregado'].enable();
      this.form.controls['estadoCambio'].enable();
    }
    console.log(event.estado);
    if (event.estado === 'LIBRE') {
      if (this.reservations && (this.reservations.habitacionId != this.form.controls['habitacionId'].getRawValue())) {
        this.alertQuestion(
          'warning',
          `¿Desea cambiar de habitación?`,
          '',
          'SI',
          'NO'
        ).then(question => {
          if (question.isConfirmed) {
            //console.log(Number(this.eventHabId) , Number(this.eventReserId));
            this.updateBedroom('LIBRE', Number(this.eventHabId));
            this.updateBedroom('OCUPADO', event.id);
            //this.updateReservation( Number(this.eventReserId), 'LIBRE');
            this.updateReservation(Number(this.eventReserId), 'OCUPADO', event.id);
          }
        });
      }
    } else {
      this.alert('warning', 'La habitación esta OCUPADA por otro cliente', ``);
    }

  }

  updateBedroom(state: string, idHab: number) {
    this.loading = true;
    let body = {
      estado: state
    }
    this.bedroomsService
      .update(idHab, body)
      .subscribe({
        next: response => {
          this.loading = false;
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

  updateReservation(idReser: number, state: string, habId?: number) {
    let body;
    if (habId) {
      body = {
        compania: state,
        habitacionId: habId
      }
    } else {
      body = {
        compania: state
      }
    }

    this.reservationsService
      .update(idReser, body)
      .subscribe({
        next: response => {
          this.loading = false;
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


  validateDate(event: any) {
    if (event) {
      this.editDate = event;
    }
  }

  getInCharge(params: ListParams) {
    this.inChargeService.getAllHabUserById(this.infoInCharge, params).subscribe({
      next: data => {
        this.result2 = data.data.map(async (item: any) => {
          item['idUser'] = item.id + ' - ' + item.nombre + ' ' + item.paterno + ' ' + item.materno;
        });
        this.inCharge = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.inCharge = new DefaultSelect();
        this.loading = false;
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }

  onChangeInCharge(event: any) {
    if (event) {
      this.idAccom = event.alojamientoId;
      this.form.controls['habitacionId'].enable();
      this.getBedroom(new ListParams);
      this.getCustomer(new ListParams);
    }
  }

  onChangeCompanion(event: any) {
    console.log(event);
    if (event == 'CON PAREJA') {
      this.couple = true;
      this.form.controls['nombreA'].enable();
      this.form.controls['paternoA'].enable();
      this.form.controls['maternoA'].enable();
      this.form.controls['ciA'].enable();
      this.form.controls['extencionA'].enable();
    } else {
      this.couple = false;
      this.form.controls['nombreA'].disable();
      this.form.controls['paternoA'].disable();
      this.form.controls['maternoA'].disable();
      this.form.controls['ciA'].disable();
      this.form.controls['extencionA'].disable();
    }
  }

  onChangeTime(event: any) {
    console.log(event);
    if (event == 'MOMENTANEO') {
      this.form.controls['horaProgramada'].setValue(this.getTimeTwo());
    } else if (event == 'TODA LA NOCHE') {
      const time = '12:00 pm';
      this.form.controls['horaProgramada'].setValue(time);
    }
    if (this.prefe == 'SIMPLE' && event == 'MOMENTANEO') {
      const formatCostBob = this.formatToBolivianCurrency(30);
      this.form.controls['costoHabitacion'].setValue(formatCostBob);
      this.form.controls['total'].setValue(formatCostBob);
    } else if (this.prefe == 'SIMPLE' && event == 'TODA LA NOCHE') {
      const formatCostBob1 = this.formatToBolivianCurrency(60);
      this.form.controls['costoHabitacion'].setValue(formatCostBob1);
      this.form.controls['total'].setValue(formatCostBob1);
    } else if (this.prefe == 'BAÑO PRIVADO' && event == 'MOMENTANEO') {
      const formatCostBob2 = this.formatToBolivianCurrency(40);
      this.form.controls['costoHabitacion'].setValue(formatCostBob2);
      this.form.controls['total'].setValue(formatCostBob2);
    } else {
      const formatCostBob3 = this.formatToBolivianCurrency(70);
      this.form.controls['costoHabitacion'].setValue(formatCostBob3);
      this.form.controls['total'].setValue(formatCostBob3);
    }
  }

  getTimeTwo(): string {
    const date = this.addHoursToTime(2);
    console.log(date);
    //SUMAR 15 MINUTOS
    date.setMinutes(date.getMinutes() + 10);
    // Sumar 2 horas a la hora actual
    //date.setHours(date.getHours() + 2);
    let hours = date.getHours();
    console.log(hours);
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Si es 0, lo cambiamos a 12
    return `${hours}:${minutes} ${ampm}`;
  }

  addHoursToTime(hoursToAdd: number): Date {
    const date = new Date();
    date.setHours(date.getHours() + hoursToAdd);
    return date;
  }

  async getAccomodation(params: ListParams) {
    console.log(this.infoInCharge);
    let inCharge1: any = await this.validInCharge(this.infoInCharge);
    if (inCharge1) {
      console.log(inCharge1);
      /*const idAccom = inCharge1[0].alojamientoId
      params['filter.id'] = `$eq:${idAccom}`;*/
    }
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

  getCustomer(params: ListParams) {
    //params['filter.alojamientoId'] = `$eq:${this.idAccom}`;
    let aloja: number;
    if (params.text) {
      const valid = Number(params.text);
      if (!isNaN(valid)) {
        // Si es un número
        params['filter.ci'] = `$eq:${params.text}`;
      } else {
        // Si es un string
        params['filter.nombre'] = `$ilike:${params.text}`;
      }
    }
    if (this.idAloja != 0) {
      aloja = this.idAloja;
    } else {
      aloja = this.idAccom;
    }

    this.customersService.getAllAlojaClientesById(aloja, params).subscribe({
      next: data => {
        this.result = data.data.map(async (item: any) => {
          item['idName'] = item.nombre + ' ' + item.paterno + ' ' + item.materno + ' ' + item.ci + ' ' + item.extencion;
        });
        this.customers = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.customers = new DefaultSelect();
        this.loading = false;
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }

  onChangeCustomer(event: any) {
    console.log(event);
  }

  onChangeAccomodation(event: any) {
    console.log(event);
  }

  onChangeState(event: any) {
    if (event == 'E') {
      const set0 = this.formatToBolivianCurrency(0);
      this.form.controls['cambio'].setValue(set0);
    } else {
      this.onChangeMoney(this.form.controls['montoEntregado'].getRawValue());
    }
  }

  onChangeMoney(event: any) {
    const monto = parseInt(event);
    const total = parseInt(this.form.controls['total'].value);
    console.log(monto, total);
    if (monto > total) {
      const cambio = monto - total;
      console.log(cambio);
      const money = this.formatToBolivianCurrency(cambio);
      this.form.controls['cambio'].setValue(money);
      this.form.controls['estadoCambio'].enable();
      this.form.controls['estadoCambio'].setValue('P');
    } else if (monto === total) {
      const money0 = this.formatToBolivianCurrency(0);
      this.form.controls['cambio'].setValue(money0);
      this.form.controls['estadoCambio'].disable();
      this.form.controls['estadoCambio'].setValue('E');
    }
    else {
      this.alert('warning', `El monto ${event} debe ser mayor al total`, ``);
      this.form.controls['montoEntregado'].setValue('');
      return;
    }
  }

  convertirMonedaACifra(valor: string): number {
    return parseFloat(valor.replace(' Bs', '').replace(',', '.'));
  }

  openModal() {
    let alojamientoId: number;
    if (this.idAloja != 0) {
      alojamientoId = this.idAloja;
    } else {
      alojamientoId = this.idAccom;
    }

    let config: ModalOptions = {
      initialState: {
        alojamientoId,
        callback: (next: boolean) => {
          if (next) this.getCustomer(new ListParams());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CustomersDetailComponent, config);
  }



}
