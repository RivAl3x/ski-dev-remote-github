import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { $animations } from '../helpers/login-animations';
import { $providers } from '../helpers/login-providers';
import { $pages } from '../helpers/login-pages';
import { from } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import {MatPasswordStrengthComponent} from '@angular-material-extensions/password-strength';
import { ActivatedRoute, Router } from '@angular/router';

export type loginAction = 'register'|'registerHost'|'signIn'|'confirmAccount'|'forgotPassword'|'changePassword'|'changeEmail'|'delete'|'signOut';

@Component({
  selector : 'wm-login',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss'],
  animations: $animations
})
export class LoginComponent {

  readonly providers = $providers;
  private pages = $pages;
  
  public page: loginAction;
  public registerContext: loginAction = 'register';
  
  private code: string;

  readonly form: FormGroup;
  private fullName: FormControl;
  private phone: FormControl;
  private email: FormControl;
  public password: FormControl;
  public confirmationCode: FormControl;
  private newEmail: FormControl;
  private newPassword: FormControl;

  public hidePassword = true;
  public error = null;
  public progress = false;

  public barLabel: string = "Password strength:";
  public passwordFocus: boolean = false;
  public showLoginOpt: boolean = false;
  public passwordAccepted: boolean = false;

  public userType: string;
  
  constructor(
    private router: Router,
    private _cdr: ChangeDetectorRef,
    private auth: AuthenticationService, 
    private ref: MatDialogRef<LoginComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {

    // Form controls
    this.fullName = new FormControl(null, Validators.required);
    this.phone = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    this.confirmationCode = new FormControl(null, Validators.required);
    //this.password = new FormControl(null, [Validators.required, Validators.pattern('//^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,32}$//')]);
    this.newEmail = new FormControl(null, [Validators.required, Validators.email]);
    this.newPassword = new FormControl(null, Validators.required);

    // Empty form group
    this.form = new FormGroup({});

    // Populates the form according to the page
    this.switchPage(this.page = data.data);
  }

  get currentPage() { return this.pages[this.page || 'signIn']; }

  private switchPage(page: loginAction, registerContext: loginAction = 'register') {

    this.registerContext = registerContext;

    // Removes all the controls from the form group
    Object.keys(this.form.controls).forEach( control => {
      this.form.removeControl(control);
    });
    
    // Add the relevant controls to the form according to selected page
    switch(this.page = page) {

      case 'register':
      this.form.addControl('email', this.email);
      this.form.addControl('fullName', this.fullName);
      this.form.addControl('phone', this.phone);
      this.form.addControl('password', this.password);
      break;

      case 'registerHost':
      this.form.addControl('email', this.email);
      this.form.addControl('fullName', this.fullName);
      this.form.addControl('phone', this.phone);
      this.form.addControl('password', this.password);
      break;

      default:
      case 'signIn':
      this.form.addControl('email', this.email);
      this.form.addControl('password', this.password);      
      break;

      case 'forgotPassword':
      this.form.addControl('email', this.email);
      break;

      case 'confirmAccount':
      //this.form.addControl('confirmationCode', this.confirmationCode);
      break;
    }
  }

  private checkPasswordScore(score: number) {
    console.info('score: ', score);
    if (score > 80) {
      this.form.get('password').setErrors(null);
      //this.form.get('password').updateValueAndValidity();
      this._cdr.detectChanges();
      console.info('>80', this.form.get('password'));
    } else {
      this.form.get('password').setErrors({'incorrect': true});
      //this.form.get('password').updateValueAndValidity();
      this._cdr.detectChanges();
      console.info('<80', this.form.get('password'));
    }
  }

  private showError(error: string) {

    this.error = error;
    this.progress = false;
    setTimeout(() => this.error = null, 5000);
  }

  public activate(action: loginAction) {

    this.progress = true;
    
    switch(action) {

      default:
      case 'signIn':
      this.signIn( this.email.value, this.password.value );
      break;

      case 'register':
      this.registerNew( this.userType, this.email.value, this.password.value, this.fullName.value, this.phone.value );
      break;

      case 'registerHost':
      this.registerHost( this.userType, this.email.value, this.password.value, this.fullName.value, this.phone.value );
      break;

      case 'confirmAccount':
      this.forgotPassword( this.confirmationCode.value );
      break;

      case 'forgotPassword':
      this.forgotPassword( this.email.value );
      break;
    }
  }

  private signIn(email: string, password: string) {
    this.auth.login(email, password)
      .subscribe((user) => {
        this.ref.close(user);
        const returnUrl = this.data.returnUrl || '/';
        console.info('returnUrl -- ', returnUrl);
        this.router.navigateByUrl(returnUrl); 
      },(error) => {
        this.showError(error)
      });
  }

  private registerNew(userType: string = 'rider', email: string, password: string, fullName: string, phone: string) {
    this.auth.register(userType, email, password, fullName, phone )
      .subscribe((user) => {
        //this.ref.close(user) 
         this.switchPage('confirmAccount')
      },(error) => {
        this.showError(error)
      });
  }

  private registerHost(userType: string = 'host', email: string, password: string, fullName: string, phone: string) {
    this.auth.register(userType, email, password, fullName, phone )
      .subscribe((user) => {
        //this.ref.close(user) 
         this.switchPage('confirmAccount')
      },(error) => {
        this.showError(error)
      });
  }

  private confirmAccount(code: string) {

    this.auth.confirmAccount(code)
      .subscribe(() => {
        this.ref.close(null) 
      },(error) => {
        this.showError(error)
      });
  }

  private forgotPassword(email: string) {

    this.auth.sendPasswordResetEmail(email)
      .subscribe(() => {
        this.ref.close(null) 
      },(error) => {
        this.showError(error)
      });
  }

  /* private signInWith(provider: string) { 
    // Signing-in with a provider    
    this.auth.signInWith( provider )
       // Creates the new user profile if needed, keeps the existing one otherwise
      .then( user => this.profile.register(user)
        // Closes the dialog returning the user
        .then( () => this.ref.close(user) )
      )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private resetPassword(code: string, newPassword: string) {
    
    this.auth.confirmPasswordReset(code, newPassword)
      //.then( () => this.reportSuccess('Reset to a new password', 'signIn') )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }
*/
  
  /* private updateEmail(password: string, newEmail: string) {
    // Refreshes the authentication
    this.auth.refresh(password)
      // Updates the email returning the new user object
      .then( user => user.updateEmail(newEmail).then( () => this.ref.close(user) ) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private updatePassword(password: string, newPassword: string) {
    // Refreshes the authentication
    this.auth.refresh(password)
      // Updates the password returning the new user object
      .then( user => user.updatePassword(newPassword).then( () => this.ref.close(user) ) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private deleteAccount(password: string) {
    // Refreshes the authentication
    this.auth.refresh(password)
       // Deletes the user profile first
      .then( user => this.profile.delete()
        // Deletes the user object next
        .then( () => user.delete() )
      )
      // Closes the dialog returning null
      .then( () => this.ref.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  } */
}  
