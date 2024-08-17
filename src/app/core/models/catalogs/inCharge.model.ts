import { IAccommodation } from "./accommodation.model";
import { IReservations } from "./reservations.model";
import { IUser } from "./users.model";

export interface IInCharge {
    id: number;
    nombre: number;
    paterno: string;
    materno: string;
    ci: string;
    ext: string;
    celular: string;
    reservaciones: IReservations[];
    alojamientoId: number;
    alojamientos: IAccommodation[];
    userId: number;
    user: IUser[];
 }