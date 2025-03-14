import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { RESERVATIONS_COLUMNS } from './columns';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { ReservationsDetailComponent } from '../reservations-detail/reservations-detail.component';
import { ButtonColumnComponent } from 'src/app/shared/components/button-column/button-column.component';
import { ButtonColumnAddComponent } from 'src/app/shared/components/button-column/button-column-add.component';
import { ButtonColumnDeleteComponent } from 'src/app/shared/components/button-column/button-column-delete.component';
import { ReservationsModalComponent } from '../reservations-modal/reservations-modal.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { ButtonColumnOutputComponent } from 'src/app/shared/components/button-column/button-column-output.component';
import { SalesListComponent } from '../../sales/sales-list/sales-list.component';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { IBedroom } from 'src/app/core/models/catalogs/bedrooms.model';
import { DatePipe } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ReportPdfComponent } from '../report-pdf/report-pdf.component';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  infoUser: number = 0;
  idInCharge: any;
  pdfUrl?: SafeResourceUrl;
  loadingDoc: boolean = false;

  reservarions?: IReservations;

  constructor(
    private modalService: BsModalService,
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private inChargeService: InChargeService,
    private bedroomService: BedroomsService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: {
        officialConclusion: {
          title: 'Aseo',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnAddComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.increase(row);
            });
          },
        },
        officialConclusion1: {
          title: 'Venta',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.sales(row);
            });
          },
        },
        officialConclusion2: {
          title: 'Salida',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnOutputComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              this.output(row);
            });
          },
        },
        ...RESERVATIONS_COLUMNS,
      },
      rowClassFunction: (row: any) => {
        let hab = row.data;
        //console.log(hab.compania);
        switch (hab.compania) {
          case 'OCUPADO':
            return 'bg-danger1';
          case 'LIBRE':
            return 'bg-success1';
          case 'SUCIO':
            return 'bg-warning1';
          default:
            return 'bg-light text-black';
        }
      },
    };
  }

  ngOnInit() {
    this.getUser();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'precio':
                searchFilter = SearchFilter.EQ;
                break;
              case 'clientes':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nombre`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAllReservations();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllReservations());


  }

  getUser() {
    const info = this.authService.getUserInfo();
    this.infoUser = info.id;
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
        }
      });
    } else {
      let hab1: any = event.habitaciones;
      this.alert('warning', `La habitacion ${hab1.noHabitacion} - ${hab1.preferencias} sigue OCUPADO`, '');
      return;
    }
    //this.openModalIncrease(event);
  }

  openModalIncrease(reservations?: IReservations) {
    let config: ModalOptions = {
      initialState: {
        reservations,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ReservationsModalComponent, config);
  }

  sales(event: IReservations) {
    console.log(event);
    this.openModalSales(event);
  }

  openModalSales(reservations?: IReservations) {
    const idAloja = this.idInCharge;
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
      let time = this.currentTime();
      const timeReset1 = new Date();
      /*const var1 = '1:20 pm';
      const var2 = '5:22 pm';
      const validate = this.contarHorasDespuesDeMediodia(var2, var1);
      console.log(validate);*/
      const time1 = new DatePipe('en-EN').transform(event.fecha, 'dd/MM/yyyy', 'UTC');
      const time2 = new DatePipe('en-EN').transform(timeReset1, 'dd/MM/yyyy', 'UTC');

      if (time1 == time2) {
        this.openModalIncrease(event);
      } else {
        const validate = this.contarHorasDespuesDeMediodia(time, event.horaProgramada);
        if (validate > 4) {
          this.alertQuestion(
            'warning',
            'El cliente se paso mas de 4 Horas ¿se le asigara un dia mas?',
            ''
          ).then(question => {
            if (question.isConfirmed) {
              this.updateBedroom('LIBRE', event.habitacionId);
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getAllReservations());
              this.openModal();
            }
          });
        } else if (validate <= 4) {
          this.openModalIncrease(event);
        } else {
          const errTime = this.contarHorasDespuesDeMediodia(time, event.horaEntrada);
          if (errTime == 0) {
            this.alert('error', `Fuera de rango de horarios ${time} debe ser mayor a ${event.horaEntrada}`, ``);
            return;
          } else {
            this.openModalIncrease(event);
          }
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

  contarHorasDespuesDeMediodia(horaActual: string, horaProgra: string): number {
    console.log(horaActual);
    const actu = this.convertirHora12a24(horaActual);
    const progra24 = this.convertirHora12a24(horaProgra);
    console.log(actu);
    const [horas, minutos] = actu.split(':').map(Number);
    const [horasProgra, minutosProgra] = progra24.split(':').map(Number);
    const progra = new Date();
    progra.setHours(horasProgra, minutosProgra, 0, 0);
    const horaActualDate = new Date();
    horaActualDate.setHours(horas, minutos, 0, 0);
    console.log(progra, horaActualDate, horas, minutos);
    if (horaActualDate <= progra) {
      return 0;
    }
    const diferencia = (progra.getTime() - horaActualDate.getTime()) / (1000 * 60 * 60);
    return Math.abs(Math.floor(diferencia));
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



  async getAllReservations() {
    this.loading = true;
    let inCharge: any = await this.validInCharge(this.infoUser);
    this.idInCharge = inCharge.data[0].alojamientoId;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(this.idInCharge);
    params['filter.alojamientoId'] = `$eq:${this.idInCharge}`;
    this.reservationsService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        (this.loading = false);
        this.data.load([]);
      }
    });
  }

  edit(reservations: IReservations) {
    this.openModal(reservations);
  }


  openModal(reservations?: IReservations) {
    let config: ModalOptions = {
      initialState: {
        reservations,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
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
      }
    });
  }

  delete(id: string | number) {
    this.reservationsService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'RESERVACIÓN', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllReservations());
      }, error: err => {
        this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
      },
    });
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
        }
      }

      );
  }

  convertdate(date1: string) {
    const date = new Date(date1);
    const day = String(date.getDate()).padStart(2, '0');  // Añade ceros al día si es menor de 10
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Los meses son 0-indexados, por eso sumamos 1
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  openModalPDF(dates?: any) {
    const idAloja = this.idInCharge;
    let config: ModalOptions = {
      initialState: {
        idAloja,
        callback: (next: boolean) => {
          if (next) this.getAllReservations();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ReportPdfComponent, config);
  }


}
