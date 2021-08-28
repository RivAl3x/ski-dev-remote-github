import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { routes } from './routes';
import { AuthenticationService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';

@NgModule({
  declarations: [LoginComponent, PasswordStrengthComponent],
  entryComponents: [ LoginComponent ],
  imports: [
    CommonModule, 
    //BrowserModule,
    //BrowserAnimationsModule,
    SharedModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatPasswordStrengthModule
  ],
  providers: [
    AuthenticationService, 
    //AuthorizationService
  ]
})
export class AuthModule {

  static routes() {
    return routes;
  }
}
