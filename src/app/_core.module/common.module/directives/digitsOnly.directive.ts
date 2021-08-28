import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[digitsOnly]'
})
export class DigitsOnlyDirective implements OnInit {
    private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
    @Input() decimalPlaces: number = 10;

    ngOnInit() {
        // console.log('decimalPlaces: ' + this.decimalPlaces);
        this.regex = new RegExp('^\\d*\\.?\\d{0,' + this.decimalPlaces + '}$', 'g');
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        console.log(e.target['value']);
        if (
            // Allow: Delete, Backspace, Tab, Escape, Enter
            [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) || // Allow: Ctrl+A
            (e.keyCode === 67 && e.ctrlKey === true) || // Allow: Ctrl+C
            (e.keyCode === 86 && e.ctrlKey === true) || // Allow: Ctrl+V
            (e.keyCode === 88 && e.ctrlKey === true) || // Allow: Ctrl+X
            (e.keyCode === 65 && e.metaKey === true) || // Cmd+A (Mac)
            (e.keyCode === 67 && e.metaKey === true) || // Cmd+C (Mac)
            (e.keyCode === 86 && e.metaKey === true) || // Cmd+V (Mac)
            (e.keyCode === 88 && e.metaKey === true) || // Cmd+X (Mac)
            (e.keyCode >= 35 && e.keyCode <= 40) || // Home, End, Left, Right, Up, Down
            (e.keyCode === 190 && e.target['value'].toString().indexOf('.') < 0) // allow dot in number
            // (e.keyCode === 188 && e.target['value'].toString().indexOf(',') < 0) // allow comma in number
        ) {
            return;  // let it happen, don't do anything
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

        const current: string = e.target['value'];
        const position = e.target['selectionStart'];
        const next: string = [current.slice(0, position), e.key === 'Decimal' ? '.' : e.key, current.slice(position)].join('');
        if (next && !String(next).match(this.regex)) {
            e.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const pastedInput: string = event.clipboardData
            .getData('text/plain')
            .replace(/(?!,)\D/g, ''); // get a digit-only string
        document.execCommand('insertText', false, pastedInput);
    }
    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        const textData = event.dataTransfer
            .getData('text').replace(/(?!,)\D/g, '');
        // this.inputElement.focus();
        document.execCommand('insertText', false, textData);
    }
}
