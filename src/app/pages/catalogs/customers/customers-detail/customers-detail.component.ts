import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { AccomodationService } from 'src/app/core/services/catalogs/accomodation.service';
import { CustomersService } from 'src/app/core/services/catalogs/customers.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-customers-detail',
  templateUrl: './customers-detail.component.html',
  styleUrls: ['./customers-detail.component.css']
})
export class CustomersDetailComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'CLIENTE';
  customer?: ICustomer;
  edit: boolean = false;
  accomodations = new DefaultSelect();
  result?: any[];
  
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accomodationService: AccomodationService,
    private customersService: CustomersService
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
      ci: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      extencion: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      alojamientoId: [null, [Validators.required]]
    });
    //this.form.controls['userId'].disable();
    if (this.customer != null) {
      this.edit = true;
      this.form.patchValue(this.customer);
    }
    setTimeout(() => {
      this.getAccomodation(new ListParams());
    }, 500);
  }


  confirm() {
    this.edit ? this.update() : this.create();
  }


  create() {
    this.loading = true;
    let body = this.form.getRawValue();
    this.customersService.create(body).subscribe({
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
    if (this.customer) {
      this.loading = true;
      let body = this.form.getRawValue();
      this.customersService
        .update(this.customer.id, body)
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


  getAccomodation(params: ListParams) {
    if (params.text) {
      params['filter.nombre'] = `$ilike:${params.text}`;
    }
    this.accomodationService.getAll(params).subscribe({
      next: data => {
        this.result = data.data.map(async (item: any) => {
          item['nomDir'] = item.nombre + ' - ' + item.direccion;
        });
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

  close() {
    this.modalRef.hide();
  }

}
