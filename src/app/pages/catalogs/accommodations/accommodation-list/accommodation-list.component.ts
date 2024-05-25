import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams, ListParamsFather } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ACCOMMODATIONS_COLUMNS } from './columns';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AccommodatioDetailComponent } from '../accommodatio-detail/accommodatio-detail.component';

@Component({
  selector: 'app-accommodation-list',
  templateUrl: './accommodation-list.component.html',
  styleUrls: ['./accommodation-list.component.css']
})
export class AccommodationListComponent  extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParamsFather>(new ListParams());
  data1: any = [];
  totalItems: number = 0;
  constructor(
    private modalService: BsModalService,
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
      columns: { ...ACCOMMODATIONS_COLUMNS },
    };
  }

  ngOnInit() {
  }


  openForm() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {
          if (next) this.getAffairAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AccommodatioDetailComponent, config);
  }

  getAffairAll(){

  }

}
