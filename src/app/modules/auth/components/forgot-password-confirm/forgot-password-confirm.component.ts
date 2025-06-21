import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password-confirm',
  standalone: true,
  imports: [RouterLink, TranslateModule,NgbAlert],
  templateUrl: './forgot-password-confirm.component.html',
  styleUrl: './forgot-password-confirm.component.scss'
})
export class ForgotPasswordConfirmComponent implements OnInit, OnDestroy {

  constructor(
    protected _router: Router
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
