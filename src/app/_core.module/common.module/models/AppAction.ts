export class AppAction {
    constructor(type, payload = null) {
        this.type = type;
        this.payload = payload;
    }
    type: string;
    payload: any;
}