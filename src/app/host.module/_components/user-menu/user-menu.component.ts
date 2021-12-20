import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_core.module/auth.module/services/auth.service';
import { SignalrService } from 'src/app/_shared/services/signalR.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public userImage = 'assets/images/others/admin.jpg';
  public chatUpdates: boolean = false;

  constructor(
    public authService: AuthenticationService,
    private signalrService: SignalrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signalrService.messages.subscribe((conversationId: any) => {
      // console.info('Signalr messages subscribe from top-menu comp --- ', conversationId);

      if (conversationId && this.router.url !== '/host/chat') {
        this.chatUpdates = true;
      }
    });
  }

  public resetChatUpdates() {
    this.chatUpdates = false;
  }

  public onSignOut() {
    console.info('onSignOut clicked');
    this.authService.logout();
  }

}
