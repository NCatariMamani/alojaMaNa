import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAccommodation } from 'src/app/core/models/catalogs/accommodation.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { BasePage } from 'src/app/core/shared';
import { ShoppingService } from 'src/app/core/services/catalogs/shopping.service';
import { IShopping } from 'src/app/core/models/catalogs/shopping.model';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';


@Component({
  selector: 'app-shopping-detail',
  templateUrl: './shopping-detail.component.html',
  styleUrls: ['./shopping-detail.component.css']
})
export class ShoppingDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'COMPRAS';
  status: string = 'Nuevo';
  edit: boolean = false;
  accommodation?: IAccommodation;
  shopping?: IShopping;

  accomodations = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private shoppingService: ShoppingService,
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }
  
  private prepareForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      alojamientoId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.shopping != null) {
      this.edit = true;
      console.log(this.shopping);
      this.form.patchValue(this.shopping);
    }
    setTimeout(() => {
      this.getAccomodation(new ListParams());
    }, 1000);
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    let body = {
      fecha: this.form.controls['fecha'].getRawValue(),
      alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
    }
    this.shoppingService.create(body).subscribe({
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
    if (this.shopping) {
      this.loading = true;
      let body = {
        fecha: this.form.controls['fecha'].getRawValue(),
        alojamientoId: Number(this.form.controls['alojamientoId'].getRawValue()),
      }

      this.shoppingService
        .update(this.shopping.id, body)
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




}
