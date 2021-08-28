import { Injectable } from '@angular/core';
import { isString, isArray } from 'util';
import { BaseService } from './baseService.service';

@Injectable({ providedIn: 'root' })
export class PermissionService extends BaseService {

    constructor() {
        super();
    }

    private get account() {
        const account = this.appStore._('account') || {};
        account.rights = account.rights || [];
        account.loggedUser = account.loggedUser || [];
        return account;
    }

    private getRoleId(role) {
        role = role || '';
        switch (role.toLocaleLowerCase()) {
            case 'super':
            case 'superadmin':
            case '1':
                return '1';

            case 'admin':
            case 'custadmin':
            case 'customeradmin':
            case '2':
                return '2';

            case 'employee':
            case 'custemployee':
            case 'customeremployee':
            case '3':
                return '3';
            default:
                return '';
        }
    }

    private fullActionName(action: string) {
        switch (action.toLocaleLowerCase()) {
            case 'c':
            case 'create':
            case 'add':
                return 'create';
            case 'u':
            case 'update':
            case 'modify':
            case 'edit':
                return 'update';
            case 'r':
            case 'read':
            case 'view':
            case 'list':
                return 'view';
            case 'd':
            case 'delete':
            case 'remove':
                return 'delete';

            default:
                return '';
        }
    }

    private permission(right: string) {
        right = (right || '').toLocaleLowerCase();
        if (right.indexOf('_') < 0) return '-';
        const splitValues = right.split('_');
        return this.fullActionName(splitValues[0]) + '_' + splitValues[1];
    }

    public permissionPretty(right: string | string[]) {
        const rights: string[] = isString(right) ? [<string>right] : <Array<string>>right;
        const prettyRights = rights.map(r => this.permission(r).split('_').join(' '));
        return prettyRights.join(',');
    }

    public get currentPermissions(): Array<string> {
        let currentPermissions = [];
        (this.account.rights || []).forEach(right => { // right = 'crm/clients:crud'
            const splitValues = right.split(':');
            const r = (splitValues[0] || '/').split('/')[1];
            const actions = (splitValues[1] || 'crud').split('');
            actions.forEach(a => {
                currentPermissions.push((this.fullActionName(a) + '_' + r).toLocaleLowerCase());
            });
        });
        return currentPermissions;
    }

    isInRole(role: string | string[]) {
        let roles = ['-'];
        if (isString(role)) {
            roles = [<string>role]
        }
        else
            if (isArray(role)) {
                roles = <Array<string>>role;
            }
        roles = roles.map(r => this.getRoleId(r));
        return roles.includes(this.account.loggedUser.role || '');
    }

    hasPermission(right): boolean {
        return this.hasOne([right]);
    }

    hasAll(permissions: string[]): boolean {
        return permissions.filter(value => {
            const p = this.permission(value);
            return -1 !== this.currentPermissions.indexOf(p);
        }).length === permissions.length;
    }

    hasOne(permissions: string[]): boolean {
        return permissions.filter(value => {
            const p = this.permission(value);
            return -1 !== this.currentPermissions.indexOf(p);
        }).length > 0;
    }
}
