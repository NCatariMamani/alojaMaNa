import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { IBedroom } from 'src/app/core/models/catalogs/bedrooms.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { BedroomsService } from 'src/app/core/services/catalogs/bedrooms.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-bedrooms-detail',
  templateUrl: './bedrooms-detail.component.html',
  styleUrls: ['./bedrooms-detail.component.css']
})
export class BedroomsDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'HABITACIÓN';
  status: string = 'Nuevo';
  edit: boolean = false;
  accommodation?: IAccommodation;
  bedroom?: IBedroom;
  idAccom: number = 0;
  noHabi?: number;

  accomodations = new DefaultSelect();
  
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private bedroomService: BedroomsService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }


  private prepareForm() {
    this.form = this.fb.group({
      noHabitacion: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)]],
      preferencias: ['SIMPLE', [Validators.required]],
      estado: ['LIBRE', [Validators.required]],
      alojamientoId: [this.idAccom,[Validators.required]],
    });
    this.form.controls['alojamientoId'].disable();
    if (this.bedroom != null) {
      this.edit = true;
      console.log(this.bedroom);
      this.form.patchValue(this.bedroom);
    }
    setTimeout(() => {
      this.getAccomodation(new ListParams());
    }, 100);
    console.log(this.idAccom);
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    console.log(this.idAccom);
    let body = {
      noHabitacion: Number(this.form.controls['noHabitacion'].getRawValue()),
      preferencias: this.form.controls['preferencias'].getRawValue(),
      estado: this.form.controls['estado'].getRawValue(),
      alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue())
    }
    this.bedroomService.create(body).subscribe({
      next: resp => {
        this.handleSuccess(),
        this.loading = false
      }, error: err =>  {
        this.loading = false
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
    if (this.bedroom) {
      this.loading = true;
      let body = {
        noHabitacion: Number(this.form.controls['noHabitacion'].getRawValue()),
        preferencias: this.form.controls['preferencias'].getRawValue(),
        estado: this.form.controls['estado'].getRawValue(),
        alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue())
      }
      this.bedroomService
        .update(this.bedroom.id, body)
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

  getAccomodation(params: ListParams) {
    /*if (params.text) {
      params['filter.alojamientoId'] = `$eq:${this.idAccom}`;
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

  onChangeAccomodation(event: any){
    console.log(event);
  }




  close() {
    this.modalRef.hide();
  }

}
