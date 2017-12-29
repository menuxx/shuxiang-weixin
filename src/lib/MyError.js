
export class RouteError extends Error {

  constructor(code, nextRouteParams, message) {
    super(message)
    this.nextRouteParams = nextRouteParams
    this.code = code
  }

}
