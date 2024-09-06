import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";

export const INPUT_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },

    descripcion: {
        title: 'Descripción',
        sort: false,
    },

    cantidad: {
        title: 'Cantidad',
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
    }
};