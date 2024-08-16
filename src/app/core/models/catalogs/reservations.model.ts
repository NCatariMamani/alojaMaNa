import { IAccommodation } from "./accommodation.model";
import { IBedroom } from "./bedrooms.model";
import { IInCharge } from "./inCharge.model";
import { IProducts } from "./products.model";
import { ISales } from "./sales.model";

export interface IReservations {
    id: number;
    nombre: string;
    paterno: string;
    materno: string;
    edad: number;
    ci: number;
    extencion: string;
    nomberA: string;
    paternoA: string;
    maternoA: string;
    edadA: number;
    ciA: number;
    extencionA: string;
    fecha: string;
    horaEntrada: string;
    horaSalida: string;
    tiempo: string;
    compania: string;
    costoHabitacion: string;
    costoExtra: string;
    total: string;
    ventas: ISales[];
    habitacionId: number;
    habitaciones: IBedroom [];
    encargadoId: number;
    encargados: IInCharge [];
 }