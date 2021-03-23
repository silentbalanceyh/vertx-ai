package #PACKAGE#.plugin;

import cn.originx.scaffold.plugin.AbstractBefore;

public abstract class Abstract#ALIAS#Before extends AbstractBefore {
    /*
     *   this.atom: 和当前模型相关的 DataAtom 对象
     *   this.fabric：和当前通道直接绑定的字典翻译器
     *   this.logger(): 当前日志器
     *
     *   public Future<JsonObject> beforeAsync(JsonObject record, JsonObject options){
     *      // Before 前置插件（单记录）
     *      // options 对应 ServiceConfig 中配置的Json配置数据
     *   }
     *
     *
     *   public Future<JsonArray> beforeAsync(JsonArray records, JsonObject options){
     *      // Before 前置插件（批量记录）
     *      // options 对应 ServiceConfig 中配置的Json配置数据
     *   }
     */
}