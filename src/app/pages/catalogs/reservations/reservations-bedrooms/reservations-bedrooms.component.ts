import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { IReservations } from 'src/app/core/models/catalogs/reservations.model';
import { ReservationsDetailComponent } from '../reservations-detail/reservations-detail.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportPdfComponent } from '../report-pdf/report-pdf.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ReservationsModalListComponent } from '../reservations-modal-list/reservations-modal-list.component';

@Component({
  selector: 'app-reservations-bedrooms',
  templateUrl: './reservations-bedrooms.component.html',
  styleUrls: ['./reservations-bedrooms.component.css']
})


export class ReservationsBedroomsComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  columnFilters1: any = [];
  totalItems: number = 0;
  infoUser: number = 0;
  roleUser: number = 0;
  idInCharge: any;
  pdfUrl?: SafeResourceUrl;
  loadingDoc: boolean = false;
  result?: any[];
  onSelect: boolean = false;
  alojaIdRole: number = 0;
  bedroom: any;
  validation?: string;
  filterAloja: boolean = true;
  ocupado: boolean = true;

  reservarions?: IReservations;
  accomodations = new DefaultSelect<IAccommodation>();

  get selecIdAloja() {
    return this.form.get('selecAloja') as FormControl;
  }

  constructor(
    private modalService: BsModalService,
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private inChargeService: InChargeService,
    private bedroomService: BedroomsService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,

  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

   private async inicialize() {
    this.form = this.fb.group({
      selecAloja: [null, [Validators.required]],
    });
    const info = this.authService.getUserInfo();
    this.infoUser = info.id;
    this.roleUser = info.role;
    if (info.role == 3) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getAllReservations());
      let inCharge: any = await this.validInCharge(this.infoUser);
      const idAloja = inCharge.data[0].alojamientoId;
      //this.selecIdAloja.setValue(idAloja);
      this.alojaIdRole = idAloja;
      this.getAllBedrooms(idAloja);
    } else {
      this.onSelect = true;
      let inCharge1: any = await this.validInCharge(this.infoUser);
      const idAloja1 = inCharge1.data[0].alojamientoId;
      this.selecIdAloja.setValue(idAloja1);
      this.getAccomodation(new ListParams());
      this.getAllBedrooms(idAloja1);
      this.alojaIdRole = idAloja1;
    }

    //console.log(this.infoUser,this.roleUser);
  }

  getAccomodation(params: ListParams) {
    if (params.text) {
      const valid = Number(params.text);
      if (!isNaN(valid)) {
        // Si es un número
        params['filter.id'] = `$eq:${params.text}`;
      } else {
        // Si es un string
        params['filter.nombre'] = `$ilike:${params.text}`;
      }
    }
    this.accomodationService.getAll(params).subscribe({
      next: data => {
        this.result = data.data.map(async (item: any) => {
          item['idName'] = item.id + ' - ' + item.nombre;
        });
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

   getAllBedrooms(idAloja: number) {
    this.loading = true;
    this.bedroom = [];
    console.log(idAloja);
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
      limit: 50
    };
    if (idAloja) {
      params['filter.alojamientoId'] = `$eq:${idAloja}`;
    }
    //params1['filter.alojamientoId'] = `$eq:${this.idInCharge}`
    this.bedroomService.getAll(params).subscribe({
      next: response => {
        this.bedroom = response.data;
        console.log(this.bedroom);
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
    }
    );
  }

  async getAllReservations(idAloja?: number) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
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

  onChangeAccomodation(event: any) {
    console.log(event);
    if (event) {
      this.alojaIdRole = event.id;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getAllReservations(event.id));
      const idAloja1 = event.id;
      console.log(idAloja1);
      this.getAllBedrooms(idAloja1);
    }
  }

  openModalPDF(dates?: any) {
    let idAloja;
    if (this.alojaIdRole != 0) {
      idAloja = this.alojaIdRole;
    } else {
      idAloja = this.idInCharge;
    }
    let config: ModalOptions = {
      initialState: {
        idAloja,
        callback: (next: boolean) => {
          if (next) {
            this.getAllReservations(this.alojaIdRole);
            this.getAllBedrooms(this.alojaIdRole);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
      animated: false,
    };
    this.modalService.show(ReportPdfComponent, config);
  }

   openModalCreate(idHab?: number, pref?: string) {
    const idAloja = this.alojaIdRole;
    const idHabita = idHab;
    const prefeHab = pref;
    let config: ModalOptions = {
      initialState: {
        idAloja,
        idHabita,
        prefeHab,
        callback: (next: boolean) => {
          if (next) {
            this.getAllReservations(this.alojaIdRole);
            this.getAllBedrooms(this.alojaIdRole);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
      animated: false,
    };
    this.modalService.show(ReservationsDetailComponent, config);
  }

  openModalList(event: number) {
    const buttonCancel = true;
    let idHab = event;
    let idAloja;
    let filter = this.filterAloja;
    if (this.alojaIdRole != 0) {
      idAloja = this.alojaIdRole;
    } else {
      idAloja = this.idInCharge;
    }
    let config: ModalOptions = {
      initialState: {
        idAloja,
        filter,
        idHab,
        buttonCancel,
        callback: (next: boolean) => {
          if (next) {
            this.getAllReservations(this.alojaIdRole);
            this.getAllBedrooms(this.alojaIdRole);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
      animated: false,
    };
    this.modalService.show(ReservationsModalListComponent, config);
  }

}








