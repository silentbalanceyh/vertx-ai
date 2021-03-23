package #PACKAGE#.plugin;

import cn.originx.scaffold.plugin.AbstractAfter;

public abstract class Abstract#ALIAS#After extends AbstractAfter {
    /*
     *   this.atom: 和当前模型相关的 DataAtom 对象
     *   this.fabric：和当前通道直接绑定的字典翻译器
     *   this.logger(): 当前日志器
     *
     *   public Future<JsonObject> afterAsync(JsonObject record, JsonObject options){
     *      // Before 后置插件（单记录）
     *      // options 对应 ServiceConfig 中配置的Json配置数据
     *   }
     *
     *
     *   public Future<JsonArray> afterAsync(JsonArray records, JsonObject options){
     *      // Before 后置插件（批量记录）
     *      // options 对应 ServiceConfig 中配置的Json配置数据
     *   }
     */
}