import { Input, Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[dacForXSec]'
})
export class DisableAfterClickForXSecondsDirective {

    @Input('dacForXSec') disableElementForXSeconds: number;
    constructor(
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    @HostListener('click')
    onClick() {
        const disableTime = !this.disableElementForXSeconds || isNaN(+this.disableElementForXSeconds) ? 3000 : +this.disableElementForXSeconds * 1000;
        console.log(`Disable ${this.el} for ${this.disableElementForXSeconds}`)
        this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
        this.renderer.addClass(this.el.nativeElement, 'disabled');
        setTimeout(() => {
            this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
            this.renderer.removeClass(this.el.nativeElement, 'disabled');
        }, disableTime);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}