package #PACKAGE#.output;

import #PACKAGE#.error._501#ALIAS#IoNullException;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.tp.atom.modeling.data.DataAtom;
import io.vertx.up.eon.em.ChangeFlag;
import io.vertx.up.fn.Fn;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.Function;

/*
 * 推送专用接口，执行推送的
 * ADD：添加
 * UPDATE：更新
 * DELETE：删除
 */
public interface #ALIAS#Io {

    /*
     * 专用实例化 #ALIAS#Io 专用方法，其他实现类是包域
     * 执行双重检查
     * 1. 第一个池是：ChangeFlag = Supplier
     * 2. 第二个池是：identifier = #ALIAS#Io（每种模型一个）
     */
    @SuppressWarnings("all")
    static #ALIAS#Io io(final ChangeFlag type, final DataAtom atom) {
        final Function<DataAtom, #ALIAS#Io> executor = Pool.IO_POOL_SUPPLIER.get(type);
        Fn.out(Objects.isNull(executor), _501#ALIAS#IoNullException.class, #ALIAS#Io.class, "Io");
        final ConcurrentMap<String, #ALIAS#Io> pool = Pool.IO_POOL.get(type);
        if (Objects.isNull(pool)) {
            return executor.apply(atom);
        } else {
            final String identifier = atom.identifier();
            return Fn.pool(pool, identifier, () -> executor.apply(atom));
        }
    }

    /*
     * 单量推送主逻辑
     */
    Future<JsonObject> pushAsync(JsonObject input);

    /**
     * 批量推送主逻辑
     * 内部调用单量执行专用接口
     */
    Future<JsonArray> pushAsync(JsonArray input);
}


interface Pool {

    ConcurrentMap<ChangeFlag, ConcurrentHashMap<String, #ALIAS#Io>> IO_POOL = new ConcurrentHashMap<ChangeFlag, ConcurrentHashMap<String, #ALIAS#Io>>() {
        {
            this.put(ChangeFlag.ADD, new ConcurrentHashMap<>());
            this.put(ChangeFlag.UPDATE, new ConcurrentHashMap<>());
            this.put(ChangeFlag.DELETE, new ConcurrentHashMap<>());
        }
    };

    ConcurrentMap<ChangeFlag, Function<DataAtom, #ALIAS#Io>> IO_POOL_SUPPLIER = new ConcurrentHashMap<ChangeFlag, Function<DataAtom, #ALIAS#Io>>() {
        {
            this.put(ChangeFlag.ADD, #ALIAS#IoAdd::new);
            this.put(ChangeFlag.UPDATE, #ALIAS#IoUpdate::new);
            this.put(ChangeFlag.DELETE, #ALIAS#IoDelete::new);
        }
    };
}
