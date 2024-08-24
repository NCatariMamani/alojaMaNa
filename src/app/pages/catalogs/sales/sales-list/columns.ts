import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IReservations } from "src/app/core/models/catalogs/reservations.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";


export const SALES_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    reservaciones: {
        title: 'Nombre de la Reservación',
        sort: false,
        valuePrepareFunction: (value: IReservations) => {
            return `${value?.nombre} ${value?.paterno} ${value?.materno}`;
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
    }
};
