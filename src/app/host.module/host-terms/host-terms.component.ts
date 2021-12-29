import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Settings } from 'src/app/app.settings';
import { AuthenticationService } from 'src/app/_core.module/auth.module/services/auth.service';


@Component({
  selector: 'app-host-terms',
  templateUrl: './host-terms.component.html',
  styleUrls: ['./host-terms.component.scss']
})
export class HostTermsComponent implements OnInit {

  public settings: Settings;

  termsForm: FormGroup;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    public appSettings: AppSettings,
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    if (!this.termsForm.valid) {
      return;
    }

    this.loading = true;

    this.authService.agreeHostTerms(this.termsForm.value).subscribe((user) => {
      this.router.navigate(['/host/add-listing']);
    }, (error) => {
      this.loading = false;
    });
  }

  private initForm() {
    this.termsForm = new FormGroup({
      agreedTerms: new FormControl(false, Validators.requiredTrue),
    });
  }

}
