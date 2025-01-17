import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IProducts } from "src/app/core/models/catalogs/products.model";
import { IReservations } from "src/app/core/models/catalogs/reservations.model";
import { ISales } from "src/app/core/models/catalogs/sales.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";


export const PRODUCTSALES_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    ventas: {
        title: 'Fecha de Reservación',
        sort: false,
        valuePrepareFunction: (value: ISales) => {
            return value?.fecha;
        },
        filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
    },
    productos: {
        title: 'Productos',
        sort: false,
        valuePrepareFunction: (value: IProducts) => {
            return `${value?.nombre} - ${value?.precio}`;
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
    precioUni: {
        title: 'Precio Uni.',
        sort: false,
    },
    cantidad: {
        title: 'Cantidad',
        sort: false,
    },
    precioTotal: {
        title: 'Total',
        sort: false,
    }
};
