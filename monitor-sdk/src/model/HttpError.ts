export default class HttpError extends Error {
  status: number;
  responseText: string;
  cause: XMLHttpRequest;
  method: string;
  requestUrl: string;
  data: string;
  constructor(
    status: number,
    method: string,
    requestUrl: string,
    data: string,
    message: string,
    xhr: XMLHttpRequest
  ) {
    super(message);
    this.name = 'HTTP ERROR';
    this.status = status;
    this.responseText = xhr.responseText;
    this.cause = xhr;
    this.method = method;
    this.requestUrl = requestUrl;
    this.data = data;
  }
}
