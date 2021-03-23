package #PACKAGE#.component;

import cn.originx.optic.advanced.AbstractHBatch;
import #PACKAGE#.input.#ALIAS#In;
import io.vertx.up.commune.config.Database;
import io.vertx.up.commune.config.Integration;
import io.vertx.up.commune.exchange.DictFabric;
import io.vertx.up.util.Ut;

public abstract class Abstract#ALIAS#Component extends AbstractHBatch {

    protected #ALIAS#In input() {
        final #ALIAS#In in = null;   // 创建 input 组件专用
        Ut.contract(in, Database.class, this.database());
        Ut.contract(in, Integration.class, this.integration());
        final DictFabric fabric = this.fabric.createCopy(this.mapping().child());
        Ut.contract(in, DictFabric.class, fabric);
        return in;
    }
    /*
     *  构造 Atomy 对象
     * @Override
     * public Future<Atomy> transferIn(final ActIn request) {
     *     final JsonObject criteria = new JsonObject();
     *     // 构造查询条件
     *     return this.dao().fetchAsync(criteria).compose(Ux::futureA)
     *                      // 构造新旧数据
     *                      // original - 旧数据
     *                      // normalized - 新数据
     *                      // ADD -> Atomy.create(new JsonArray(), original);    旧 Empty, 新 Data
     *                      // UPDATE -> Atomy.create(original, normalized);      旧 Data,  新 Data
     *                      // DELETE -> Atomy.create(original, new JsonArray()); 旧 Data,  新 Empty
     *                      .compose(original -> Ux.future(Atomy.create(new JsonArray(), original)))
     * }
     *
     * @Override
     * public Future<JsonArray> transferAsync(final Atomy atomy, final ActIn request,
     *                                        final DataAtom atom) {
     *      // Atomy.create(旧，新)
     *      // atomy.add(),             对比后新增数据
     *      // atomy.update(),          对比后更新数据
     *      // atomy.current(),         对比前新数据
     *      // atomy.original(),        对比前旧数据
     *      //
     *      // 更新 - #ALIAS#Io.ci(ChangeFlag.UPDATE, atom)::pushAsync)
     *      // 添加 - #ALIAS#Io.ci(ChangeFlag.ADD, atom)::pushAsync)
     *      // 删除 - #ALIAS#Io.ci(ChangeFlag.DELETE, atom)::pushAsync)
     *      return ....;
     * }
     *
     */
}
