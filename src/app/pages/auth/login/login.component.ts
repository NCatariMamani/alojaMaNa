import { Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent extends BasePage implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  showPassword: boolean = false;
  deleteClass: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    //private authService: AuthService,
    private router: Router,
    //private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.renderer.listen('window', 'click', (event: Event) => {
      this.deleteClass = false;
    });
  }

  onSubmit() {

  }

}
