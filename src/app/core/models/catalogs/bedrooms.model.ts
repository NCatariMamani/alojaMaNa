import { IAccommodation } from "./accommodation.model";
import { IReservations } from "./reservations.model";

export interface IBedroom {
    id: number;
    noHabitacion: number;
    preferencias: string;
    estado: string;
    reservaciones: IReservations[];
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }