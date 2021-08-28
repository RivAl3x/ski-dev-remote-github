import { KeyValuePair } from '../../bootstrap-components.module/_models/keyValuePairModel';

export const appConstants = {
    allValuesDropdownValue: "0",
    numberFormats: [
        { key: '2.2-2', value: '1234.56 =>  1234.56' },
        { key: '-2.2-2', value: '1234.56 =>  1 234.56' },
        { key: ',2.2-2', value: '1234.56 =>  1,234.56' },
        { key: '.2.2-2', value: '1234.56 =>  1.234,56' },
        { key: "'2.2-2", value: "1234.56 =>  1'234.56" }
    ],
    dateFormats: [
        { key: 'dd/MM/yyyy', value: '28/12/2018' },
        { key: 'dd.MM.yyyy', value: '28.12.2018' },
        { key: 'dd-MM-yyyy', value: '28-12-2018' },
        { key: 'MM/dd/yyyy', value: '12/28/2018' },
        { key: 'MM/dd/yyyy', value: '12.28.2018' },
        { key: 'MM-dd-yyyy', value: '12-28-2018' },
        { key: 'dd MMM, yyyy', value: '28 Dec 2018' },
        { key: 'dd MMMM, yyyy', value: '28 December 2018' }
    ],

    tooltips: {
        vat: `Cote TVA: <br/> 5%, 9%, 19%`
    },

    numberFormat: {
        eu: "",
        us: ""
    },

    dateFormat: {
        eu: "dd/mm/yyyy",
        us: "mm/dd/yyyy"
    },
    defaultTextIfEmpty: 'N/A',

    staticDropdownSources: {
        overdueValues: (() => {
            const values = {
                1: '> 1 day',
                2: '> 2 day',
                3: '> 3 day',
                4: '> 4 day',
                5: '> 5 day',
                6: '> 6 day',
                7: '> 1 week',
                14: '> 2 weeks',
                21: '> 3 weeks',
                30: '> 1 month'
            };
            return Object.keys(values).map(k => new KeyValuePair(k, values[k]));
        })()
    }

};