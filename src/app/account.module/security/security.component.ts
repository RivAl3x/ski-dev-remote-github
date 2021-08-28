import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../_theme/utils/app-validators';
import { $animations } from 'src/app/_core.module/auth.module/helpers/login-animations';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  animations: $animations
})
export class SecurityComponent implements OnInit {
  passwordForm: FormGroup;

  public hideCurrentPassword = true;
  public hideNewPassword = true;
  public hideConfirmNewPassword = true;

  public newPasswordFocus: boolean = false;

  public error = null;
  public progress = false;

  public barLabel: string = "Password strength:";
  public showLoginOpt: boolean = false;
  public passwordAccepted: boolean = false;

  constructor(
    public accountService: AccountService,
    public formBuilder: FormBuilder, 
    public snackBar: MatSnackBar,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmNewPassword': ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmNewPassword')});
  }

  onPasswordFormSubmit(values: any):void {

    console.info(values);

    if (!this.passwordForm.valid) {
      return;
    }

    this.accountService.changePassword(values.currentPassword, values.newPassword)
      .subscribe((user) => {
        this.snackBar.open('Your password changed successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        this.passwordForm.reset();
      },(error) => {
        this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      });
  }

  private checkNewPasswordScore(score: number) {
    //console.info('score: ', score);
    if (score > 80) {
      this.passwordForm.get('newPassword').setErrors(null);
      this._cdr.detectChanges();
      //console.info('>80', this.passwordForm.get('newPassword'));
    } else {
      this.passwordForm.get('newPassword').setErrors({'incorrect': true});
      this._cdr.detectChanges();
      //console.info('<80', this.passwordForm.get('newPassword'));
    }
  }

}
