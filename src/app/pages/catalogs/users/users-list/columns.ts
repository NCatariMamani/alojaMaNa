import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { CustomDateFilterComponent } from "src/app/shared/utils/custom-date-filter";


export const USERS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    email: {
        title: 'Email',
        sort: false,
    },
    password: {
        title: 'Contraseña',
        sort: false,
    },
};
