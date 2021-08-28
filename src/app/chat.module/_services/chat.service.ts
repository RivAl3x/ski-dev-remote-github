import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppHttpClient } from 'src/app/_core.module/common.module/services/httpClient.service';

export interface IChatConversation {
  id: number;
  bookingId: number;
  reservationNo: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: IChatMessage[];
  updated: boolean,
  newMessages: number
}

export interface IChatMessage {
  operation: string; // values: sent/received
  time: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private apiClient: AppHttpClient) {}

  public getConversations() {
    const url = environment.apiUrl + 'Book/conversations';

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          return response.data;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  public getConversation(id) {
    const url = environment.apiUrl + 'Book/conversations/' + id;

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          return response.data[0];
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  sendMessage(bookingId: number, text: string, conversationId: number = null) {
    const url = environment.apiUrl + 'Book/conversations';

    let payload = {
      bookingId: bookingId, 
      text: text,
      conversationId: conversationId
    }

    console.info('sendMessage payload -- ', payload);

    return this.apiClient.post(url, payload)
    .pipe(
      catchError(this.handleError),
      map((response: any)  => {
         console.info(response);
      })
    );
  }

  private handleError(response: any) {
    let errorMessage = 'An error occured.';

    console.info('response ', response);

    let composedErrorMessage = response.error.messages.join('<br/>')

    if (!response) {
        return throwError(errorMessage);
    } else {
        return throwError(composedErrorMessage);
    }
}
}
