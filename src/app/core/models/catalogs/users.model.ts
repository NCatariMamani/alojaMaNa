import { IInCharge } from "./inCharge.model";

export interface IUser {
    id: number;
    email: string;
    password: string;
    encargados: IInCharge[];
 }