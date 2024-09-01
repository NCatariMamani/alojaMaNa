import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const PRODUCTS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    nombre: {
        title: 'Nombre',
        sort: false,
    },
    precio: {
        title: 'Precio',
        sort: false,
    },
    departamento: {
        title: 'Departamento',
        sort: false,
        type: 'html',
        valuePrepareFunction: (value: string) => {
            if (value == 'LP')
              return '<strong><span class="badge badge-pill badge-soft-info">LA PAZ</span></strong>';
            if (value == 'OR')
              return '<strong><span class="badge badge-pill badge-soft-pink">ORURO</span></strong>';
            if (value == 'PT')
                return '<strong><span class="badge badge-pill bg-info0">POTOSI</span></strong>';
            if (value == 'CBBA')
                return '<strong><span class="badge badge-pill bg-info1">COCHABAMBA</span></strong>';
            if (value == 'CH')
                return '<strong><span class="badge badge-pill bg-info2">CHUQUISACA</span></strong>';
            if (value == 'TJA')
                return '<strong><span class="badge badge-pill bg-info3">TARIJA</span></strong>';
            if (value == 'SCZ')
                return '<strong><span class="badge badge-pill bg-info4">SANTA CRUZ</span></strong>';
            if (value == 'BE')
                return '<strong><span class="badge badge-pill bg-info5">BENI</span></strong>';
            if (value == 'PD')
                return '<strong><span class="badge badge-pill bg-info6">PANDO</span></strong>';
            return value;
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list: [
                { value: 'LP', title: 'LA PAZ' },
                { value: 'OR', title: 'ORURO' },
                { value: 'PT', title: 'POTOSI' },
                { value: 'CBBA', title: 'COCHABAMBA' },
                { value: 'CH', title: 'CHUQUISACA' },
                { value: 'TJA', title: 'TARIJA' },
                { value: 'SCZ', title: 'SANTA CRUZ' },
                { value: 'BE', title: 'BENI' },
                { value: 'PD', title: 'PANDO' },
              ],
            },
          },
    },
    estado: {
        title: 'Precio',
        sort: false,
        type: 'html',
        valuePrepareFunction: (value: string) => {
            if (value == 'SR')
              return '<strong><span class="badge badge-pill badge-soft-pink">SIN REGISTRAR</span></strong>';
            if (value == 'R')
              return '<strong><span class="badge badge-pill bg-disable-success">REGISTRADO</span></strong>';
            return value;
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list: [
                { value: 'SR', title: 'SIN REGISTRAR' },
                { value: 'R', title: 'REGISTRADO' }
              ],
            },
          },
    }
};