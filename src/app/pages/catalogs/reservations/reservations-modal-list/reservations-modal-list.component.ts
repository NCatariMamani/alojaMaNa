import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { RESERVATIONS_COLUMNS_1 } from './columns';
import { ButtonColumnAddComponent } from 'src/app/shared/components/button-column/button-column-add.component';
import { ButtonColumnComponent } from 'src/app/shared/components/button-column/button-column.component';
import { ButtonColumnOutputComponent } from 'src/app/shared/components/button-column/button-column-output.component';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SalesListComponent } from '../../sales/sales-list/sales-list.component';
import { DatePipe } from "@angular/common";
import { ReservationsModalComponent } from '../reservations-modal/reservations-modal.component';
import { ReservationsDetailComponent } from '../reservations-detail/reservations-detail.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { secondFormatDateToDate, secondFormatDateTofirstFormatDate, thirdFormatDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-reservations-modal-list',
  templateUrl: './reservations-modal-list.component.html',
  styleUrls: ['./reservations-modal-list.component.css']
})
export class ReservationsModalListComponent extends BasePage implements OnInit {

  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  idInCharge: any;
  infoUser: number = 0;
  totalItems: number = 0;
  idAloja: number = 0;
  filter?: boolean;
  idHab?: number;
  buttonCancel?: boolean;
  reserv: any;
  constructor(
    private bedroomService: BedroomsService,
    private reservationsService: ReservationsService,
    private inChargeService: InChargeService,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private datePipe: DatePipe,
  ) {
    super();
  }

