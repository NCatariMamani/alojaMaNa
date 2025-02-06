import { IAccommodation } from "src/app/core/models/catalogs/accommodation.model";

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
        type: 'html',
        valuePrepareFunction: (value: string) => {
            if (value == 'OCUPADO')
              return '<strong><span class="badge badge-pill bg-info6">OCUPADO</span></strong>';
            if (value == 'SUCIO')
              return '<strong><span class="badge badge-pill badge-soft-pink">SUCIO</span></strong>';
            if (value == 'LIBRE')
                return '<strong><span class="badge badge-pill bg-disable-success">LIBRE</span></strong>';
            return value;
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list: [
                { value: 'OCUPADO', title: 'OCUPADO' },
                { value: 'SUCIO', title: 'SUCIO' },
                { value: 'LIBRE', title: 'LIBRE' },
              ],
            },
          },
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