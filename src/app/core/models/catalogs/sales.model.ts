import { IAccommodation } from "./accommodation.model";
import { IProducts } from "./products.model";
import { IProductSales } from "./productSales.model";
import { IReservations } from "./reservations.model";

export interface ISales {
    id: number;
    fecha: string;
    reservacionId: number;
    productoVentas: IProductSales [];
    reservaciones: IReservations [];
 }