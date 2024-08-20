import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";

export const ACCOMMODATIONS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    nombre: {
        title: 'Nombre de Alojamiento',
        sort: false,
    },
    noHabitaciones: {
        title: 'No. Habitación',
        sort: false,
    },
    direccion: {
        title: 'Dirección',
        sort: false,
    },
};


export const BEDROOMS_COLUMNS = {
    id: {
        title: 'ID',
        sort: false,
        width: '10%',
    },
    noHabitacion: {
        title: 'No. Habitación',
        sort: false,
        width: '10%',
    },
    
    preferencias: {
        title: 'Preferencias',
        sort: false,
    },
    estado: {
        title: 'Estado',
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
