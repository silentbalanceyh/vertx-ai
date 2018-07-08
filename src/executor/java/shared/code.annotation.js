// @Path
const atPath = (annoRef, reference, uri) => {
    if (uri) {
        annoRef.push(`@Path("${uri}")`);
        reference.addImport(`javax.ws.rs.Path`);
    }
};
// @ <Method>
const atMethod = (annoRef, reference, method) => {
    if (method) {
        method = method.toUpperCase();
        annoRef.push(`@${method}`);
        reference.addImport(`javax.ws.rs.${method}`);
    }
};
// @Address
const atAddress = (annoRef, reference, api = {}, {
    addr, pkg
}) => {
    // Address
    let name = "ADDR" + api.uri.replace(/\//g, '_').replace(/-/g, '_') + `_${api.method}`;
    name = name.toUpperCase();
    addr = addr ? addr : 'Addr';
    annoRef.push(`@Address(${addr}.${name})`);
    reference.addImport(`io.vertx.up.annotations.Address`);
    reference.addImport(`${pkg}.cv.${addr}`);
};
// @EndPoint
const atEndPoint = (annoRef, reference) => {
    annoRef.push(`@EndPoint`);
    reference.addImport(`io.vertx.up.annotations.EndPoint`);
};
// @Queue
const atQueue = (annoRef, reference) => {
    annoRef.push(`@Queue`);
    reference.addImport(`io.vertx.up.annotations.Queue`);
};
module.exports = {
    atPath,
    atMethod,
    atAddress,
    atEndPoint,
    atQueue
};