  ngOnInit() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllReservations());
  }

  increase(event: IReservations) {
    console.log(event.horaSalida);
    if (event.horaSalida && event.compania == 'LIBRE') {
      this.alert('success', `Limpieza registrada satisfactoriamente.`, '');
      return;
    } else if (event.horaSalida) {
      let hab: any = event.habitaciones;
      this.alertQuestion(
        'warning',
        `¿La habitación  No. ${hab.noHabitacion} ${hab.preferencias} esta limpio?`,
        '',
        'SI, ya esta',
        'NO, falta'
      ).then(question => {
        if (question.isConfirmed) {
          this.updateBedroom('LIBRE', event.habitacionId);
          this.updateReservation(event.id);
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getAllReservations());
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        }
      });
    } else {
      let hab1: any = event.habitaciones;
      this.alert('warning', `La habitacion ${hab1.noHabitacion} - ${hab1.preferencias} sigue OCUPADO`, '');
      return;
    }
    //this.openModalIncrease(event);
  }

  updateBedroom(state: string, idHab: number) {
    this.loading = true;
    let body = {
      estado: state
    }
    this.bedroomService
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

  updateReservation(idReser: number) {
    let body = {
      compania: 'LIBRE'
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


  async getAllReservations(idAloja?: number) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(this.filter, this.idHab);

    if (this.filter && this.idHab) {
      this.reservationsService.getIdBedroomReser(this.idHab).subscribe({
        next: response => {
          console.log(response);
          this.reserv = response.data;
          this.data.load(response.data);
          this.data.refresh();
          //this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          (this.loading = false);
          this.data.load([]);
          if (error.status == 403) {
            this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
          } else {
            //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
          }
        }
      });
    } else {
      if (idAloja) {
        params['filter.alojamientoId'] = `$eq:${idAloja}`;
      } else {
        let inCharge: any = await this.validInCharge(this.infoUser);
        this.idInCharge = inCharge.data[0].alojamientoId;
        console.log(this.idInCharge);
        params['filter.alojamientoId'] = `$eq:${this.idInCharge}`;
      }

      this.reservationsService.getAll(params).subscribe({
        next: response => {
          console.log(response);
          this.reserv = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          (this.loading = false);
          this.data.load([]);
          if (error.status == 403) {
            this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
          } else {
            //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
          }
        }
      });
    }

  }
  async validInCharge(idUser: number) {
    const params = new ListParams();
    params['filter.userId'] = `$eq:${idUser}`;
    return new Promise((resolve, reject) => {
      this.inChargeService.getAll(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }


  sales(event: IReservations) {
    console.log(event);
    this.openModalSales(event);
  }

  openModalSales(reservations?: IReservations) {
    const idAloja = this.idAloja;
    console.log(idAloja);
    let config: ModalOptions = {
      initialState: {
        reservations,
        idAloja,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SalesListComponent, config);
  }


  output(event: any) {
    console.log(event);
    if (event.horaSalida) {
      this.alert('success', 'Ya se regisro la hora de salida', '');
      return;
    } else {

      if (event.fecha === event.fechaSalida) {
        this.openModalIncrease(event);
      } else {
        let time = this.currentTime();
        const validate = this.contarHorasDespuesDeMediodia(time, event.horaProgramada, event.fecha);
        if (validate > 4) {
          this.alertQuestion(
            'warning',
            'El cliente se paso mas de 4 Horas ¿se le asignara un dia mas?',
            ''
          ).then(question => {
            if (question.isConfirmed) {
              this.updateBedroom('LIBRE', event.habitacionId);
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getAllReservations());
              //this.openModal();
            }
          });
        } else if (validate <= 4) {
          this.openModalIncrease(event, validate);
        } else {
          /*const errTime = this.contarHorasDespuesDeMediodia(time, event.horaEntrada);
          if (errTime == 0) {
            this.alert('error', `Fuera de rango de horarios ${time} debe ser mayor a ${event.horaEntrada}`, ``);
            return;
          } else {
            this.openModalIncrease(event);
          }*/
          this.openModalIncrease(event);
        }
      }
    }
  }


  currentTime() {
    const currentTime = new Date();
    let newHours = currentTime.getHours();
    const newMinutes = currentTime.getMinutes();
    const newModifier = newHours >= 12 ? 'pm' : 'am';
    newHours = newHours % 12 || 12; // Si es 0, se convierte a 12
    // Formatear los minutos con dos dígitos
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    const formattTime = `${newHours}:${formattedMinutes} ${newModifier}`;
    return formattTime;
  }

  openModalIncrease(reservations?: IReservations, valid?: number) {
    let validTime = 0;
    if (valid) {
      validTime = valid;
    }
    let config: ModalOptions = {
      initialState: {
        reservations,
        validTime,
        callback: (next: boolean) => {
          if (next) {
            this.getAllReservations();
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ReservationsModalComponent, config);
  }


  contarHorasDespuesDeMediodia(horaActual: string, horaProgra: string, fecha: string): number {
    console.log(horaActual, horaProgra);
    const actu = this.convertirHora12a24(horaActual);
    const progra24 = this.convertirHora12a24(horaProgra);
    console.log(actu);
    const [horas, minutos] = actu.split(':').map(Number);
    const [horasProgra, minutosProgra] = progra24.split(':').map(Number);
    const progra = new Date(fecha);
    progra.setDate(progra.getDate() + 1); // mañana
    progra.setHours(12, 0, 0, 0);
    //progra.setHours(horasProgra, minutosProgra, 0, 0);
    const horaActualDate = new Date();
    horaActualDate.setHours(horas, minutos, 0, 0);
    console.log(progra, horaActualDate, horas, minutos);
    const finRangoConTolerancia = new Date(progra.getTime() + 15 * 60 * 1000);
    if (horaActualDate <= finRangoConTolerancia) {
      return 0;
    }
    const diferencia = (horaActualDate.getTime() - finRangoConTolerancia.getTime()) / (1000 * 60 * 60);
    return Math.abs(Math.floor(diferencia));
  }

  convertirHora12a24(hora12: string): string {
    const [hora, minutoYPeriodo] = hora12.split(':');
    const [minuto, periodo] = minutoYPeriodo.split(' ');
    let h = parseInt(hora, 10);
    const m = parseInt(minuto, 10);

    if (periodo.toLowerCase() === 'pm' && h < 12) {
      h += 12;
    }
    if (periodo.toLowerCase() === 'am' && h === 12) {
      h = 0;
    }

    const horaStr = h < 10 ? `0${h}` : `${h}`;
    const minutoStr = m < 10 ? `0${m}` : `${m}`;
    return `${horaStr}:${minutoStr}`;
  }


  openModal(reservations?: IReservations) {
    const idAloja = this.idAloja;
    let config: ModalOptions = {
      initialState: {
        reservations,
        idAloja,
        callback: (next: boolean) => {
          if (next) {
            this.getAllReservations(this.idAloja);
            //this.getAllBedrooms(this.alojaIdRole);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ReservationsDetailComponent, config);
  }


  showDeleteAlert(reservarions: IReservations) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(reservarions.id);
        //Swal.fire('Borrado', '', 'success');
        this.updateBedroom('LIBRE', reservarions.habitacionId);
        this.updateReservation(reservarions.id);
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllReservations());
        this.modalRef.content.callback(true);
        this.modalRef.hide();
      }
    });
  }


  delete(id: string | number) {
    this.reservationsService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'RESERVACIÓN', 'Borrado Correctamente');

      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }

      },
    });
  }


  edit(reservations: IReservations) {
    this.openModal(reservations);
  }

  close() {
    this.modalRef.hide();
  }


}
