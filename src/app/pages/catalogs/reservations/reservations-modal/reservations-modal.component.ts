import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
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
  title: string = 'AUMENTAR HORAS EXTRAS';
  status: string = 'Nuevo';
  edit: boolean = false;
  reservations?: IReservations;
  editDate?: Date;
  maxDate: Date = new Date();
  validation?: string;
  timeOutput?: string;


  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reservationsService: ReservationsService,
    private currencyPipe: CurrencyPipe
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
      costoExtra: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      total: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      costoHabitacion: [null, [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      aumentar: [null, [Validators.required]]
    });
    this.form.controls['horaEntrada'].disable();
    this.form.controls['horaSalida'].disable();
    this.form.controls['costoExtra'].disable();
    this.form.controls['costoHabitacion'].disable();
    this.form.controls['total'].disable();
    if (this.reservations != null) {
      this.edit = true;
      this.timeOutput = this.reservations.horaSalida;
      this.form.patchValue(this.reservations);
    }

  }

  formatToBolivianCurrency(value: number): string | null {
    return this.currencyPipe.transform(value, 'Bs ', 'symbol', '1.2-2');
  }


  confirm() {
    //this.edit ? this.update() : this.create();
    this.update();
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
      const moneda = this.form.controls['total'].getRawValue();
      const format = this.formatToBolivianCurrency(moneda);
      console.log(format);
      let body = {
        horaSalida: this.form.controls['horaSalida'].getRawValue(),
        costoExtra: parseFloat(this.form.controls['costoExtra'].getRawValue()),
        total: parseFloat(this.form.controls['total'].getRawValue())
      }
      /*this.reservationsService
        .update(this.reservations.id, body)
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
          const costo = this.formatToBolivianCurrency(10);
          this.form.controls['costoExtra'].setValue(costo);
          const valueExt = this.form.controls['costoExtra'].value;
          if(this.timeOutput){
            const formatTime = this.addHoursToTime(this.timeOutput,1);
            this.form.controls['horaSalida'].setValue(formatTime);
          }          
          const costTot = this.addCurrency(valueCost,valueExt);
          const total = this.formatToBolivianCurrency(costTot);
          this.form.controls['total'].setValue(total);
          break;
        case '2H':
          const costo1 = this.formatToBolivianCurrency(20);
          this.form.controls['costoExtra'].setValue(costo1);
          const valueExt1 = this.form.controls['costoExtra'].value;
          if(this.timeOutput){
            const formatTime = this.addHoursToTime(this.timeOutput,2);
            this.form.controls['horaSalida'].setValue(formatTime);
          }
          const costTot1 = this.addCurrency(valueCost,valueExt1);
          const total1 = this.formatToBolivianCurrency(costTot1);
          this.form.controls['total'].setValue(total1);
          break;
        default:
          const costo2 = this.formatToBolivianCurrency(30);
          this.form.controls['costoExtra'].setValue(costo2);
          const valueExt2 = this.form.controls['costoExtra'].value;
          const timeOut2 = '12:00 pm'
          this.form.controls['horaSalida'].setValue(timeOut2);
          const costTot2 = this.addCurrency(valueCost,valueExt2);
          const total2 = this.formatToBolivianCurrency(costTot2);
          this.form.controls['total'].setValue(total2);
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

}
