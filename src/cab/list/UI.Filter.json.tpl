{
    "_form": {
        "window": -0.3,
        "ui": [
            [
                {
                    "metadata": "connector,连接符,24,,aiRadio",
                    "optionJsx.config.items": [
                        "OR,或（OR）",
                        "AND,并（AND）"
                    ]
                }
            ],
            [
                {
                    "metadata": "$button",
                    "optionJsx.extension": [
                        "$opFilter,搜索,SUBMIT,primary",
                        "$opReset,重置,RESET"
                    ],
                    "span": 24
                }
            ]
        ],
        "op": {
            "$opFilter": "act.#IDENTIFIER#.filter"
        }
    }
}