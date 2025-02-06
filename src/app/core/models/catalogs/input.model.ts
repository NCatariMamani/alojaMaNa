import { IAccommodation } from "./accommodation.model";
import { IProductInventory } from "./productInventory.model";

export interface IInput {
    id: number;
    descripcion: string;
    cantidad: number;
    fecha: string;
    productoInventarioId: number;
    productoInventarios: IProductInventory[];
 }