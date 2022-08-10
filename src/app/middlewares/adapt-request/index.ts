
type $AdaptRequestInterface = {
    path: string,
    method: any,
    params: any,
    query: any,
    body: Object|undefined,
    headers: Object|undefined
}
export default function adaptRequest(req:any= {}, res:any, next:any){
    req = Object.freeze({
        path: req.path,
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers
    } as $AdaptRequestInterface)
    next()
}