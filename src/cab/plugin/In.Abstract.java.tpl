package #PACKAGE#.input;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.up.commune.config.Integration;
import io.vertx.up.uca.cosmic.AbstractWebClient;
import io.vertx.up.uca.cosmic.security.WebToken;
import io.vertx.up.unity.Ux;

public abstract class Abstract#ALIAS#In extends AbstractWebClient implements #ALIAS#In {

    public Abstract#ALIAS#In(final Integration integration) {
        super(integration);
    }

    @Override
    public WebToken token() {
        return null;
    }

    @Override
    public Future<JsonArray> readyAsync(final JsonArray input) {
        return Ux.future(input);
    }

    @Override
    public Future<JsonArray> fetchAsync() {
        return this.fetchAsync(null);
    }
}
