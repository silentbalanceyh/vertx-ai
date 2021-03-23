package #PACKAGE#.output;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.tp.atom.modeling.data.DataAtom;
import io.vertx.up.unity.Ux;

/*
 * 添加推送
 */
class #ALIAS#Io#OP# extends Abstract#ALIAS#Io {

    public #ALIAS#Io#OP#(final DataAtom atom) {
        super(atom);
    }

    @Override
    public Future<JsonObject> pushAsync(final JsonObject input) {
        return Ux.futureJ();
    }
}
