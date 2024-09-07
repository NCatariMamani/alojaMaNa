import { IBedroom } from "./bedrooms.model";
import { IInCharge } from "./inCharge.model";
import { IInventories } from "./inventories.model";
import { IReservations } from "./reservations.model";
import { IShopping } from "./shopping.model";

export interface IAccommodation {
   id: number;
   nombre: string;
   noHabitaciones: number;
   direccion: string; 
   departamento: string;
   compras: IShopping[];
   encargados: IInCharge[];
   habitaciones: IBedroom[];
   inventarios: IInventories[];
   reservaciones: IReservations[];
}