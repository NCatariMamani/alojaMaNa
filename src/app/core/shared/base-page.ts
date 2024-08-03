import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { ClassWidthAlert } from "./alert-class";
import { BehaviorSubject, Subject } from "rxjs";
import { ListParams } from "src/app/common/repository/interfaces/list-params";
import { SweetAlertIcon } from "sweetalert2";
import { HttpErrorResponse } from '@angular/common/http';


interface TableSettings {
    selectMode: string;
    actions: any;
    attr: Object;
    pager: Object;
    hideSubHeader: boolean;
    mode: string;
    add: Object;
    edit: Object;
    delete: Object;
    columns: Object;
    noDataMessage: string;
    selectedRowIndex?: number;
    rowClassFunction?: any;
}

export const TABLE_SETTINGS: TableSettings = {
    selectMode: '',
    selectedRowIndex: -1,
    actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: true,
        edit: true,
        delete: false,
    },
    attr: {
        class: 'table-bordered',
    },
    pager: {
        display: false,
    },
    hideSubHeader: true,
    mode: 'external',
    add: {},
    edit: {
        editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
    },
    delete: {
        deleteButtonContent: '<i class="fa fa-trash text-danger mx-2"></i>',
        confirmDelete: true,
    },
    columns: {},
    noDataMessage: 'No se encontraron registros',
    rowClassFunction: (row: any) => { },
};

@Component({
    template: '',
})

export abstract class BasePage
    extends ClassWidthAlert
    implements OnDestroy, AfterViewInit {
    loading: boolean = false;
    $unSubscribe = new Subject<void>();
    settings = { ...TABLE_SETTINGS };

    //private _showHide = inject(showHideErrorInterceptorService);

    ngOnDestroy(): void {
        this.$unSubscribe.next();
        this.$unSubscribe.complete();
        //this._showHide.blockAllErrors = false;
    }

    ngAfterViewInit(): void {

    }

    protected pageFilter(params: BehaviorSubject<ListParams>) {
        if (params.getValue().page > 1) {
            const paramsP = params.getValue();
            paramsP.page = 1;
            params.next(paramsP);
        }
        return params;
    }


    protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
        this.alert(icon, title, text);
        // ? Se ha reemplazado lost toast por sweet alert
        // const throwToast = {
        //   success: (title: string, text: string) =>
        //     this._toastrService.success(text, title),
        //   info: (title: string, text: string) =>
        //     this._toastrService.info(text, title),
        //   warning: (title: string, text: string) =>
        //     this._toastrService.warning(text, title),
        //   error: (title: string, text: string) =>
        //     this._toastrService.error(text, title),
        //   question: (title: string, text: string) =>
        //     this._toastrService.info(text, title),
        // };
        // return throwToast[icon](title, text);
      }


      protected returnParseDate(data: any) {
        let fechaString = '';
        // Obtener los componentes de la fecha
        if (data !== '') {
          console.log(data);
          const año = data.getFullYear().toString();
          const mes = (data.getMonth() + 1).toString().padStart(2, '0');
          const dia = data.getDate().toString().padStart(2, '0');
    
          // Crear la cadena de texto en formato "año mes día"
          fechaString = `${año}-${mes}-${dia}`;
        }
        return fechaString;
      }

}

