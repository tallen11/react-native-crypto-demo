export enum Method {
    Get = 'GET',
}

export interface Headers {
    [key: string]: string
}

export default abstract class Request<ResponseType> {

    static BasePath = 'https://min-api.cryptocompare.com/data/';

    abstract get path(): string;
    abstract get method(): Method;
    abstract get headers(): Headers;
    abstract get body(): object | undefined;
    abstract get processResponse(): ((json: any) => ResponseType) | undefined;

    async start(): Promise<ResponseType> {
        const response = await fetch(Request.BasePath + this.path, {
            method: this.method,
            headers: {
                'Content-Type': 'application/json',
                ...this.headers,
            },
            body: JSON.stringify(this.body),
        });

        if (!response.ok) {
            return Promise.reject(new Error(`HTTP Code: ${response.status} | ${response.statusText}`));
        }

        const json = await response.json();

        if (this.processResponse != undefined) {
            return this.processResponse(json);
        }

        return <ResponseType>json;
    }
}
