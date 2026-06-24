class H_data_M {
    constructor(json_data, huim) {
        this.calculator_data = json_data["calculator_data"];
        this.huim = huim;
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

        this.instance_data = {
            "CUSTOM.prices.npc": 1,
            "CUSTOM.xp.alchemy": 0,
            "CUSTOM.xp.combat": 1,
            "CUSTOM.xp.farming": 0,
            "CUSTOM.xp.fishing": 0,
            "CUSTOM.xp.foraging": 0,
            "CUSTOM.xp.mining": 0,
            "CUSTOM.compacting.block.amount": 2,
            "CUSTOM.compacting.block.per": 8,
            "CUSTOM.compacting.compact.amount": 1,
            "CUSTOM.compacting.compact.per": 160,
            "CUSTOM_BLOCK.prices.npc": 4,
            "CUSTOM_BLOCK.xp.alchemy": 0,
            "CUSTOM_BLOCK.xp.combat": 4,
            "CUSTOM_BLOCK.xp.farming": 0,
            "CUSTOM_BLOCK.xp.fishing": 0,
            "CUSTOM_BLOCK.xp.foraging": 0,
            "CUSTOM_BLOCK.xp.mining": 0,
            "CUSTOM_BLOCK.compacting.compact.amount": 4,
            "CUSTOM_BLOCK.compacting.compact.per": 160,
            "ENCHANTED_CUSTOM.prices.npc": 160,
            "ENCHANTED_CUSTOM.xp.alchemy": 0,
            "ENCHANTED_CUSTOM.xp.combat": 160,
            "ENCHANTED_CUSTOM.xp.farming": 0,
            "ENCHANTED_CUSTOM.xp.fishing": 0,
            "ENCHANTED_CUSTOM.xp.foraging": 0,
            "ENCHANTED_CUSTOM.xp.mining": 0,
            "ENCHANTED_CUSTOM.compacting.compact.amount": 1,
            "ENCHANTED_CUSTOM.compacting.compact.per": 160,
            "ENCHANTED_CUSTOM_BLOCK.prices.npc": 25600,
            "ENCHANTED_CUSTOM_BLOCK.xp.alchemy": 0,
            "ENCHANTED_CUSTOM_BLOCK.xp.combat": 25600,
            "ENCHANTED_CUSTOM_BLOCK.xp.farming": 0,
            "ENCHANTED_CUSTOM_BLOCK.xp.fishing": 0,
            "ENCHANTED_CUSTOM_BLOCK.xp.foraging": 0,
            "ENCHANTED_CUSTOM_BLOCK.xp.mining": 0,
            "CUSTOM_MINION.drops": { "CUSTOM": 1 },
            "CUSTOM_MINION.speed.1": 1,
            "CUSTOM_MINION.speed.2": 2,
            "CUSTOM_MINION.speed.3": 3,
            "CUSTOM_MINION.speed.4": 4,
            "CUSTOM_MINION.speed.5": 5,
            "CUSTOM_MINION.speed.6": 6,
            "CUSTOM_MINION.speed.7": 7,
            "CUSTOM_MINION.speed.8": 8,
            "CUSTOM_MINION.speed.9": 9,
            "CUSTOM_MINION.speed.10": 10,
            "CUSTOM_MINION.speed.11": 11,
            "CUSTOM_MINION.speed.12": 12,
            "CUSTOM_MINION.storage.1": 15,
            "CUSTOM_MINION.storage.2": 15,
            "CUSTOM_MINION.storage.3": 15,
            "CUSTOM_MINION.storage.4": 15,
            "CUSTOM_MINION.storage.5": 15,
            "CUSTOM_MINION.storage.6": 15,
            "CUSTOM_MINION.storage.7": 15,
            "CUSTOM_MINION.storage.8": 15,
            "CUSTOM_MINION.storage.9": 15,
            "CUSTOM_MINION.storage.10": 15,
            "CUSTOM_MINION.storage.11": 15,
            "CUSTOM_MINION.storage.12": 15,
            "CUSTOM_MINION.afkcorrupt": 2,
            "PET_CUSTOM_PET.pet_type": "farming",
            "CUSTOM_RARITY.max_lvl_pet_xp_amount": 25353230,
            "PET_CUSTOM_PET.pet_prices.CUSTOM_RARITY.max": 20000000,
            "CUSTOM_UPGRADE.speed_boost": 0,
            "CUSTOM_UPGRADE.drop_multiplier": 1,
            "CUSTOM_UPGRADE.upgrade_effects.spreading": {},
            "CUSTOM_UPGRADE.upgrade_effects.adding": {},
            "CUSTOM_UPGRADE.upgrade_effects.cooldown.items": {},
            "CUSTOM_UPGRADE.upgrade_effects.cooldown.online_cooldown": 60,
            "CUSTOM_UPGRADE.upgrade_effects.cooldown.offline_cooldown": 60,
        };

        this.custom_inputs_edit_tree = {
            "Cancel": "Object to edit",
            "Materials": {
                "Cancel": "Material to edit",
                "Base Custom": {
                    "CUSTOM.prices.npc": {"dtype": "number", "display": "Base Custom NPC price", "options": null},
                    "CUSTOM.xp.alchemy": {"dtype": "number", "display": "Base Custom Alchemy XP", "options": null},
                    "CUSTOM.xp.combat": {"dtype": "number", "display": "Base Custom Combat XP", "options": null},
                    "CUSTOM.xp.farming": {"dtype": "number", "display": "Base Custom Farming XP", "options": null},
                    "CUSTOM.xp.fishing": {"dtype": "number", "display": "Base Custom Fishing XP", "options": null},
                    "CUSTOM.xp.foraging": {"dtype": "number", "display": "Base Custom Foraging XP", "options": null},
                    "CUSTOM.xp.mining": {"dtype": "number", "display": "Base Custom Mining XP", "options": null},
                    "CUSTOM.compacting.block.per": {"dtype": "number", "display": "Base Custom per Custom Block craft", "options": null},
                    "CUSTOM.compacting.block.amount": {"dtype": "number", "display": "Custom Block amount from craft", "options": null},
                    "CUSTOM.compacting.compact.per": {"dtype": "number", "display": "Base Custom per Enchanted Custom craft", "options": null},
                    "CUSTOM.compacting.compact.amount": {"dtype": "number", "display": "Enchanted Custom amount from craft", "options": null},
                },
                "Custom Block": {
                    "CUSTOM_BLOCK.prices.npc": {"dtype": "number", "display": "Custom Block NPC price", "options": null},
                    "CUSTOM_BLOCK.xp.alchemy": {"dtype": "number", "display": "Custom Block Alchemy XP", "options": null},
                    "CUSTOM_BLOCK.xp.combat": {"dtype": "number", "display": "Custom Block Combat XP", "options": null},
                    "CUSTOM_BLOCK.xp.farming": {"dtype": "number", "display": "Custom Block Farming XP", "options": null},
                    "CUSTOM_BLOCK.xp.fishing": {"dtype": "number", "display": "Custom Block Fishing XP", "options": null},
                    "CUSTOM_BLOCK.xp.foraging": {"dtype": "number", "display": "Custom Block Foraging XP", "options": null},
                    "CUSTOM_BLOCK.xp.mining": {"dtype": "number", "display": "Custom Block Mining XP", "options": null},
                    "CUSTOM_BLOCK.compacting.compact.per": {"dtype": "number", "display": "Custom Block per Enchanted Custom craft", "options": null},
                    "CUSTOM_BLOCK.compacting.compact.amount": {"dtype": "number", "display": "Enchanted Custom amount from craft", "options": null},
                },
                "Enchanted Custom": {
                    "ENCHANTED_CUSTOM.prices.npc": {"dtype": "number", "display": "Enchanted Custom NPC price", "options": null},
                    "ENCHANTED_CUSTOM.xp.alchemy": {"dtype": "number", "display": "Enchanted Custom Alchemy XP", "options": null},
                    "ENCHANTED_CUSTOM.xp.combat": {"dtype": "number", "display": "Enchanted Custom Combat XP", "options": null},
                    "ENCHANTED_CUSTOM.xp.farming": {"dtype": "number", "display": "Enchanted Custom Farming XP", "options": null},
                    "ENCHANTED_CUSTOM.xp.fishing": {"dtype": "number", "display": "Enchanted Custom Fishing XP", "options": null},
                    "ENCHANTED_CUSTOM.xp.foraging": {"dtype": "number", "display": "Enchanted Custom Foraging XP", "options": null},
                    "ENCHANTED_CUSTOM.xp.mining": {"dtype": "number", "display": "Enchanted Custom Mining XP", "options": null},
                    "ENCHANTED_CUSTOM.compacting.compact.per": {"dtype": "number", "display": "Enchanted Custom per Enchanted Custom Block craft", "options": null},
                    "ENCHANTED_CUSTOM.compacting.compact.amount": {"dtype": "number", "display": "Enchanted Custom Block amount from craft", "options": null},
                },
                "Enchanted Custom Block": {
                    "ENCHANTED_CUSTOM_BLOCK.prices.npc": {"dtype": "number", "display": "Enchanted Custom Block NPC price", "options": null},
                    "ENCHANTED_CUSTOM_BLOCK.xp.alchemy": {"dtype": "number", "display": "Enchanted Custom Block Alchemy XP", "options": null},
                    "ENCHANTED_CUSTOM_BLOCK.xp.combat": {"dtype": "number", "display": "Enchanted Custom Block Combat XP", "options": null},
                    "ENCHANTED_CUSTOM_BLOCK.xp.farming": {"dtype": "number", "display": "Enchanted Custom Block Farming XP", "options": null},
                    "ENCHANTED_CUSTOM_BLOCK.xp.fishing": {"dtype": "number", "display": "Enchanted Custom Block Fishing XP", "options": null},
                    "ENCHANTED_CUSTOM_BLOCK.xp.foraging": {"dtype": "number", "display": "Enchanted Custom Block Foraging XP", "options": null},
                    "ENCHANTED_CUSTOM_BLOCK.xp.mining": {"dtype": "number", "display": "Enchanted Custom Block Mining XP", "options": null},
                }
            },
            "Custom Minion": {
                "Cancel": "Attribute to edit",
                "Drops": {
                    "CUSTOM_MINION.drops": {"dtype": "object", "display": "Minion drops"}
                },
                "Action Time": {
                    "CUSTOM_MINION.speed.1": {"dtype": "number", "display": "Action time (s) t1", "options": null},
                    "CUSTOM_MINION.speed.2": {"dtype": "number", "display": "Action time (s) t2", "options": null},
                    "CUSTOM_MINION.speed.3": {"dtype": "number", "display": "Action time (s) t3", "options": null},
                    "CUSTOM_MINION.speed.4": {"dtype": "number", "display": "Action time (s) t4", "options": null},
                    "CUSTOM_MINION.speed.5": {"dtype": "number", "display": "Action time (s) t5", "options": null},
                    "CUSTOM_MINION.speed.6": {"dtype": "number", "display": "Action time (s) t6", "options": null},
                    "CUSTOM_MINION.speed.7": {"dtype": "number", "display": "Action time (s) t7", "options": null},
                    "CUSTOM_MINION.speed.8": {"dtype": "number", "display": "Action time (s) t8", "options": null},
                    "CUSTOM_MINION.speed.9": {"dtype": "number", "display": "Action time (s) t9", "options": null},
                    "CUSTOM_MINION.speed.10": {"dtype": "number", "display": "Action time (s) t10", "options": null},
                    "CUSTOM_MINION.speed.11": {"dtype": "number", "display": "Action time (s) t11", "options": null},
                    "CUSTOM_MINION.speed.12": {"dtype": "number", "display": "Action time (s) t12", "options": null},
                },
                "Storage": {
                    "CUSTOM_MINION.storage.1": {"dtype": "number", "display": "Storage (slots) t1", "options": null},
                    "CUSTOM_MINION.storage.2": {"dtype": "number", "display": "Storage (slots) t2", "options": null},
                    "CUSTOM_MINION.storage.3": {"dtype": "number", "display": "Storage (slots) t3", "options": null},
                    "CUSTOM_MINION.storage.4": {"dtype": "number", "display": "Storage (slots) t4", "options": null},
                    "CUSTOM_MINION.storage.5": {"dtype": "number", "display": "Storage (slots) t5", "options": null},
                    "CUSTOM_MINION.storage.6": {"dtype": "number", "display": "Storage (slots) t6", "options": null},
                    "CUSTOM_MINION.storage.7": {"dtype": "number", "display": "Storage (slots) t7", "options": null},
                    "CUSTOM_MINION.storage.8": {"dtype": "number", "display": "Storage (slots) t8", "options": null},
                    "CUSTOM_MINION.storage.9": {"dtype": "number", "display": "Storage (slots) t9", "options": null},
                    "CUSTOM_MINION.storage.10": {"dtype": "number", "display": "Storage (slots) t10", "options": null},
                    "CUSTOM_MINION.storage.11": {"dtype": "number", "display": "Storage (slots) t11", "options": null},
                    "CUSTOM_MINION.storage.12": {"dtype": "number", "display": "Storage (slots) t12", "options": null},
                },
                "AFK corrupt multiplier": {
                    "CUSTOM_MINION.afkcorrupt": {"dtype": "number", "display": "AFK corrupt multiplier", "options": null}
                }
            },
            "Custom Upgrade": {
                "Cancel": "Attribute to edit",
                "General": {
                    "custom_upgrade_toggle": null,
                    "CUSTOM_UPGRADE.speed_boost": {"dtype": "number", "display": "Custom Upgrade Speed boost", "options": null},
                    "CUSTOM_UPGRADE.drop_multiplier": {"dtype": "number", "display": "Custom Upgrade Drop multiplier", "options": null},
                    "CUSTOM_UPGRADE.upgrade_effects.cooldown.online_cooldown": {"dtype": "number", "display": "Custom Upgrade Online Cooldown", "options": null},
                    "CUSTOM_UPGRADE.upgrade_effects.cooldown.offline_cooldown": {"dtype": "number", "display": "Custom Upgrade Offline Cooldown", "options": null},
                },
                "Spreading effect": {
                    "CUSTOM_UPGRADE.upgrade_effects.spreading": {"dtype": "object", "display": "Spreading drops"}
                },
                "Adding effect": {
                    "CUSTOM_UPGRADE.upgrade_effects.adding": {"dtype": "object", "display": "Adding drops"}
                },
                "Cooldown effect": {
                    "CUSTOM_UPGRADE.upgrade_effects.cooldown.items": {"dtype": "object", "display": "Cooldown drops"}
                }
            },
            "Custom Pet": {
                "PET_CUSTOM_PET.pet_type": {"dtype": "string", "display": "Pet Type", "options": ["all", "alchemy", "combat", "enchanting", "farming", "fishing", "foraging", "mining"]},
                "CUSTOM_RARITY.max_lvl_pet_xp_amount": {"dtype": "number", "display": "Custom Rarity max Pet XP", "options": null},
                "PET_CUSTOM_PET.pet_prices.CUSTOM_RARITY.max": {"dtype": "number", "display": "Custom Pet profit per pet", "options": null}
            }
        };

        // self.huim.check_json(self.instance_data_file, self.instance_data)
        // self.instance_data.update(self.huim.read_json(self.instance_data_file))
        for (let [data_loc, data_val] of Object.entries(this.instance_data)) {
            this.set_data(data_loc, data_val); 
        };
    };

    has_data_tag(data_ID, tag) {
        if (!(data_ID in this.calculator_data)) {
            console.log(`ERROR - has_data_tag - data ID ${data_ID} not in calculator data`);
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

    get_data(data_location) {
        let data_pointer = this.calculator_data;
        let data_location_keys = data_location.split(".");
        for (let key of data_location_keys) {
            if (!(key in data_pointer)) {
                return null;
            };
            data_pointer = data_pointer[key];
        };
        return data_pointer;
    };

    set_data(data_location, data_value) {
        let data_pointer = this.calculator_data;
        let data_location_keys = data_location.split(".");
        let set_location = data_location_keys.slice(-1)[0];
        for (let key of data_location_keys) {
            if (key === set_location) {
                data_pointer[key] = data_value;
            } else {
                if (!(key in data_pointer)) {
                    data_pointer[key] = {};
                };
                data_pointer = data_pointer[key];
            };
        };
        return;
    };

    save_instance_data() {
        return;
    };

    create_custom_inputs_edit_vars(option_tree, choice_layer) {
        if ("Cancel" in option_tree) {
            this.huim.new_edit_vars("custom_input_" + choice_layer, {"custom_input_edit_choice": {"dtype": "string", "display": option_tree["Cancel"], "initial": "Cancel", "options": Object.keys(option_tree)}}, (results) => this.huim.edit_vars.bind(this.huim)("custom_input_" + results["custom_input_edit_choice"]));
            for (let next_layer of Object.keys(option_tree)) {
                if (next_layer === "Cancel") {
                    continue;
                };
                this.create_custom_inputs_edit_vars.bind(this)(option_tree[next_layer], next_layer);
            };
            return;
        };
        let input_variables = {};
        for (let [data_loc, custom_input_options] of Object.entries(option_tree)) {
            input_variables[data_loc] = custom_input_options;
            if (custom_input_options === null) {
                continue;
            };
            input_variables[data_loc]["initial"] = this.get_data(data_loc);
        };
        this.huim.new_edit_vars("custom_input_" + choice_layer, input_variables, (results) => this.set_custom_inputs.bind(this)(results));
        return;
    };

    set_custom_inputs(edited_data_locs) {
        for (let [data_loc, data_value] of Object.entries(edited_data_locs)) {
            if (data_value instanceof Object) {
                for (let [item_id, value] of Object.entries(data_value)) {
                    if (!(typeof value === "number") || !(item_id in this.calculator_data)) {
                        delete data_value[item_id];
                        this.huim.fill_list_box(data_loc + "_listbox", Array.from(Object.entries(data_value), (entry) => `${entry[0]}: ${entry[1]}`));
                    };
                };
            };
            this.set_data(data_loc, data_value);
        };
        return;
    };
};
