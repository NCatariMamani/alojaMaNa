import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { OutputService } from 'src/app/core/services/catalogs/output.service';
import { BasePage } from 'src/app/core/shared';
import { OUTPUT_COLUMNS } from './columns';
import { IOutput } from 'src/app/core/models/catalogs/output.model';
import { OutputModalComponent } from '../output-modal/output-modal.component';
import { IProductInventory } from 'src/app/core/models/catalogs/productInventory.model';

@Component({
  selector: 'app-output-list',
  templateUrl: './output-list.component.html',
  styleUrls: ['./output-list.component.css']
})
export class OutputListComponent extends BasePage implements OnInit {

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: any = [];
  columnFilters: any = [];
  totalItems: number = 0;
  productInventory?: IProductInventory;
  constructor(
    private modalService: BsModalService,
    private outputService: OutputService,
    private modalRef: BsModalRef

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
      columns: { ...OUTPUT_COLUMNS },
    };
  }

  ngOnInit() {
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
              case 'fecha':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;   
              case 'alojamientos':
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
          this.getAllOutput();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllOutput());

  }

  getAllOutput() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.productInventory) {
      params['filter.productoInventarioId'] = `$eq:${this.productInventory.id}`;
    }
    this.outputService.getAll(params).subscribe({
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
    }

    );
  }

  edit(input: IOutput) {
    this.openModal(input);
  }


  openModal(inventories?: IOutput) {
    let config: ModalOptions = {
      initialState: {
        inventories,
        callback: (next: boolean) => {
          if (next) this.getAllOutput();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OutputModalComponent, config);
  }

  showDeleteAlert(input: IOutput) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {

        this.delete(input.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string | number) {
    this.outputService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Inventario', 'Borrado Correctamente');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllOutput());
      }, error: err => {
        if (err.status == 403) {
          this.alert('error', 'No puede realizar esta acción', `Usted no cuenta con los permisos necesarios`);
        } else {
          //this.alert('error', 'No se logro Eliminar', 'Existe una relacion');
        }
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

}
