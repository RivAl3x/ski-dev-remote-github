
export function reactiveClass<T extends { new(...args: any[]): {} }>(classConstructor: T) {

    console.log('this is a class constructor', classConstructor);

}