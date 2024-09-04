import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IProducts } from "src/app/core/models/catalogs/products.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const PRODUCTINVENTORY_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '7%',
    },
    productos: {
        title: 'Producto',
        sort: false,
        valuePrepareFunction: (value: IProducts) => {
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
    cantidad: {
        title: 'Cantidad',
        sort: false,
        width: '10%',
    },
    entrada: {
        title: 'Entrada',
        sort: false,
        width: '10%',
    },
    salida: {
        title: 'Salida',
        sort: false,
        width: '10%',
    },
    stock: {
        title: 'Stock',
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
    },
    alojamientos: {
        title: 'Alojamiento',
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