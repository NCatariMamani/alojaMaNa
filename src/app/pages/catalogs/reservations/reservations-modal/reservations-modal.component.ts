import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { BasePage } from 'src/app/core/shared';
import { DOUBLE_POSITIVE_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-reservations-modal',
  templateUrl: './reservations-modal.component.html',
  styleUrls: ['./reservations-modal.component.css']
})
export class ReservationsModalComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'SALIDA';
  status: string = 'Nuevo';
  edit: boolean = false;
  reservations?: IReservations;
  editDate?: Date;
  maxDate: Date = new Date();
  validation?: string;
  timeOutput?: string;
  timeProgram?: string;
  timeInput?: string;
  time?: string;
  extra?: string;
  currTime?: string;
  changeValid?: string;
  bodyWithoutChange?: {};
  bodyWithChange?: {};


  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reservationsService: ReservationsService,
    private currencyPipe: CurrencyPipe,
    private bedroomService: BedroomsService
  ) {
    super();

  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      horaEntrada: [null, [Validators.required]],
      horaSalida: [null, [Validators.required]],
      horaProgramada: [null, [Validators.required]],
      costoExtra: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      total: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      costoHabitacion: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      //aumentar: [null, [Validators.required]],
      montoEntregado: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      cambio: [null, [Validators.required]],
      estadoCambio: [null, [Validators.required]],
      deuda: [null, [Validators.required]]
    });
    this.form.controls['horaEntrada'].disable();
    this.form.controls['horaProgramada'].disable();
    this.form.controls['costoExtra'].disable();
    this.form.controls['costoHabitacion'].disable();
    this.form.controls['total'].disable();
    this.form.controls['montoEntregado'].disable();
    this.form.controls['estadoCambio'].disable();
    this.form.controls['horaSalida'].disable();
    if (this.reservations != null) {
      console.log(this.reservations);
      this.currentTime();
      this.edit = true;
      this.timeProgram = this.reservations.horaProgramada;
      this.timeInput = this.reservations.horaEntrada;
      this.form.patchValue(this.reservations);
      this.form.controls['horaSalida'].setValue(this.currTime);
      this.validarHorarioConParametros12Horas(this.timeInput, this.timeProgram);
      this.time = this.reservations.tiempo;
      this.extra = this.reservations.costoExtra;

    }
  }

  currentTime() {
    const date = new Date();
    let newHours = date.getHours();
    const newMinutes = date.getMinutes();
    const newModifier = newHours >= 12 ? 'pm' : 'am';
    newHours = newHours % 12 || 12; // Si es 0, se convierte a 12
    // Formatear los minutos con dos dígitos
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    this.currTime = `${newHours}:${formattedMinutes} ${newModifier}`;
    console.log(this.currTime);
  }

  formatToBolivianCurrency(value?: number): string | null {
    return this.currencyPipe.transform(value, 'Bs ', 'symbol', '1.2-2');
  }


  confirm() {
    //this.edit ? this.update() : this.create();
    if (this.changeValid == 'SI') {
      this.updateReservations(this.bodyWithChange);
    } else {
      this.updateReservations(this.bodyWithoutChange);
    }
  }



  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  updateReservations(body: any) {
    if (this.reservations) {
      this.loading = true;
      this.reservationsService
        .update(this.reservations.id, body)
        .subscribe({
          next: response => {
            this.loading = false;
            this.updateBedroom('SUCIO');
          },
          error: error => {
            this.loading = false;
          }
        }

        );
    }
  }

  updateBedroom(state: string) {
    if (this.reservations) {
      this.loading = true;
      let body = {
        estado: state
      }
      this.bedroomService
        .update(this.reservations.habitacionId, body)
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

  onChange(event: any) {
    console.log(event);
    if (event) {
      this.validation = event;
      const valueCost = this.form.controls['costoHabitacion'].value;
      //const valueExt = this.form.controls['costoExtra'].value;
      switch (event) {
        case '1H':
          console.log(this.extra);
          if (this.extra) {
            const value = 'Bs 10.00';
            const costTot1 = this.addCurrency(value, this.extra);
            const setCost = this.formatToBolivianCurrency(costTot1);
            this.form.controls['costoExtra'].setValue(setCost);
          } else {
            const costo = this.formatToBolivianCurrency(10);
            this.form.controls['costoExtra'].setValue(costo);
          }
          const valueExt = this.form.controls['costoExtra'].value;
          const costTot = this.addCurrency(valueCost, valueExt);
          const total = this.formatToBolivianCurrency(costTot);
          this.form.controls['total'].setValue(total);
          if (this.timeOutput) {
            const formatTime = this.addHoursToTime(this.timeOutput, 1);
            this.form.controls['horaSalida'].setValue(formatTime);
          }
          this.time = this.reservations?.tiempo;
          break;
        case '2H':
          if (this.extra) {
            const value = 'Bs 20.00';
            const costTot2 = this.addCurrency(value, this.extra);
            const setCost2 = this.formatToBolivianCurrency(costTot2);
            this.form.controls['costoExtra'].setValue(setCost2);
          } else {
            const costo1 = this.formatToBolivianCurrency(20);
            this.form.controls['costoExtra'].setValue(costo1);
          }
          const valueExt1 = this.form.controls['costoExtra'].value;
          const costTot1 = this.addCurrency(valueCost, valueExt1);
          const total1 = this.formatToBolivianCurrency(costTot1);
          this.form.controls['total'].setValue(total1);
          if (this.timeOutput) {
            const formatTime = this.addHoursToTime(this.timeOutput, 2);
            this.form.controls['horaSalida'].setValue(formatTime);
          }
          this.time = this.reservations?.tiempo;
          break;
        default:
          const costo2 = this.formatToBolivianCurrency(30);
          this.form.controls['costoExtra'].setValue(costo2);
          const valueExt2 = this.form.controls['costoExtra'].value;
          const timeOut2 = '12:00 pm'
          this.form.controls['horaSalida'].setValue(timeOut2);
          const costTot2 = this.addCurrency(valueCost, valueExt2);
          const total2 = this.formatToBolivianCurrency(costTot2);
          this.form.controls['total'].setValue(total2);
          this.time = 'TODA LA NOCHE';
          break;
      }
    }

  }

  addCurrency(value: string, value1: string): number {
    const numericAmount1 = parseFloat(value.replace('Bs ', ''));
    const numericAmount2 = parseFloat(value1.replace('Bs ', ''));
    const total = numericAmount1 + numericAmount2;
    return total;
  }

  subtractCurrency(value: string, value1: string): number {
    if (value > value1) {
      const numericAmount1 = parseFloat(value.replace('Bs ', ''));
      const numericAmount2 = parseFloat(value1.replace('Bs ', ''));
      const total = numericAmount1 - numericAmount2;
      return total;
    } else {
      this.alert('warning', `El monto saldra negativo`, ``);
      return 0;
    }
  }

  addHoursToTime(timeString: string, hoursToAdd: number): string {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setHours(date.getHours() + hoursToAdd);
    let newHours = date.getHours();
    const newMinutes = date.getMinutes();
    const newModifier = newHours >= 12 ? 'pm' : 'am';
    newHours = newHours % 12 || 12; // Si es 0, se convierte a 12
    // Formatear los minutos con dos dígitos
    const formattedMinutes = newMinutes.toString().padStart(2, '0');


    return `${newHours}:${formattedMinutes} ${newModifier}`;
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

  validarHorarioConParametros12Horas(
    horaInicio: string,
    horaProgram: string
  ): void {
    const currentTime = new Date();
    let newHours = currentTime.getHours();
    const newMinutes = currentTime.getMinutes();
    const newModifier = newHours >= 12 ? 'pm' : 'am';
    newHours = newHours % 12 || 12;
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    const formattTime = `${newHours}:${formattedMinutes} ${newModifier}`;
    const horaProgram24 = this.convertirHora12a24(horaProgram);
    const horaInicio24 = this.convertirHora12a24(horaInicio);
    const horaFin24 = this.convertirHora12a24(formattTime);
    console.log(horaProgram24, horaInicio24, horaFin24);
    const [horaProgra, minProgra] = horaProgram24.split(":").map(Number);
    const [horaIni, minIni] = horaInicio24.split(":").map(Number);
    const [horaFin, minFin] = horaFin24.split(":").map(Number);
    let program = new Date();
    let inicio = new Date();
    let fin = new Date();
    program.setHours(horaProgra, minProgra, 0); // Hora program
    inicio.setHours(horaIni, minIni, 0); // Hora inicio
    fin.setHours(horaFin, minFin, 0); // Hora fin
    /*if (horaInicio24 > horaProgram24) {
      // Ajusta horaProgram al día siguiente
      program = new Date(program.getTime() + 24 * 60 * 60 * 1000);  
    }*/
    //console.log(inicio, program, fin);
    // Verifica si la hora program está dentro del rango
    const tiempo = this.reservations?.tiempo;
    const dateAc = new Date();
    const date = this.reservations?.fecha;

    if (tiempo == 'TODA LA NOCHE') {
      const time1 = new DatePipe('en-EN').transform(date, 'dd/MM/yyyy', 'UTC');
      const time2 = new DatePipe('en-EN').transform(dateAc, 'dd/MM/yyyy', 'UTC');
      if (time1 == time2) {
        this.withoutChange(formattTime);
      } else {
        const actual = this.form.controls['horaSalida'].getRawValue();
        let vari = this.contarHorasDespuesDeMediodia(actual);
        console.log(vari);
        if (vari == 0) {
          this.withoutChange(formattTime);
        } else if (vari == 1) {
          this.validChange(10);
        } else if (vari == 2) {
          this.validChange(20);
        } else if (vari == 3) {
          this.validChange(30);
        } else {
          this.validChange(40);
        }
      }

    } else if (fin >= inicio && fin <= program) {
      this.withoutChange(formattTime);
    } else if (fin > program) {
      const diferenciaHoras = (fin.getTime() - program.getTime()) / (1000 * 60 * 60);
      console.log(diferenciaHoras);
      console.log(`Han pasado ${Math.ceil(diferenciaHoras)} horas después de las ${horaProgram}.`);
      if (diferenciaHoras < 1) {
        this.validation = '1H';
        this.validChange(10);
      } else if (diferenciaHoras < 2) {
        this.validation = '2H';
        this.validChange(20);
      }
      else if (diferenciaHoras < 3) {
        this.validation = '3H';
        this.validChange(30);
      }
      else {
        this.validation = '4H';
        this.validChange(40);
      }
    }
  }

  convertirHora12a24(hora12: string): string {
    const [hora, minutos, periodo] = hora12.match(/(\d+):(\d+)\s*(AM|PM)/i)!.slice(1);
    let hora24 = parseInt(hora, 10);
    if (periodo.toUpperCase() === "PM" && hora24 !== 12) {
      hora24 += 12; // Convertir PM a formato 24 horas
    } else if (periodo.toUpperCase() === "AM" && hora24 === 12) {
      hora24 = 0; // Medianoche en formato 24 horas
    }
    return `${hora24.toString().padStart(2, "0")}:${minutos}`;
  }

  validChange(increase: number) {
    const setCostExt = this.formatToBolivianCurrency(increase);
    this.form.controls['costoExtra'].setValue(setCostExt);
    const change = this.form.controls['cambio'].getRawValue();
    const costExtra = this.form.controls['costoExtra'].getRawValue();
    const tot = this.form.controls['total'].getRawValue();
    if (change != '0,00 Bs') {
      this.changeValid = 'SI';
      const setCost1 = this.formatToBolivianCurrency(0);
      const subsChange = this.subtractCurrency(change, costExtra);
      console.log(subsChange);
      const setSubsChange = this.formatToBolivianCurrency(subsChange);
      this.form.controls['cambio'].setValue(setSubsChange);
      const totCobrar = this.addCurrency(costExtra, tot);
      const total = this.formatToBolivianCurrency(totCobrar);
      this.form.controls['total'].setValue(total);
      this.form.controls['deuda'].setValue(setCost1);
      setTimeout(() => {
        this.alert('warning', `Se debe cambio de ${setSubsChange}`, ``);
      }, 500);
      this.bodyWithChange = {
        horaSalida: this.currentTime(),
        costoExtra: this.form.controls['costoExtra'].getRawValue(),
        total: this.form.controls['total'].getRawValue(),
        cambio: setCost1,
        estadoCambio: 'E',
        compania: 'SUCIO'
      }
    } else {
      this.changeValid = 'NO';
      this.form.controls['deuda'].setValue(setCostExt);
      const totCobrar = this.addCurrency(costExtra, tot);
      const total = this.formatToBolivianCurrency(totCobrar);
      this.form.controls['total'].setValue(total);
      setTimeout(() => {
        this.alert('warning', `El cliente debe ${setCostExt}`, ``);
      }, 1000);
      this.bodyWithoutChange = {
        horaSalida: this.currentTime(),
        compania: 'SUCIO'
      }
    }
  }

  //Funcion cuando no se deve cambio
  withoutChange(formattTime: string) {
    const setCost0 = this.formatToBolivianCurrency(0);
    this.form.controls['deuda'].setValue(setCost0);
    //console.log(`Está dentro del rango (${horaInicio} - ${horaProgram}). Realizar acción A.`);
    this.validation = 'OK';
    const change = this.form.controls['cambio'].getRawValue();
    if (change != '0,00 Bs') {
      this.changeValid = 'SI';
      setTimeout(() => {
        this.alert('warning', `Se debe cambio de ${change}`, ``);
      }, 500);
      this.bodyWithChange = {
        horaSalida: formattTime,
        cambio: setCost0,
        estadoCambio: 'E',
        compania: 'SUCIO'
      }
    } else {
      this.changeValid = 'NO';
      this.bodyWithoutChange = {
        horaSalida: formattTime,
        compania: 'SUCIO'
      }
    }
  }


  contarHorasDespuesDeMediodia(horaActual: string): number {
    console.log(horaActual);
    const actu = this.convertirHora12a24(horaActual);
    console.log(actu);
    const [horas, minutos] = actu.split(':').map(Number);
    const mediodia = new Date();
    mediodia.setHours(12, 0, 0, 0);
    const horaActualDate = new Date();
    horaActualDate.setHours(horas, minutos, 0, 0);
    console.log(mediodia, horaActualDate, horas, minutos);
    if (horaActualDate <= mediodia) {
      return 0;
    }
    const diferencia = (mediodia.getTime() - horaActualDate.getTime()) / (1000 * 60 * 60);
    return Math.abs(Math.floor(diferencia));
  }

}
