import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { ClassWidthAlert } from "./alert-class";
import { Subject } from "rxjs";

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

}

