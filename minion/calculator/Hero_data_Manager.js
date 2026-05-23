class H_data_M {
    constructor(json_data) {
        this.calculator_data = json_data["calculator_data"]

        this.inferno_fuel_data = {
            'grades': { 'HYPERGOLIC_GABAGOOL': 20, 'HEAVY_GABAGOOL': 15, 'FUEL_GABAGOOL': 10 },
            'distilates': {
                'MAGMA_CREAM_DISTILLATE': ["MAGMA_CREAM", 2],
                'BLAZE_ROD_DISTILLATE': ["BLAZE_ROD", 1],
                'NETHER_STALK_DISTILLATE': ["NETHER_STALK", 5],
                'GLOWSTONE_DUST_DISTILLATE': ["GLOWSTONE_DUST", 2.5],
                'CRUDE_GABAGOOL_DISTILLATE': ["CRUDE_GABAGOOL", 1]
            },
            'drops': {
                'CHILI_PEPPER': 1 / 136,
                'INFERNO_VERTEX': 1 / 5950,
                'INFERNO_APEX': 1 / 1309091,
                'REAPER_PEPPER': 1 / 458182,
                'GABAGOOL_THE_FISH': 1 / 3927273
            },
        };

        this.standard_storage = { 1: 1, 2: 3, 3: 3, 4: 6, 5: 6, 6: 9, 7: 9, 8: 12, 9: 12, 10: 15, 11: 15, 12: 15 };
    };

    has_data_tag(data_ID, tag) {
        if (!(data_ID in this.calculator_data)) {
            console.log(`ERROR - has_data_tag - data ID {data_ID} not in calculator data`);
            return false;
        };
        if (tag === null) {
            return false
        }
        if (tag.length === 0) {
            return true
        }
        if (data_ID === tag || tag.includes(data_ID)) {
            return true;
        };
        if (!("tags" in this.calculator_data[data_ID])) {
            return false;
        };
        if (typeof tag === "string" && this.calculator_data[data_ID]["tags"].includes(tag)) {
            return true;
        };
        if (!(tag instanceof Array)) {
            return false;
        };
        for (const search_tag of tag) {
            if (this.calculator_data[data_ID]["tags"].includes(search_tag)) {
                return true;
            };
        };
        return false;
    };

    minion_cost_sum(minion_type, final_tier) {
        let final_cost = {};
        for (let tier = 1; tier <= final_tier; tier++) {
            for (let [item, amount] of Object.entries(minionCosts[minion_type][tier])) {
                if (!(item in final_cost)) {
                    final_cost[item] = 0;
                }
                final_cost[item] += amount;
            };
        };
        return JSON.parse(JSON.stringify(final_cost));
    };
};
