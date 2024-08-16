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
    }
};