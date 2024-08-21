import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IInCharge } from 'src/app/core/models/catalogs/inCharge.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { InChargeService } from 'src/app/core/services/catalogs/inCharge.service';
import { UsersService } from 'src/app/core/services/catalogs/users.service';
import { BasePage } from 'src/app/core/shared';
import { DOUBLE_POSITIVE_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-inCharge-detail',
  templateUrl: './inCharge-detail.component.html',
  styleUrls: ['./inCharge-detail.component.css']
})
export class InChargeDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'ENCARGADO';
  status: string = 'Nuevo';
  edit: boolean = false;
  editDate?: Date;
  maxDate: Date = new Date();
  inCharges?: IInCharge;
  user: number = 0;

  accomodations = new DefaultSelect();
  users = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private usersService: UsersService,
    private inChargeService: InChargeService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      paterno: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      materno: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      ci: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      ext: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      celular: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      alojamientoId: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      userId: [this.user, [Validators.required, Validators.pattern(STRING_PATTERN)]]
    });
    this.form.controls['userId'].disable();
    if (this.inCharges != null) {
      this.edit = true;
      this.form.patchValue(this.inCharges);
    }
    setTimeout(() => {
      this.getAccomodation(new ListParams());
      this.getUsers(new ListParams());
    }, 1000);
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
      ci: Number(this.form.controls['ci'].getRawValue()),
      ext: this.form.controls['ext'].getRawValue(),
      celular: Number(this.form.controls['celular'].getRawValue()),
      alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
      userId: Number(this.form.controls['userId'].getRawValue()),
    }
    this.inChargeService.create(body).subscribe({
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
    if (this.inCharges) {
      this.loading = true;   
      let body = {
        nombre: this.form.controls['nombre'].getRawValue(),
        paterno: this.form.controls['paterno'].getRawValue(),
        materno: this.form.controls['materno'].getRawValue(),
        ci: Number(this.form.controls['ci'].getRawValue()),
        ext: this.form.controls['ext'].getRawValue(),
        celular: Number(this.form.controls['celular'].getRawValue()),
        alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
        userId: Number(this.form.controls['userId'].getRawValue()),
      }
      this.inChargeService
        .update(this.inCharges.id, body)
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

  getAccomodation(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.accomodationService.getAll(params).subscribe({
      next: data => {
        this.accomodations = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.accomodations = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeAccomodation(event: any){
    console.log(event);
  }

  getUsers(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.usersService.getAll(params).subscribe({
      next: data => {
        this.users = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.users = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  onChangeUsers(event: any){
    console.log(event);
  }


  validateDate(event: any){
    if(event){
      this.editDate = event;
    }
  }

}
