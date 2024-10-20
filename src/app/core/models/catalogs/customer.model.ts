import { IAccommodation } from "./accommodation.model";

export interface ICustomer {
    id: number;
    nombre: number;
    paterno: string;
    materno: string;
    ci: number;
    extencion: string;
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }