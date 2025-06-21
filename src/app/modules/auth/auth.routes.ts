import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ForgotPasswordConfirmComponent } from "./components/forgot-password-confirm/forgot-password-confirm.component";
import { SetPasswordComponent } from "./components/set-password/set-password.component";

export const authRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'forgot-password-confirm',
        component: ForgotPasswordConfirmComponent,
      },
      {
        path: 'set-password',
        component: SetPasswordComponent,
      }
    ]
  }
]