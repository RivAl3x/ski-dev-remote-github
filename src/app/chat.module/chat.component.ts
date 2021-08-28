import { Component, OnInit, OnDestroy, ViewChild,  ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ChatService, IChatConversation } from './_services/chat.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { SignalrService } from '../_shared/services/signalR.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('scroll') scrollRef: PerfectScrollbarComponent;
  @ViewChild('sidenav') sidenav: MatSidenav;

  conversations: IChatConversation[];
  currentUserId = 1;

  selectedConversation: IChatConversation;

  searchTerms = new Subject<string>();
  searchKeyword = '';
  message = '';

  constructor(
    private chatService: ChatService, 
    private changeDetectorRef: ChangeDetectorRef, 
    private renderer: Renderer2,
    private signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.getConversations();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-footer');
  }


  search(term: string): void {
    this.searchKeyword = term;
    this.searchTerms.next(term);
  }

  getConversations() {
    this.chatService.getConversations().subscribe(conversations => {
      this.conversations = conversations;

      this.changeDetectorRef.detectChanges();

      this.signalrService.messages.subscribe((conversationId: any) => {
        console.info('Signalr messages subscribe from chat component response --- ', conversationId);
        
        if (conversationId) {
          //alert(`SignalrHub.ReceiveMessage() response: ${response}`);
          this.getUpdatedConversation(conversationId);
  
        } 
      });
    });

  }

  getUpdatedConversation(conversationId) {
    this.chatService.getConversation(conversationId)
      .subscribe(updatedConversation => {
        console.info('updatedConversation -- ', updatedConversation);

        this.conversations.forEach((conversation, index) => {
          if(conversation.id == conversationId) {
            this.conversations[index] = updatedConversation;
            console.info('conversation -- ', conversation);

            if (this.selectedConversation && this.selectedConversation.id == conversationId) {
              console.info('if (this.selectedConversation && this.selectedConversation.id == conversationId) is true');
              this.selectedConversation = updatedConversation;
              setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
            } else {
              let newMessagesCount = updatedConversation.messages.length - conversation.messages.length;
              console.info('newMessagesCount: ', newMessagesCount);

              this.conversations[index].newMessages = newMessagesCount;
              //this.conversations[index].newMessages++;
              this.conversations[index].updated = true;
            }
            this.changeDetectorRef.detectChanges();
          }
        });

        console.info('this.conversations -- ', this.conversations);

      });   
  }

  selectConversation(conversationId: number): void {

    this.selectedConversation = this.conversations.find(x => x.id === conversationId);

    this.conversations.map((conversation) => {
      if(conversation.id == conversationId) {
        conversation.updated = false;
        conversation.newMessages = 0;
      }
    });

    this.message = '';

    if(window.innerWidth <= 960) {
      this.sidenav.close();
    }

    setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
  }

  sendMessage(): void {
    console.info('sendMessage -- ', this.message);

    if (this.message.length > 0) {
      const time = this.getCurrentTime();

      let messageModel = { conversationId: this.selectedConversation.id, bookingId: this.selectedConversation.bookingId, text: this.message };

      if(!this.signalrService.connection) {
        this.signalrService.initiateSignalrConnection().then(() => {
          this.signalrService.connection
          .invoke('SendChatMessage', messageModel)
          .then((response) => {
            console.log('SignalrHub invoke SendChatMessage response: ', response);

            this.selectedConversation.messages.push({ operation: 'sent', text: this.message, time });
            this.selectedConversation.lastMessage = this.message;
            this.selectedConversation.lastMessageTime = time;
            this.changeDetectorRef.detectChanges();
            this.message = '';
            setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
          })
          .catch(error => {
            console.log('SignalrHub invoke SendChatMessage error: ', error);
          });
        })
      } else {
        this.signalrService.connection
        .invoke('SendChatMessage', messageModel)
        .then((response) => {
          console.log('SignalrHub invoke SendChatMessage response: ', response);

          this.selectedConversation.messages.push({ operation: 'sent', text: this.message, time });
          this.selectedConversation.lastMessage = this.message;
          this.selectedConversation.lastMessageTime = time;
          this.changeDetectorRef.detectChanges();
          this.message = '';
          setTimeout(() => { this.scrollRef.directiveRef.scrollToBottom(); }, 100);
        })
        .catch(error => {
          console.log('SignalrHub invoke SendChatMessage error: ', error);
        });
      }
      
    }
  }

  messageInputKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') { this.sendMessage(); }
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
