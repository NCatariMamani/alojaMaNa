import { IAccommodation } from "./accommodation.model";
import { IProducts } from "./products.model";

export interface IProductShopping {
    id: number;
    productoId: string;
    productos: IProducts[];
    alojamientoId: number;
    alojamientos: IAccommodation[]
 }