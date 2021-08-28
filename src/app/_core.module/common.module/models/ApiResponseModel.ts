import { HttpResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class ApiResponseModel {
    constructor() {
        this.messages = [];
        this.data = {};
        this.appErrorCode = 0;
        this.isError = false;
    }

    messages: Array<string>;
    data: any;
    appErrorCode: number;
    isError: Boolean;


    static fromResponse(response) {

        let responseResult = new ApiResponseModel();
        if (response instanceof HttpResponse) {
            try {
                let apiResult = JSON.parse(response['_body']);
                responseResult = <ApiResponseModel>apiResult;

            } catch (e) {
                responseResult.messages = ['An error occured while processing request. Please contact administrator or try again later.'];
                responseResult.appErrorCode = 0;
            }
        } else
            if (response && response.hasOwnProperty('appErrorCode') &&
                response.hasOwnProperty('messages')) {
                responseResult.messages = response['messages'];
                if (response.hasOwnProperty('data')) {
                    responseResult.data = response['data'];
                }
                responseResult.appErrorCode = response['appErrorCode'];
                responseResult.isError = response['isError'];
            } else {
                responseResult.data = response;
            }

        return responseResult;
    }

    create(response) {
        let responseResult = new ApiResponseModel();
        if (response instanceof Response) {
            try {
                const apiResult = JSON.parse(response['_body']);
                if (apiResult.hasOwnProperty('data') && apiResult.hasOwnProperty('appErrorCode') && apiResult.hasOwnProperty('messages')) {
                    responseResult = responseResult as ApiResponseModel;
                } else {
                    if (typeof apiResult === 'string') {
                        responseResult.messages = [apiResult];
                    } else
                        if (typeof apiResult === 'object') {
                            responseResult.data = apiResult;
                            responseResult.messages = [response.statusText];
                        }
                }
            } catch (e) {
                responseResult.messages = ['An error occured while processing request. Please contact administrator or try again later.'];
            }
        } else if (response instanceof ApiResponseModel) {
            responseResult = response;
        } else {
            responseResult = response.json();
        }
        return responseResult;
    }
}