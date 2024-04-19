import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared';
import { AFFAIR_COLUMNS } from './columns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent extends BasePage implements OnInit {

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
  }


  openForm(){
    
  }

}
