package #PACKAGE#.refine;

import io.vertx.up.log.Annal;

class #ALIAS#Log {
    private static void info(final Annal logger,
                             final String flag, final String pattern, final Object... args) {
        logger.info("[ #LOG_UP# ] ( " + flag + " ) " + pattern, args);
    }

    private static void warn(final Annal logger,
                             final String flag, final String pattern, final Object... args) {
        logger.warn("[ #LOG_UP# ] ( " + flag + " ) " + pattern, args);
    }

    static void infoInit(final Annal logger, final String pattern, final Object... args) {
        info(logger, "初始化", pattern, args);
    }

    static void infoCode(final Annal logger, final String pattern, final Object... args) {
        info(logger, "执行", pattern, args);
    }

    static void infoApi(final Annal logger, final String pattern, final Object... args) {
        info(logger, "Api访问", pattern, args);
    }

    static void infoJob(final Annal logger, final String pattern, final Object... args) {
        info(logger, "任务执行", pattern, args);
    }

    static void warnInit(final Annal logger, final String pattern, final Object... args) {
        warn(logger, "初始化", pattern, args);
    }

    static void warnCode(final Annal logger, final String pattern, final Object... args) {
        warn(logger, "执行", pattern, args);
    }

    static void warnApi(final Annal logger, final String pattern, final Object... args) {
        warn(logger, "Api访问", pattern, args);
    }

    static void warnJob(final Annal logger, final String pattern, final Object... args) {
        warn(logger, "任务执行", pattern, args);
    }
}
