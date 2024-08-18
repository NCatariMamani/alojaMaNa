import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IBedroom } from "src/app/core/models/catalogs/bedrooms.model";
import { IInCharge } from "src/app/core/models/catalogs/inCharge.model";
import { IProducts } from "src/app/core/models/catalogs/products.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const RESERVATIONS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    nombre: {
        title: 'Nombre',
        sort: false,
    },
    paterno: {
        title: 'Paterno',
        sort: false,
    },
    materno: {
        title: 'Materno',
        sort: false,
    },
    edad: {
        title: 'Edad',
        sort: false,
    },
    ci: {
        title: 'CI',
        sort: false,
    },
    extencion: {
        title: 'Extención',
        sort: false,
    },
    nombreA: {
        title: 'Nombre Pareja',
        sort: false,
    },
    paternoA: {
        title: 'Paterno Pareja',
        sort: false,
    },
    maternoA: {
        title: 'Materno Pareja',
        sort: false,
    },
    edadA: {
        title: 'Edad Pareja',
        sort: false,
    },
    ciA: {
        title: 'Ci Pareja',
        sort: false,
    },
    extencionA: {
        title: 'Ectención Pareja',
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
    horaEntrada: {
        title: 'Hora Entrada',
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
    compania: {
        title: 'Compañia',
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
    habitaciones: {
        title: 'Habitación',
        sort: false,
        valuePrepareFunction: (value: IBedroom) => {
            return value?.noHabitacion;
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
    encargados: {
        title: 'Encargado',
        sort: false,
        valuePrepareFunction: (value: IInCharge) => {
            return value?.nombre;
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
    }
};