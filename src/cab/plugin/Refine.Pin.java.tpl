package #PACKAGE#.refine;

import #PACKAGE#.cv.PbCv;
import io.vertx.core.json.JsonObject;
import io.vertx.up.commune.config.Integration;
import io.vertx.up.log.Annal;
import io.vertx.up.util.Ut;

import java.util.Objects;

class #ALIAS#Pin {

    private static final Annal LOGGER = Annal.get(#ALIAS#Pin.class);
    private static final JsonObject CONFIGURATION = new JsonObject();
    private static Integration INTEGRATION;

    static {
        /*
         * 默认：resources/plugin/#MODULE#/integration.json
         * 开发：resources/plugin/#MODULE#/integration-dev.json
         * 生产：resources/plugin/#MODULE#/integration-home.json
         */
        final JsonObject config = Ut.ioJObject(#ALIAS#Cv.INTEGRATION_FILE);
        if (Objects.nonNull(config)) {
            #ALIAS#Log.infoInit(LOGGER, "读取 #LOG_UP# 集成配置：\n{0}", config.encodePrettily());
            INTEGRATION = new Integration();
            INTEGRATION.fromJson(config);
        }

        /*
         * resources/plugin/#MODULE#/configuration.json
         */
        final JsonObject configuration = Ut.ioJObject(#ALIAS#Cv.CONFIGURATION_FILE);
        if (Ut.notNil(configuration)) {
            CONFIGURATION.mergeIn(configuration, true);
            #ALIAS#Log.infoInit(LOGGER, "读取 #LOG_UP# 核心配置：\n{0}", configuration.encodePrettily());
        }
    }

    /*
     * 数据结构
     {
         "endpoint": "集成专用 EndPoint",
         "port": "数值，端口号",
         "hostname": "主机地址，或IP",
         "username": "账号",
         "password": "密码",
         "apis": {
             "接口1-键": {
                 "path": "接口1-路径",
                 "method": "HTTP方法"
             },
             "接口2-键": {
                 "path": "接口2-路径",
                 "method": "HTTP方法"
             }
         },
         "options": {
             "debug": "布尔值，是否打开调试模式"
         }
     }
     */
    static Integration integration() {
        return INTEGRATION;
    }

    static JsonObject configuration() {
        return CONFIGURATION;
    }
}
