import { IAccommodation } from "./accommodation.model";

export interface IShopping {
    id: number;
    fecha: string;
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }