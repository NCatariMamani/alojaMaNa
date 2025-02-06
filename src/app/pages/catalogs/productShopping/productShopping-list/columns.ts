import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IProducts } from "src/app/core/models/catalogs/products.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const PRODUCTSHOPPING_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    alojamientos: {
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
    },
    productos: {
        title: 'Nombre de Productos',
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
    }
};