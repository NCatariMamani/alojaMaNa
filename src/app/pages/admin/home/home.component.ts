import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared';
import { AFFAIR_COLUMNS } from './columns';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  ListParamsFather,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParamsFather>(new ListParams());
  data1: any = [];
  totalItems: number = 0;
  constructor(
    private router: Router
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
      columns: { ...AFFAIR_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.openData();
    this.data.load(this.data1);
    this.data.refresh();
    this.loading = false;
    this.totalItems = this.data1.length;
  }


  openForm() {

  }

  openData(){
    this.data1 = [
      {
        id: 1,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },
      {
        id: 2,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 1,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 3,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 4,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 5,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 6,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 7,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 8,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 9,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 10,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },{
        id: 11,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      },
      {
        id: 12,
        description: 'hola mundo',
        processDetonate: 'pruebas'
      }
    ]
  }

}
