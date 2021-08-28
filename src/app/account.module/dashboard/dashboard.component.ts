import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { $dashboardPages } from '../_helpers/dashboard-pages';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: User;
  public dashboardCards = $dashboardPages;

  constructor(public accountService: AccountService) { }

  ngOnInit() {
    console.info(this.user);
  }

}
