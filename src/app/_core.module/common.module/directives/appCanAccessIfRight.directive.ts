import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, ElementRef, Renderer2 } from '@angular/core';
import { isString, isArray } from 'util';
import { CurrentUser } from '../services/currentuser.service';

@Directive({
    selector: '[canAccessIfRight]'
})
export class CanAccessIfRightDirective implements OnInit {
    @Input() canAccessIfRight: string | string[] = '';
    
    constructor(private templateRef: ElementRef<any>, private renderer: Renderer2, private currentUser: CurrentUser) { }

    ngOnInit(): void {
        this.userCanDoAction();
    }

    private userCanDoAction(): void {
        if (!this.currentUser.canDoAction(this.canAccessIfRight)) {
            this.renderer.removeChild(this.templateRef.nativeElement.parent, this.templateRef.nativeElement);
        }
    }
}
