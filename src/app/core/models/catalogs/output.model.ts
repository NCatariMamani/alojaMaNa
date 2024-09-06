import { IAccommodation } from "./accommodation.model";
import { IProductInventory } from "./productInventory.model";

export interface IOutput {
    id: number;
    descripcion: string;
    cantidad: number;
    fecha: string;
    productoInventarioId: number;
    productoInventarios: IProductInventory[];
 }