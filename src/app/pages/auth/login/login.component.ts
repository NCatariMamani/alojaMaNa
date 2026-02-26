import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormDataService } from 'src/app/common/services/authentication/form-data.service';
//import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends BasePage implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  showPassword: boolean = false;
  deleteClass: boolean = true;
  isSubmitting: boolean = false; // Nueva propiedad para controlar envío
  formSubmitted: boolean = false; // Para controlar si ya se intentó enviar
  isButtonDisabled: boolean = true;


  //username: string = '';
  //password: string = '';
  token: string | null = null;
  data: any = null;


  constructor(
    private formBuilder: FormBuilder,
    //private authService: AuthService,
    private router: Router,
    //private elementRef: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private http: HttpClient,
    private formDataService: FormDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });

    this.renderer.listen('window', 'click', (event: Event) => {
      this.deleteClass = false;
    });
  }

  /*  // Getter para verificar si el formulario es válido
  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  // Getter para verificar si debe estar deshabilitado
  get isButtonDisabled(): boolean {
    return this.isSubmitting || !this.isFormValid;
  }*/


  onSubmit() {
    this.loading = true;
    let { email, password } = this.loginForm.value;
    let token: any;
    let roles: any; //RolesModel;

    if (this.loginForm.valid) {
      this.formDataService.setFormData(this.loginForm.value);
    }

    //event.preventDefault();
    this.authService.getToken(email, password).subscribe({
      next: data => {
        token = data;
        this.loading = false;
        //console.log('entraste');
        const info = this.authService.getUserInfo();
        if(info.role == 3){
          this.router.navigate(['pages/catalogs/reservations']);
        }else{
          this.router.navigate(['pages/catalogs/accommodations']);
        }
        
      }, complete: () => {
        /*if(this.authService.existToken()){

          this.loading = false;
          console.log('entraste');
          this.router.navigate(['pages/catalogs/accommodations']);
        }*/
      }, error: (err) => {
        this.loading = false;
        this.alert('error', 'Credenciales Incorrectas', ``);
      }
    });
  }

}
