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
            "$opAdd": "act.#IDENTIFIER#.add"
        }
    },
    "_modal": {
        "success": {
            "added": "您好，您的#MODULE#信息添加成功！"
        }
    }
}