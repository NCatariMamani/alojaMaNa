import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService extends HttpService {

  // 1. BehaviorSubject para manejar el estado
  private reservationsSubject = new BehaviorSubject<any[]>([]);
  public reservations$ = this.reservationsSubject.asObservable();

  // Opcional: Para manejar loading states
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  private readonly router: string = ENDPOINT_LINKS.Recervaciones;
  constructor(private reservationRepo: Repository<any>) {
    super();
    //this.microservice = CityEndpoints.BasePage;
  }

  // 2. Método para cargar todas las reservaciones (lo llamamos al iniciar y después de cada CRUD)
  loadReservations(params?: ListParams): void {
    this.loadingSubject.next(true);
    this.getAll(params || new ListParams()).subscribe({
      next: (response) => {
        this.reservationsSubject.next(response.data);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.loadingSubject.next(false);
      }
    });
  }

  getAll(params: ListParams): Observable<IListResponse<any>> {
    return this.reservationRepo.getAll(this.router, params);
  }

  getById(id: string | number): Observable<any> {
    return this.reservationRepo.getById(this.router, id);
  }

  // 3. CREATE modificado para recargar automáticamente
  create(model: any): Observable<any> {
    return this.reservationRepo.create(this.router, model).pipe(
      tap(() => {
        // Después de crear exitosamente, recargamos la lista
        this.loadReservations();
      })
    );
  }

   // 4. UPDATE modificado para recargar automáticamente
  update(id: string | number, model: any): Observable<Object> {
    return this.reservationRepo.updateTypeServices(this.router, id, model).pipe(
      tap(() => {
        this.loadReservations();
      })
    );
  }

  // 5. REMOVE modificado para recargar automáticamente
  remove(id: string | number): Observable<Object> {
    return this.reservationRepo.remove(this.router, id).pipe(
      tap(() => {
        this.loadReservations();
      })
    );
  }

  getPdf(body: any): Observable<Blob> {
    //return this.reservationRepo.getAll(`${this.router}/generatepdf`, params);
    return this.reservationRepo.getGeneratePDF(`${this.router}/generatepdf`, body);
  }

  getIdBedroomReser(id: string | number): Observable<any> {
    return this.reservationRepo.getById(`${this.router}/getIdHabReser`, id);
  }



}
