import { IAccommodation } from "./accommodation.model";

export interface IBedroom {
    id: number;
    noHabitacion: number;
    preferencias: string;
    estado: string;
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }