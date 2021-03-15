# T0004 - Zero的服务通讯分析器

Zero框架：[http://www.vertxup.cn](http://www.vertxup.cn)

该框架中服务和服务之间的通讯使用了gRpc，如果使用标准的官方教程书写了服务通讯代码，该命令可以通过扫描所有的源代码目录生成服务通讯的报表信息，解释服务和服务之间的相关通信。主命令：

```shell
ai ipc
```

## 0.限制

* 该命令只会扫描zero框架中的gRpc的客户端和服务端代码，服务端扫描`@Ipc`部分，客户端扫描`Ux.thenRpc`部分（标准），其他代码行不会被扫描；
* 该命令只适用于`Maven`项目的扫描，会判断目录下是否包含了`pom.xml`文件，并且项目的源代码目录只能是：`src/main/java`作为根目录；

## 1.运行命令

```shell
> ai ipc

[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.11  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "out": "."
}
[Zero AI] [ IPC ] 地址：IPC://TOKEN/VERIFY                            客户端：htl-agent       -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/EMPLOYEE/BY/USER-ID                客户端：htl-auth        -->       服务端：htl-res        自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/MENUS/BY/ROLE                      客户端：htl-datum       -->       服务端：htl-work       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USERS/IN/KEYS                      客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/MEMBERS/IN/MEMBER-ID               客户端：htl-res         -->       服务端：htl-work       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USERS/IN/KEYS                      客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/KEY                           客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/PUT                           客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/POST                          客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/DELETE                        客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USERS/IN/KEYS                      客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/KEY                           客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/PUT                           客户端：htl-res         -->       服务端：htl-auth       自调用：否                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/USER/POST                          客户端：htl-res         -->       服务端：htl-auth       自调用：否
......
[Zero AI] [ IPC ] 地址：IPC://ADDR/ROOM-TYPES/GET/BY/HOTEL-ID         客户端：htl-work        -->       服务端：htl-work       自调用：是                                  
[Zero AI] [ IPC ] 地址：IPC://ADDR/TABULAR/AND/GET                    客户端：htl-work        -->       服务端：htl-datum      自调用：否                                  
[Zero AI] [ IPC ] 分析完成！！！
```

## 2.参数说明

| 参数格式 | 必填 | 说明 |
| :--- | :--- | :--- |
| -o, --out | 否 | 默认值【.】，默认的项目根目录路径。 |

### 3.报表说明

报表主要分为四列：

1. 第一列是当前IPC的地址信息，一个String格式；
2. 第二列是调用该IPC地址的客户端项目名称；
3. 第三列是调用该IPC地址的服务端项目名称；
4. 最后一列是开发人员关心的，就是IPC中的调用是否存在自调用（自己调用自己的情况），自调用为是会显示成红色，这种需要修该成本地Service调用过程。



