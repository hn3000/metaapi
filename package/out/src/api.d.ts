import { IModelType, IModelTypeComposite } from '@hn3000/metamodel';
export interface IAPIRequestModel<T> {
    paramsType?: IModelTypeComposite<T> | IModelType<T>;
    format: "formdata" | "body" | "empty";
    paramsByLocation: {
        [location: string]: string[];
    };
    locationsByParam: {
        [param: string]: string;
    };
}
export interface IAPIResponseModel<T> {
    [status: string]: IModelTypeComposite<T> | IModelType<T>;
    '200': IModelTypeComposite<T> | IModelType<T>;
}
export interface IAPIOperation<Req, Resp> {
    readonly name: string;
    readonly id: string;
    readonly pathPattern: string;
    readonly method: string;
    readonly requestModel: IAPIRequestModel<Req>;
    readonly responseModel: IAPIResponseModel<Resp>;
    path: (req: any) => string;
}
export interface IAPIModel {
    operations(): ReadonlyArray<IAPIOperation<any, any>>;
    operationById(id: string): IAPIOperation<any, any>;
    base: string;
    subModel(ids: string[]): IAPIModel;
}
export interface IAPIModelBuilder extends IAPIModel {
    add(op: IAPIOperation<any, any>): IAPIModelBuilder;
    remove(id: string): IAPIModelBuilder;
    setBase(base: string): void;
}
export interface IAPIModelRegistry {
    fetchModel(url: string, id: string): Promise<IAPIModel>;
    model(id: string): IAPIModel;
}
export interface IAPIResult<Success> {
    isSuccess(): boolean;
    success(): Success;
    error(): Error;
}
export declare enum ErrorKind {
    InvalidOperation = 0,
    Failure = 1,
    Success = 2,
}
export interface IAPIError {
    kind: ErrorKind;
    httpStatus: number;
    error: any;
}
export interface IAPIClient {
    runOperationById(id: string, req: any): Promise<IAPIResult<any>>;
    runOperation<TRequest, TResponse>(operation: IAPIOperation<TRequest, TResponse>, req: TRequest): Promise<IAPIResult<TResponse>>;
}
