package #PACKAGE#.input;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

/*
 * 数据读取专用接口
 */
public interface #ALIAS#In {

    /*
     * 预处理数据专用接口
     */
    Future<JsonArray> readyAsync(JsonArray input);

    /*
     * 读取所有信息
     */
    Future<JsonArray> fetchAsync();

    Future<JsonArray> fetchAsync(JsonObject params);

    Future<JsonObject> oneAsync(JsonObject params);
}
