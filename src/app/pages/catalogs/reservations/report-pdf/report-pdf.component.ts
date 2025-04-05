import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ReservationsService } from 'src/app/core/services/catalogs/reservations.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-report-pdf',
  templateUrl: './report-pdf.component.html',
  styleUrls: ['./report-pdf.component.css']
})
export class ReportPdfComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  title: string = 'VENTA';
  status: string = 'Nuevo';
  edit: boolean = false;
  maxDate: Date = new Date();
  minDate?: Date;
  idAloja: number = 0;
  dates: any;
  loadingDoc: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private reservationsService: ReservationsService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      fechaIni: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
    });
    this.form.controls['fechaFin'].disable();

    console.log(this.idAloja);

    setTimeout(() => {
      //this.getReservation(new ListParams());
    }, 100);
  }


  confirm() {
    //this.edit ? this.update() : this.create();
    this.downloadPDF();
  }

  close() {
    this.modalRef.hide();
  }

  validateDate(event: any) {
    if (event) {
      this.minDate = event;
      this.form.controls['fechaFin'].enable();
      //this.editDate = event;
      //this.form.controls['descripcion'].setValue(this.editDate);
    }
  }

  downloadPDF() {
    let body = {
      fechaIni: this.form.controls['fechaIni'].getRawValue(),
      fechaFin: this.form.controls['fechaFin'].getRawValue(),
      idAloja: this.idAloja
    }
    this.reservationsService.getPdf(body).subscribe({
      next: response => {
        /*console.log(response);
      const blob = new Blob([response], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);*/
        console.log('entraste');
        const blob = new Blob([response], { type: 'application/pdf' });
        console.log(response);
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => { },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
        this.loadingDoc = false;
      },
      error: error => {
        (this.loading = false);
        //this.data.load([]);
        if (error.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else if (error.status == 500) {
          this.alert('warning', 'No existe datos para mostrar en PDF', '');
        } else {
          this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      }
    });
  }

}
