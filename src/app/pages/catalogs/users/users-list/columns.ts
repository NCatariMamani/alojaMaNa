import { DatePipe } from "@angular/common";
import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";
import { IUser } from "src/app/core/models/catalogs/users.model";
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
        width: '80%',
    },
    /*password: {
        title: 'Contraseña',
        sort: false,
    },*/
};

export const INCHARGE_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '7%',
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
    ci: {
        title: 'CI',
        sort: false,
    },
    ext: {
        title: 'Extención',
        sort: false,
    },
    celular: {
        title: 'Celular',
        sort: false,
    },
    alojamiento: {
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
    /*user: {
        title: 'Usuario',
        sort: false,
        valuePrepareFunction: (value: IUser) => {
            return value?.email;
        },
        filterFunction(cell?: any, search?: string): boolean {
            let column = cell.email;
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
