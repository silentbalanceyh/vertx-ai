package #PACKAGE#.refine;

import io.vertx.core.json.JsonObject;
import io.vertx.up.commune.config.Integration;
import io.vertx.up.log.Annal;

public class #ALIAS# {
    /*
     * 当前插件使用的日志器
     * Api：Api组件专用日志
     * Job：任务组件专用日志
     * Code：普通代码执行专用日志
     * Init：初始化流程专用日志
     */
    public static class Log {
        // Level = INFO级
        public static void infoApi(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.infoApi(logger, pattern, args);
        }

        public static void infoJob(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.infoJob(logger, pattern, args);
        }

        public static void infoCode(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.infoCode(logger, pattern, args);
        }

        public static void infoInit(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.infoInit(logger, pattern, args);
        }
        // Level = WARN级
        public static void warnApi(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.warnApi(logger, pattern, args);
        }

        public static void warnJob(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.warnJob(logger, pattern, args);
        }

        public static void warnCode(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.warnCode(logger, pattern, args);
        }

        public static void warnInit(final Class<?> clazz, final String pattern, final Object... args) {
            final Annal logger = Annal.get(clazz);
            #ALIAS#Log.warnInit(logger, pattern, args);
        }
    }

    // 集成信息
    public static Integration integration() {
        return #ALIAS#Pin.integration();
    }

    // 配置信息
    public static JsonObject configuration() {
        return #ALIAS#Pin.configuration();
    }
}
