import {Component, OnChanges, Input, SimpleChange, Output, EventEmitter} from '@angular/core';  

@Component({  
  selector: 'app-password-strength',  
  templateUrl: './password-strength.component.html',  
  styleUrls: ['./password-strength.component.scss']  
})  
export class PasswordStrengthComponent implements OnChanges  {  
    @Input() passwordToCheck: string;  
    @Input() barLabel: string;  
    @Output() score = new EventEmitter();

    bar0: string;  
    bar1: string;  
    bar2: string;  
    bar3: string;  
    bar4: string;
    
    lower = false;
    upper = false;
    digits = false;
    nonWords = false;
    length = false;

    private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];  

    private static measureStrength(pass: string) {  
        let score = 0;  

        // bonus points for mixing it up  
        let variations = { 
            lower: /[a-z]/.test(pass),  
            upper: /[A-Z]/.test(pass), 
            digits: /\d/.test(pass), 
            nonWords: /\W/.test(pass),  
            length: pass.length >= 8, 
        };  

        let tests = {
            lower: false,
            upper: false,
            digits: false,
            nonWords: false,
            length: false,
        };

        let variationCount = 0; 

        for (let check in variations) {  
            variationCount += (variations[check]) ? 1 : 0;
            tests[check] = variations[check];
        } 
         
        score += Math.trunc(variationCount * 20);  
        return {score, tests};  
    }  

    private getColorAndInfo(objectInfo: any) {  
        let idx = 0; 
        
        let score = objectInfo.score;
        let tests = objectInfo.tests;

        this.score.emit(score);  

        if (score > 80) {  
            idx = 4;
        } else if (score > 60) {  
            idx = 3;  
        } else if (score > 40) {  
            idx = 2;  
        } else if (score > 20) {  
            idx = 1;  
        }  

        return {  
            idx: idx + 1,  
            col: this.colors[idx],
            tests: tests  
        };  
    }  

    ngOnChanges(changes: {[propName: string]: SimpleChange}): void {  
    var password = changes['passwordToCheck'].currentValue;  
        this.setBarColors(5, '#DDD');  
        if (password) {  
            let c = this.getColorAndInfo(PasswordStrengthComponent.measureStrength(password));  
            this.setBarColors(c.idx, c.col, c.tests);  
        }  
    } 

    private setBarColors(count, col, tests?) {  
        for (let _n = 0; _n < count; _n++) {  
            this['bar' + _n] = col;  
        }  

        if (tests) {
            for (let test in tests) {
                //console.info('my test: ', tests[test]);
                this[test] = tests[test];
            }
        }
   }  
}  