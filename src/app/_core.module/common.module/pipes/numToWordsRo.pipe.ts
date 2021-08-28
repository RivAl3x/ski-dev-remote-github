
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numtowords'
})
export class NumToWordsRoPipe implements PipeTransform {
    transform(value: string | number, defaultText = '') {
        // string is null or spaces
        const number = Number.parseFloat(value.toString());
        if (number) {
            return this.numToWordsRo(number);
        }
        return 'zero';
    }

    numToWordsRo(number) {

        const courncy = "lei";
        const partcourncy = " bani";

        let round = Math.round(number);

        const number1 = round - Math.floor(round);
        const dot = '.';
        const nodot = '';
        let number2 = +number1.toString().replace(dot, nodot);

        function convert_number(nr) {
            if ((nr < 0) || (nr > 999999999)) {
                return nr.toString();
            }

            let Gn = Math.floor(nr / 1000000);  /* Millions (giga) */
            nr -= Gn * 1000000;
            let kn = Math.floor(nr / 1000);     /* Thousands (kilo) */
            nr -= kn * 1000;
            let Hn = Math.floor(nr / 100);      /* Hundreds (hecto) */
            nr -= Hn * 100;
            let Dn = Math.floor(nr / 10);       /* Tens (deca) */
            let n = nr % 10;               /* Ones */
            let res = "";

            if (Gn) {
                res += convert_number(Gn) + (Gn === 1 ? ' milion ' : ' milioane ');
            }

            if (kn) {
                res += (res ? "" : " ") + convert_number(kn) + (kn === 1 ? " mie " : " mii ");
            }

            if (Hn) {
                res += (res ? "" : " ") + convert_number(Hn) + (Hn === 1 ? ' suta ' : ' sute ');
            }

            let ones = ["", "unu", "doi", "trei", "patru", "cinci", "sase",
                "sapte", "opt", "noua", "zece", "unsprezece", "douasprezece", "treisprezece",
                "patrusprezece", "cincisprezece", "sasesprezece", "saptesprezece", "optsprezece",
                "nouasprezece"];
            let onesF = ['', 'una', 'doua']
            let tens = ["", "", "douazeci", "treizeci", "patruzeci", "cincizeci", "saizeci",
                "saptezeci", "optzeci", "nouazeci"];

            if (Dn || n) {
                if (!res) {
                    res += " ";
                }

                if (Dn < 2) {
                    const nr = Dn * 10 + n;
                    res += (nr > 2 ? ones[nr] : onesF[nr]);
                }
                else {
                    res += tens[Dn];

                    if (n) {
                        res += " si " + ones[n];
                    }
                }
            }

            if (!res) {
                res = "zero";
            }

            return res;
        }

        //return convert_number(number) + ' ' + courncy + ' si ' + convert_number(number2) + ' ' + partcourncy;
        return convert_number(number) + ' virgula ' + convert_number(number2);
    }

}