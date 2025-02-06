import { IAccommodation } from "./accommodation.model";
import { IReservations } from "./reservations.model";

export interface ICustomer {
    id: number;
    nombre: number;
    paterno: string;
    materno: string;
    ci: number;
    extencion: string;
    reservaciones: IReservations[];
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }