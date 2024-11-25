import { IAccommodation } from "./accommodation.model";
import { IBedroom } from "./bedrooms.model";
import { ICustomer } from "./customer.model";
import { IInCharge } from "./inCharge.model";
import { IProducts } from "./products.model";
import { ISales } from "./sales.model";

export interface IReservations {
    id: number;
    fecha: string;
    horaEntrada: string;
    horaSalida: string;
    horaProgramada: string;
    tiempo: string;
    montoEntregado: string;
    compania: string;
    costoHabitacion: string;
    costoExtra: string;
    total: string;
    totalVenta: string;
    cambio: string;
    estadoCambio: string;
    ventas: ISales[];
    habitacionId: number;
    habitaciones: IBedroom [];
    encargadoId: number;
    encargados: IInCharge [];
    alojamientoId: number;
    alojamientos: IAccommodation[];
    clienteId: number;
    clientes: ICustomer[];
 }