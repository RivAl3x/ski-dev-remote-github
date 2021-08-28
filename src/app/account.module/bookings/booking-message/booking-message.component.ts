import { Component, Inject, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/chat.module/_services/chat.service';
import { SignalrService } from 'src/app/_shared/services/signalR.service';

@Component({
  selector: 'app-booking-message',
  templateUrl: './booking-message.component.html',
  styleUrls: ['./booking-message.component.scss']
})
export class BookingMessageComponent implements OnInit {
  public message = '';
  
  constructor(
    public chatService: ChatService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bookingId: number,
    private _bottomSheetRef: MatBottomSheetRef<BookingMessageComponent>,
    public snackBar: MatSnackBar,
    private signalrService: SignalrService
  ) { }

  ngOnInit() {
    console.info('init bookingId: ', this.bookingId);
  }

  messageInputKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') { this.sendMessage(); }
  }

  sendMessage(): void {
    console.info('sendMessage -- ', this.message);

    if (this.message.length > 0) {
      
      let message = 'Message sent.';

      let messageModel = { conversationId: null, bookingId: this.bookingId, text: this.message };

      this.signalrService.connection
      .invoke('SendChatMessage', messageModel)
      .then((response) => {
        console.log('SignalrHub invoke SendChatMessage response: ', response);
        this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
      })
      .catch(error => {
        console.log('SignalrHub invoke SendChatMessage error: ', error);
        this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
      });
        
      /* this.chatService.sendMessage(this.bookingId, this.message).subscribe((response) => {
        this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
        
      },(error) => {
        this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
      }); */
      
      this._bottomSheetRef.dismiss();
      this.message = '';
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    return this.pad(now.getHours(), 2) + ':' + this.pad(now.getMinutes(), 2);
  }

  // tslint:disable-next-line:variable-name
  pad(number, length): string {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }


}
