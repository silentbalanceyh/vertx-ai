package #PACKAGE#.output;

import #PACKAGE#.refine.#ALIAS#;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.tp.atom.modeling.data.DataAtom;
import io.vertx.up.uca.cosmic.AbstractWebClient;
import io.vertx.up.uca.cosmic.security.WebToken;
import io.vertx.up.unity.Ux;

public abstract class Abstract#ALIAS#Io extends AbstractWebClient implements #ALIAS#Io {
    protected final transient DataAtom atom;

    public Abstract#ALIAS#Io(final DataAtom atom) {
        super(#ALIAS#.integration());
        this.atom = atom;
    }

    @Override
    public WebToken token() {
        /*
         * BasicToken 专用
         * 头部执行：
         * import io.vertx.up.uca.cosmic.security.BasicToken;
         *
         * 实现部分：
         * return new BasicToken(this.integration);
         */
        return null;
    }

    @Override
    public Future<JsonArray> pushAsync(final JsonArray input) {
        return Ux.thenCombine(input, this::pushAsync);
    }
}
