import { IAccommodation } from "./accommodation.model";

export interface IInventories {
    id: number;
    descripcion: string;
    fecha: string;
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }