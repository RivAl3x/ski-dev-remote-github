import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject } from 'rxjs';
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public connection: signalR.HubConnection;
  public messages: BehaviorSubject<any>;

  constructor(
    private user: CurrentUser
  ) {
    this.messages = new BehaviorSubject<any>(null);
  }

  public initiateSignalrConnection(): Promise<void>{
    return new Promise((resolve, reject) => {

      let token = this.user.token;

      // console.info("user token -- ", token);

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('https://deskhub-back.logic-s.ro/hubs/chat', {
          accessTokenFactory: () => token, transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect([0, 0, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setSignalrClientMethods();

      this.connection
        .start()
        .then(() => {
          console.log(`SignalR connection success! connectionId: ${this.connection.connectionId} `);
          resolve();
        })
        .catch((error) => {
          console.log(`SignalR connection error: ${error}`);
          reject();
        });
    });
  }

  public closeSignalRConnection() {
    this.connection.stop();
  }

  private setSignalrClientMethods(): void {
    this.connection.on('ReceiveMessage', (message: any) => {
      this.messages.next(message);
    });
  }

}
