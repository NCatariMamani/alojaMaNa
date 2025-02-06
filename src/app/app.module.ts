import { LOCALE_ID, NgModule } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ContentComponent } from './layouts/content/content.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './common/services/authentication/auth.service';
import { AuthInterceptor } from './auth.interceptor';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FullModule } from './layouts/full/full.module';

export function tokenGetter() {
  return localStorage.getItem('token');
}

registerLocaleData(localeEs, 'es-ES');


@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    FullModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [
    JwtInterceptor,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe,
    CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
