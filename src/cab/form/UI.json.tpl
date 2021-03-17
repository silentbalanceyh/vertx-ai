{
    "_form": {
        "ui": [
            [
                "title=#MODULE#基本信息"
            ],
            [
                {
                    "metadata": "$button",
                    "hidden": true,
                    "optionJsx.extension": [
                        "$opAdd,添加,SUBMIT,primary",
                        "$opSave,保存,SUBMIT,primary",
                        "$opDelete,删除,KEY",
                        "$opReset,重置,RESET"
                    ],
                    "span": 24
                }
            ]
        ],
        "hidden": [
        ],
        "initial":{
        },
        "op": {
            "$opAdd": "act.#IDENTIFIER#.add",
            "$opSave": "act.#IDENTIFIER#.save",
            "$opDelete": "act.#IDENTIFIER#.delete"
        }
    },
    "_modal": {
        "success": {
            "added": "您好，您的#MODULE#信息添加成功！",
            "saved": "您好，您的#MODULE#信息更新成功！",
            "removed": "当前#MODULE#信息已删除成功！"
        }
    }
}