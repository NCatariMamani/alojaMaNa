import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";

export const CUSTOMERS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    nombre: {
        title: 'Nombre',
        sort: false,
        width: '10%',
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
    extencion: {
        title: 'Extención',
        sort: false,
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
    }
};