import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const ACCOMMODATIONS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    nombre: {
        title: 'Nombre de Alojamiento',
        sort: false,
    },
    noHabitaciones: {
        title: 'No. Habitación',
        sort: false,
    },
    direccion: {
        title: 'Dirección',
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
};


export const BEDROOMS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    noHabitacion: {
        title: 'No. Habitación',
        sort: false,
    },
    
    preferencias: {
        title: 'Preferencias',
        sort: false,
    },
    estado: {
        title: 'Estado',
        sort: false,
        type: 'html',
        valuePrepareFunction: (value: string) => {
            if (value == 'LIBRE')
              return '<strong><span class="badge badge-pill bg-disable-success">LIBRE</span></strong>';
            if (value == 'SUCIO')
              return '<strong><span class="badge badge-pill badge-soft-pink">SUCIO</span></strong>';
            if (value == 'OCUPADO')
                return '<strong><span class="badge badge-pill badge-soft-info">OCUPADO</span></strong>';
            return value;
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list: [
                { value: 'LIBRE', title: 'LIBRE' },
                { value: 'SUCIO', title: 'SUCIO' },
                { value: 'OCUPADO', title: 'OCUPADO' },
              ],
            },
          },
    },
    /*alojamientos: {
        title: 'Nombre de Alojamiento',
        sort: false,
        valuePrepareFunction: (value: IAccommodation) => {
            return value?.nombre;
        },
        filterFunction(cell?: any, search?: string): boolean {
            let column = cell.nombre;
            if (typeof search !== 'string') {
                return true;
            }
            if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
                return true;
            } else {
                return false;
            }
        },
    }*/
   precioTemporal: {
        title: 'Precio Temporal',
        sort: false,
    },
    precioNoche: {
        title: 'Precio Noche',
        sort: false,
    },
};


export const INVENTORIES_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },

    descripcion: {
        title: 'Descripción',
        sort: false,
    },
    fecha: {
        title: 'Fecha',
        sort: false,
        valuePrepareFunction: (date: Date) => {
            var raw = new Date(date);
            var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
            return formatted;
        },
        filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
    },
    alojamientos: {
        title: 'Hospedaje',
        sort: false,
        valuePrepareFunction: (value: IAccommodation) => {
            return value?.nombre;
        },
        filterFunction(cell?: any, search?: string): boolean {
            let column = cell.nombre;
            if (typeof search !== 'string') {
                return true;
            }
            if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
                return true;
            } else {
                return false;
            }
        },
    },
};
