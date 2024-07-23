import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
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
  ) {
    super();
   }

  ngOnInit() {
    this.prepareForm();
  }


  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      nombreA: [null,[Validators.required, Validators.pattern(STRING_PATTERN), Validators.maxLength(100)]],
      canthabitacion: [null,[Validators.required,Validators.pattern(NUMBERS_PATTERN),Validators.maxLength(10)]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],
    });
    if (this.accommodation != null) {
      this.edit = true;
      this.form.patchValue(this.accommodation);
    }
  }


  confirm(){

  }
  close(){
    this.modalRef.hide();
  }

}
