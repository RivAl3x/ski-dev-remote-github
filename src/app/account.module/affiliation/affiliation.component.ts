import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { MatDialog } from '@angular/material/dialog';
import { AffiliationDialogComponent } from './affiliation-dialog/affiliation-dialog.component';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { AccountService } from '../_services/account.service';
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';
import { UserSettingsDialogComponent } from './user-settings-dialog/user-settings-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';

@Component({
  selector: 'app-affiliation',
  templateUrl: './affiliation.component.html',
  styleUrls: ['./affiliation.component.scss']
})
export class AffiliationComponent implements OnInit {
  public affiliations = [];
  public billingAddresses = [];
  isCompany: boolean = false;

  constructor(
    public localDBService: LocalDBService, 
    public formBuilder: FormBuilder, 
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private accountService: AccountService, 
    public currentUser: CurrentUser 
  ) { }

  ngOnInit() {
    this.isCompany = this.currentUser.isCompany;

    this.loadBillingAddresses();
    this.loadAffiliations();
  }

  public openAffiliationDialog(data:any){
    const dialogRef = this.dialog.open(AffiliationDialogComponent, {
      data: {
        affiliation: data,
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    dialogRef.afterClosed().subscribe(affiliation => { 

      if(affiliation) {     
        console.info('affiliation afterClosed -- ', affiliation);

        let message = 'Affiliation added.';
        
        this.accountService.saveAffiliation(affiliation, this.isCompany)
          .subscribe((response) => {
            this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            setTimeout(() => this.loadAffiliations(), 300);
          },(error) => {
            this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          });
      }
    });
  }

  public remove(affiliation:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this affiliation?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.affiliations.indexOf(affiliation);
        if (index !== -1) {
          this.affiliations.splice(index, 1);  
        } 
        /* this.accountService.deleteAffiliation(affiliation.id);
        setTimeout(() => this.loadAffiliations(), 300); */
      } 
    }); 
  }

  public openEmailDialog(affiliation: any){
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      data: affiliation.token,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    dialogRef.afterClosed().subscribe(emailData => { 
      console.info('email token to be sent: ', emailData);

      if(emailData.email) {     

        let message = 'Email sent succesfully.';
        
        this.accountService.sendEmailToken(affiliation.token, emailData.email, affiliation.companyName)
          .subscribe((response) => {
            this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            setTimeout(() => this.loadAffiliations(), 300);
          },(error) => {
            this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          });
      }
    });
  }


  public openSettingsDialog(){
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    dialogRef.afterClosed().subscribe(affiliation => { 
      console.info('affiliation data to be saved: ', affiliation);
    });
  }

  public openUserSettingsDialog(affiliation: any){
    const dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      data: {
        affiliation: affiliation,
        billingAddresses: this.billingAddresses,
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    dialogRef.afterClosed().subscribe(affiliationData => { 
      console.info('affiliation data to be saved: ', affiliationData);

      if(affiliationData) {     
        console.info('affiliation afterClosed -- ', affiliationData);

        let message = 'Affiliation data modified.';
        
        this.accountService.manageAffiliationData(affiliation.id, affiliationData.affiliationData)
          .subscribe((response) => {
            this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            setTimeout(() => this.loadAffiliations(), 300);
          },(error) => {
            this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          });
      }
    });
  }

  public approveAffiliation(id){
    let message = 'Affiliation approved.';

    this.accountService.approveAffiliation(id)
          .subscribe((response) => {
            this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            setTimeout(() => this.loadAffiliations(), 300);
          },(error) => {
            this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          });
  }

  loadAffiliations() {

    this.accountService.getAffiliations(this.isCompany).subscribe((response) => {
      console.info('getAffiliations response -- ', response);
      
      this.affiliations = response;
    });
  }

  loadBillingAddresses() {
    this.accountService.getBillingAddresses().subscribe((response) => {
      console.info('getBillingAddresses response -- ', response);
      
      this.billingAddresses = response;
    });
  }

}
