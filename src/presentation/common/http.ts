export type HttpRequest = {
  body?: any;
  params?: any;
  headers?: any;
};

export type HttpResponse = {
  statusCode: number;
  body: any;
};

export const success = (body: any, statusCode: number = 200): HttpResponse => ({
  statusCode,
  body,
});

export const badRequest = (body: any, statusCode: number = 400): HttpResponse => ({
  statusCode,
  body,
});

export const serverError = (body: any, statusCode: number = 500): HttpResponse => ({
  statusCode,
  body,
});

export const unauthorized = (body: any, statusCode: number = 401): HttpResponse => ({
  statusCode,
  body,
});

export const forbidden = (body: any, statusCode: number = 403): HttpResponse => ({
  statusCode,
  body,
});

export const notFound = (body: any, statusCode: number = 404): HttpResponse => ({
  statusCode,
  body,
});
