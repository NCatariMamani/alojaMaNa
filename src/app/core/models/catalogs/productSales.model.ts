import { IAccommodation } from "./accommodation.model";
import { IProducts } from "./products.model";
import { ISales } from "./sales.model";

export interface IProductSales {
    id: number;
    precioVenta: string;
    productoId: string;
    productos: IProducts[];
    ventaId: number;
    ventas: ISales[];
 }