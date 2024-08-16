import { IAccommodation } from "./accommodation.model";
import { IProductSales } from "./productSales.model";
import { IProductShopping } from "./productShopping.model";

export interface IProducts {
    id: number;
    nombre: string;
    precio: string;
    productoCompras: IProductShopping[];
    productoInventarios: IAccommodation[];
    productoVentas: IProductSales [];
 }