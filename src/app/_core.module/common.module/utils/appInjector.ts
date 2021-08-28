import { Injector, ViewContainerRef } from '@angular/core';

let appInjectorRef: Injector;
let appViewContainerRef: ViewContainerRef;

export const appInjector = {
    injector: (injector?: Injector): Injector => {
        if (injector) {
            appInjectorRef = injector;
        }

        return appInjectorRef;
    },
    viewContainerRef: (viewContainerRef?: ViewContainerRef): ViewContainerRef => {
        if (viewContainerRef) {
            appViewContainerRef = viewContainerRef;
        }

        return appViewContainerRef;
    },
    instanceOf(type) {
        return appInjector.injector().get(type);
    }
}

