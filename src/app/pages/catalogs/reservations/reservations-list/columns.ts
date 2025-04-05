import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IBedroom } from "src/app/core/models/catalogs/bedrooms.model";
import { ICustomer } from "src/app/core/models/catalogs/customer.model";
import { IInCharge } from "src/app/core/models/catalogs/inCharge.model";
import { IProducts } from "src/app/core/models/catalogs/products.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const RESERVATIONS_COLUMNS = { 
    habitaciones: {
        title: 'No. Habitación',
        sort: false,
        width: '6%',
        valuePrepareFunction: (value: IBedroom) => {
            return `${value?.noHabitacion} ${value?.preferencias}`;
        },
        filterFunction(cell?: any, search?: string): boolean {
            let column = cell.noHabitacion;
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
    clientes: {
        title: 'Cliente',
        sort: false,
        valuePrepareFunction: (value: ICustomer) => {
            return `${value?.nombre} ${value?.paterno} ${value?.materno} ${value?.ci} ${value?.extencion}`;
        },
        filterFunction(cell?: any, search?: string): boolean {
            let column = `${cell.nombre} ${cell.paterno} ${cell.materno} ${cell?.ci} ${cell?.extencion}`;
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
    horaEntrada: {
        title: 'Hora Entrada',
        sort: false,
    },
    horaProgramada: {
        title: 'Hora Programada',
        sort: false,
    },
    horaSalida: {
        title: 'Hora Salida',
        sort: false,
    },
    tiempo: {
        title: 'Tiempo',
        sort: false,
    },
    costoHabitacion: {
        title: 'Costo Habitación',
        sort: false,
    },
    costoExtra: {
        title: 'Costo Extra',
        sort: false,
    },
    total: {
        title: 'Total',
        sort: false,
    },
    cambio: {
        title: 'Cambio',
        sort: false,
    },
    estadoCambio: {
        title: 'Estado de Cambio',
        sort: false,
        type: 'html',
        valuePrepareFunction: (value: string) => {
            if (value == 'E')
              return '<strong><span class="badge badge-pill bg-disable-success">ENTREGADO</span></strong>';
            if (value == 'P')
              return '<strong><span class="badge badge-pill badge-soft-pink">PENDIENTE</span></strong>';
            return value;
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list: [
                { value: 'E', title: 'ENTREGADO' },
                { value: 'P', title: 'PENDIENTE' }
              ],
            },
          },
    },
    
    encargados: {
        title: 'Encargado',
        sort: false,
        valuePrepareFunction: (value: IInCharge) => {
            return `${value?.nombre} ${value?.paterno} ${value?.materno}`;
        },
        filterFunction(cell?: any, search?: string): boolean {
            let column = `${cell.nombre} ${cell.paterno} ${cell.materno}`;
            if (typeof search !== 'string') {
                return true;
            }
            if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
                return true;
            } else {
                return false;
            }
        },
    },id: {
        title: 'ID',
        sort: false,
        width: '10%',
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
    },compania: {
        title: 'Estado',
        sort: false,
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
    },*/
};