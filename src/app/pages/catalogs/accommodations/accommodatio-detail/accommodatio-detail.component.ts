import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-accommodatio-detail',
  templateUrl: './accommodatio-detail.component.html',
  styleUrls: ['./accommodatio-detail.component.css']
})
export class AccommodatioDetailComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: string = 'ALOJAMIENTO';
  status: string = 'Nuevo';
  edit: boolean = false;
  accommodation?: IAccommodation;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }


  private prepareForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.pattern(STRING_PATTERN), Validators.maxLength(100)]],
      noHabitaciones: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],
      departamento: [null, [Validators.required]]
    });
    if (this.accommodation != null) {
      this.edit = true;
      console.log(this.accommodation);
      this.form.patchValue(this.accommodation);
    }
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let body = {
      nombre: this.form.controls['nombre'].getRawValue(),
      noHabitaciones: Number(this.form.controls['noHabitaciones'].getRawValue()),
      direccion: this.form.controls['direccion'].getRawValue(),
      departamento: this.form.controls['departamento'].getRawValue()
    }
    this.accomodationService.create(body).subscribe({
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
    if (this.accommodation) {
      this.loading = true;
      let body = {
        nombre: this.form.controls['nombre'].getRawValue(),
        noHabitaciones: Number(this.form.controls['noHabitaciones'].getRawValue()),
        direccion: this.form.controls['direccion'].getRawValue(),
        departamento: this.form.controls['departamento'].getRawValue()
      }
      this.accomodationService
        .update(this.accommodation.id, body)
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

}
