import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { CurrentUser } from '../services/currentuser.service';

@Directive({
    selector: '[canAccessIfRole],[cannotAccessIfRole]'
})
export class CanAccessIfRoleDirective implements OnInit {
    @Input('canAccessIfRole') canAccessIfRole: string = '';
    @Input('cannotAccessIfRole') cannotAccessIfRole: string = '';

    constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private currentUser: CurrentUser) {
    }

    ngOnInit(): void {
        this.applyPermission();
    }

    private applyPermission(): void {
        // console.log('can access if role');
        this.viewContainer.createEmbeddedView(this.templateRef);
        if (this.canAccessIfRole && !this.currentUser.hasAnyRole(this.canAccessIfRole.split(','))) {
            this.viewContainer.clear();
        }

        if (this.cannotAccessIfRole && this.currentUser.hasAnyRole(this.cannotAccessIfRole.split(','))) {
            this.viewContainer.clear();
        }
    }
}
