import { IAccommodation } from "./accommodation.model";
import { IProducts } from "./products.model";

export interface IProductInventory {
    id: number;
    cantidad: number;
    entrada: number;
    salida: number;
    stock: number;
    fecha: string;
    hora: string;
    productoId: string;
    productos: IProducts[];
    alojamientoId: number;
    alojamientos: IAccommodation[];
 }