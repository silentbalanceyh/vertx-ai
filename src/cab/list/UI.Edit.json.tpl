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
                        "$opSave,保存,SUBMIT,primary",
                        "$opDelete,删除,KEY",
                        "$opReset,重置,RESET"
                    ],
                    "span": 24
                }
            ]
        ],
        "hidden": [
            "key"
        ],
        "op": {
            "$opSave": "act.#IDENTIFIER#.save",
            "$opDelete": "act.#IDENTIFIER#.delete"
        }
    },
    "_modal": {
        "success": {
            "saved": "您好，您的#MODULE#信息更新成功！",
            "removed": "当前#MODULE#信息已删除成功！"
        }
    }
}