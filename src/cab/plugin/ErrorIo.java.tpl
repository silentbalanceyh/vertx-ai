package #PACKAGE#.error;

import io.vertx.core.http.HttpStatusCode;
import io.vertx.up.exception.WebException;

public class _501#ALIAS#IoNullException extends WebException {
    public _501#ALIAS#IoNullException(final Class<?> clazz,
                                      final String type) {
        super(clazz, type);
    }

    @Override
    public int getCode() {
        /*
         * 必须在 vertx-error.yml 文件中定义该值
         * 1）值小于0
         * 2）必须是小于 -100000 的值
         */
        return -1;
    }

    @Override
    public HttpStatusCode getStatus() {
        return HttpStatusCode.NOT_IMPLEMENTED;
    }
}