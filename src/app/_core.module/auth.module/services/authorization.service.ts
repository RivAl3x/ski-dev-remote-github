import { Injectable } from '@angular/core';
import { appInjector } from '../../common.module/utils/appInjector';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

    constructor() {
    }

    get appModules() {
        const modules = ['cre', 'cre.jt', 'lp', 'la', 'fi.lp', 'fi.la', 'fi.epi', 'fi.st',
            'fi.epr', 'fi.rar', 'fi.led', 'fi.iaii', 'fi.aeii', 'fi', 'fed', 'um'];
        return modules;
    }

    get appActions() {
        const actions = {
            'c': 'Creare', 'v': 'Vizualizare', 'm': 'Modificare', 'd': 'Stergere', 's': 'Solutionare',
            'p': 'Punct de Vedere', 'x': 'Copiere', 'a': 'Aprobare'
        };
        return actions;
    }

    getActionsForRoles(roles: string[] | string) {
        roles = (typeof roles === 'string' ? [roles] : roles).map(r => r.toLowerCase());
        let actions: string[] = [];
        const onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        };

        roles.forEach(r => {
            const prop = this.rolesAndActionsMatrix[r];
            if (prop) {

                // loop thru every object prop(which is module) and get a list of rights based on that module
                const rolesActions = Object.keys(prop).reduce((acc, i) => {
                    const roleActions = this.combineWordWithEveryLetter(i, prop[i]);
                    return [...acc, ...roleActions];
                }, []);
                actions = [...actions, ...rolesActions];
            }
        });

        return actions.filter(onlyUnique);
    }

    get rolesAndActionsMatrix() {
        const matrix = {
            dedl: { 'cre': 'cvmdspax', 'fi.lp': 'mv', 'fi.la': 'mv', 'fi.epi': 'cmdxv', 'fi.st': 'cmdxv', 'fi.epr': 'cmdxv', 'fi.rar': 'cmdxv', 'fi.led': 'cmdxv', 'fi.iaii': 'cmdxv', 'fi.aeii': 'cmdxv' },
            sef_dedl: { 'cre': 'cvmdspax', 'fi.lp': 'mv', 'fi.la': 'mv', 'fi.epi': 'cmdxv', 'fi.st': 'cmdxv', 'fi.epr': 'cmdxv', 'fi.rar': 'cmdxv', 'fi.led': 'cmdxv', 'fi.iaii': 'cmdxv', 'fi.aeii': 'cmdxv', 'fi': 'cmdv', 'fed': 'cmdv' },
            ded: { 'cre': 'cvmdspax', 'fi.lp': 'mv', 'fi.la': 'mv', 'fi.epi': 'cmdxv', 'fi.st': 'cmdxv', 'fi.epr': 'cmdxv', 'fi.rar': 'cmdxv', 'fi.led': 'cmdxv', 'fi.iaii': 'cmdxv', 'fi.aeii': 'cmdxv' },
            sef_ded: { 'cre': 'cvmdspax', 'fi.lp': 'mv', 'fi.la': 'mv', 'fi.epi': 'cmdxv', 'fi.st': 'cmdxv', 'fi.epr': 'cmdxv', 'fi.rar': 'cmdxv', 'fi.led': 'cmdxv', 'fi.iaii': 'cmdxv', 'fi.aeii': 'cmdxv', 'fi': 'cmdv', 'fed': 'cmdv' },
            centru: { 'cre': 'sv', 'cre.jt': 'v', 'lp': 'v', 'la': 'v', 'fi.lp': 'v', 'fi.la': 'v', 'fi.epi': 'v', 'fi.st': 'v', 'fi.epr': 'v', 'fi.rar': 'v', 'fi.led': 'v', 'fi.iaii': 'v', 'fi.aeii': 'v' },
            fol_em: { 'cre': 'cvmdspx', 'cre.jt': 'cvmdx', 'lp': 'mv', 'la': 'mv', 'fi.lp': 'v', 'fi.la': 'v', 'fi.epi': 'v', 'fi.st': 'v', 'fi.epr': 'v', 'fi.rar': 'v', 'fi.led': 'v', 'fi.iaii': 'v', 'fi.aeii': 'v' },
            fol_es: { 'cre': 'cvmdpx', 'fi.lp': 'v', 'fi.la': 'v', 'fi.epi': 'v', 'fi.st': 'v', 'fi.epr': 'v', 'fi.rar': 'v', 'fi.led': 'v', 'fi.iaii': 'v', 'fi.aeii': 'v' },
            insp_inc: { 'cre': 'v', 'cre.jt': 'v', 'lp': 'v', 'la': 'v', 'fi.lp': 'v', 'fi.la': 'v', 'fi.epi': 'v', 'fi.st': 'v', 'fi.epr': 'v', 'fi.rar': 'v', 'fi.led': 'v', 'fi.iaii': 'v', 'fi.aeii': 'v', 'fi': 'cmdv', 'fed': 'cmdv' },
            admin_it: { 'cre': 'cvmdspax', 'cre.jt': 'cvmdx', 'lp': 'mv', 'la': 'mv', 'fi.lp': 'mv', 'fi.la': 'mv', 'fi.epi': 'cmdxv', 'fi.st': 'cmdxv', 'fi.epr': 'cmdxv', 'fi.rar': 'cmdxv', 'fi.led': 'cmdxv', 'fi.iaii': 'cmdxv', 'fi.aeii': 'cmdxv', 'um': 'cmdv', 'fi': 'cmdv', 'fed': 'cmdv'  },
            admin_bu: { 'cre': 'cvmdspax', 'cre.jt': 'cvmdx', 'lp': 'mv', 'la': 'mv', 'fi.lp': 'mv', 'fi.la': 'mv', 'fi.epi': 'cmdxv', 'fi.st': 'cmdxv', 'fi.epr': 'cmdxv', 'fi.rar': 'cmdxv', 'fi.led': 'cmdxv', 'fi.iaii': 'cmdxv', 'fi.aeii': 'cmdxv', 'fi': 'cmdv', 'fed': 'cmdv'  },
            prog_fsms: { 'cre': 'cvmdspax', 'cre.jt': 'cvmdx', 'fi.epi': 'v', 'fi.st': 'v', 'fi.epr': 'v', 'fi.rar': 'v', 'fi.led': 'v', 'fi.iaii': 'v', 'fi.aeii': 'v' },
            view: { 'cre': 'v', 'cre.jt': 'v', 'lp': 'v', 'la': 'v', 'fi.lp': 'v', 'fi.la': 'v', 'fi.epi': 'v', 'fi.st': 'v', 'fi.epr': 'v', 'fi.rar': 'v', 'fi.led': 'v', 'fi.iaii': 'v', 'fi.aeii': 'v' }
        };
        return matrix;
    }

    private combineWordWithEveryLetter(word: string, letters: string) {
        const combined = letters.split('').map(l => `${word}:${l}`);
        return combined;
    }

    static get instance() {
        return appInjector.instanceOf(AuthorizationService);
    }

}
