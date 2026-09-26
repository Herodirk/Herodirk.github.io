
class Calc_add_ons {
    constructor(calculator) {
        this.calc = calculator

        this.calc.gui.new_edit_vars("basic_minion_loop", {
            "setup_cost_limit": {"dtype": "number", "display": "Setup Cost Limit", "initial": 0, "options": null},
            "auto_crystal": {"dtype": "boolean", "display": "Automatic Crystal", "initial": true, "options": null},
            "auto_afkpet": {"dtype": "boolean", "display": "Automatic AFK Pet", "initial": true, "options": null},
            "markdown_output": {"dtype": "boolean", "display": "Markdown Output", "initial": true, "options": null}
        }, (results) => this.basic_minion_loop.bind(this)(results));
        this.calc.gui.new_edit_vars("inferno_minion_loop", {"setup_cost_limit": {"dtype": "number", "display": "Setup Cost Limit", "initial": 0, "options": null}, "amount_limit": {"dtype": "number", "display": "Minion Amount Limit", "initial": 32, "options": null}, "markdown_output": {"dtype": "boolean", "display": "Markdown Output", "initial": true, "options": null}}, (results) => this.inferno_minion_loop.bind(this)(results));
        this.calc.gui.new_edit_vars("collection_maxing", {"sort_by": {"dtype": "string", "display": "Sort By", "initial": "Fastest Time", "options": ["Fastest Time", "Lowest Setup Cost", "Lowest Total Cost"]}, "time_limit": {"dtype": "number", "display": "Time Limit", "initial": 0, "options": null}, "setup_cost_limit": {"dtype": "number", "display": "Setup Cost Limit", "initial": 0, "options": null}, "amount_limit": {"dtype": "number", "display": "Minion Amount Limit", "initial": 32, "options": null}, "markdown_output": {"dtype": "boolean", "display": "Markdown Output", "initial": true, "options": null}}, (results) => this.collection_maxing.bind(this)(results));
        this.calc.gui.new_edit_vars("partial_setup_cost", Object.fromEntries(Array.from(Object.entries({"minion": "Minion", "fuel": "Fuel", "hopper": "Hopper", "upgrade1": "Upgrade 1", "upgrade2": "Upgrade 2", "infusion": "Infusion", "free_will": "Free Will", "chest": "Chest", "beacon": "Beacon", "crystal": "Crystal", "postcard": "Postcard", "potato_accessory": "Potato Accessory","pet_exp_boost": "Pet EXP Boost","expshareitem": "EXP Share Item","toucan_attribute": "Toucan Shards","falcon_attribute": "Falcon Shards"}), entry => [entry[0], {"dtype": "boolean", "display": entry[1], "initial": true, "options": null}])), (results) => this.partial_setup_cost.bind(this)(results));

        this.reverse_affected_minions = {
            "afkpet": {},
            "crystal": {}
        };
        for (let modifier_key of Object.keys(this.reverse_affected_minions)) {
            for (let modifier_id of Object.values(this.calc.input_options[modifier_key])) {
                if (modifier_id === "NONE") {
                    continue;
                };
                for (let affected_minion of this.calc.md.calculator_data[modifier_id]["affected_minions"]) {
                    if (affected_minion in this.calc.md.calculator_data) {
                        this.reverse_affected_minions[modifier_key][affected_minion] = modifier_id;
                        continue;
                    };
                    for (let minion_id of Object.values(this.calc.input_options["minion"])) {
                        if (this.calc.md.has_data_tag(minion_id, affected_minion)) {
                            this.reverse_affected_minions[modifier_key][minion_id] = modifier_id;
                        };
                    };
                };
            };
        };

        this.add_ons_data = {
            "Minion Crafting": {"function": this.craft_material_amount.bind(this), "auto_run": "post"},
            "Crystal and Pet": {"function": this.crystal_and_pet.bind(this), "auto_run": "pre"},
            "Dragon Pet Source Prices": {"function": this.dragon_source_prices.bind(this), "auto_run": "pre"},
            "Partial Setup Cost": {"function": this.partial_setup_cost_inputs.bind(this), "auto_run": "post"},
            "Days to Repay Setup": {"function": this.setup_repay_time.bind(this), "auto_run": "post"},
            "Basic Minion Loop": {"function": this.basic_minion_loop_inputs.bind(this), "auto_run": "post"},
            "Bad Luck Inferno": {"function": this.bad_luck_inferno.bind(this), "auto_run": "post"},
            "Inferno Minion Loop": {"function": this.inferno_minion_loop_inputs.bind(this), "auto_run": "post"},
            "Exact Pet Levelling": {"function": this.exact_pet_levelling_inputs.bind(this), "auto_run": "post"},
            "Chili Pepper Collection": {"function": this.collection_maxing_inputs.bind(this), "auto_run": "post"},
        };
    };

    craft_material_amount() {
        let setup_data = this.calc.gui.get_from_GUI(["minion", "miniontier", "amount", "extracost"]);
        const materials = this.calc.md.minion_cost_sum(setup_data["minion"], setup_data["miniontier"]);
        const extra_costs_string = setup_data["extracost"]
        let materials_string = Object.keys(materials).filter(material => material in this.calc.md.calculator_data).map(material => `${materials[material] * setup_data["amount"]} ${this.calc.md.calculator_data[material]["display"]}`).join(", ");
        if (extra_costs_string !== "None") {
            materials_string += ", " + extra_costs_string;
        };
        this.calc.collect_add_on_output("Minion Crafting Materials", materials_string);
        return;
    };

    crystal_and_pet(minion_id=null, return_outputs=false) {
        if (minion_id === null) {
            minion_id = this.calc.minion.get();
        };
        let outputs = {};
        for (let modifier_key of Object.keys(this.reverse_affected_minions)) {
            let result = "NONE";
            if (minion_id in this.reverse_affected_minions[modifier_key]) {
                result = this.reverse_affected_minions[modifier_key][minion_id];
            };
            if (return_outputs) {
                outputs[modifier_key] = result;
            } else {
                this.calc.var_dict[modifier_key].set(result, true);
            };
            if (modifier_key === "afkpet") {
                let afkpet_level = 100;
                if (result === "NONE") {
                    afkpet_level = 0;
                };
                if (return_outputs) {
                    outputs["afkpet_lvl"] = afkpet_level;
                } else {
                    this.calc.afkpet_lvl.set(afkpet_level);
                };
            };
        };
        if (return_outputs) {
            return outputs;
        };
        return;
    };

    async dragon_source_prices() {
        let dragon_pet_recipes = {
            "PET_GOLDEN_DRAGON": {
                "COIN": 500000000,
                "ENCHANTED_GOLD_BLOCK": 50,
                "PERFECT_AMETHYST_GEM": 1,
                "PERFECT_JADE_GEM": 1,
                "PERFECT_SAPPHIRE_GEM": 1,
                "PERFECT_AMBER_GEM": 1,
                "PERFECT_TOPAZ_GEM": 1
            },
            "PET_JADE_DRAGON": {
                "COIN": 500000000,
                "STARLYN_PRIZE": 20,
                "FIGSTONE": 64,
                "MANGCORE": 64,
                "HELIXIS": 64,
            },
            "PET_ROSE_DRAGON": {
                "COIN": 500000000,
                "COPPER": 20000,
                "CONDENSED_HELIANTHUS": 5,
                "GLASSCORN": 1,
                "DEVOURER": 1,
                "ALL_IN_ALOE": 1,
                "PHANTOMLEAF": 1,
                "TIMESTALK": 1,
            }
        };
        let setup_data = this.calc.gui.get_from_GUI(this.calc.ID_order);
        let coins_per_copper = [];
        for (let [mutation, base_copper] of Object.entries({ "ALL_IN_ALOE": 2300, "PHANTOMLEAF": 1500, "ZOMBUD": 500, "FLESHTRAP": 180 })) {
            coins_per_copper.push((this.calc.get_price(mutation, setup_data, "buy", "bazaar") + base_copper * 2000) / (base_copper * 1.6));
        };
        this.calc.md.calculator_data["COPPER"]["prices"]["custom"] = Math.min(...coins_per_copper);

        let updated_pets = [];
        for (let pet_slot of ["levelingpet", "expsharepet", "expsharepetslot2", "expsharepetslot3"]) {
            if (!(this.calc.md.has_data_tag(setup_data[pet_slot], ["dragon_pet", "dragon_egg_pet"]))) {
                continue;
            };
            if (updated_pets.includes(setup_data[pet_slot])) {
                continue;
            };
            await this.calc.update_pet_price(setup_data[pet_slot], setup_data[pet_slot + "_rarity"]);
            updated_pets.push(setup_data[pet_slot]);
            let dragon_base_id = setup_data[pet_slot].replaceAll("_EGG", "");
            let source_cost = 0;
            for (let [item_id, amount] of Object.entries(dragon_pet_recipes[dragon_base_id])) {
                source_cost += amount * this.calc.get_price(item_id, setup_data, "buy", "bazaar");
            };
            this.calc.md.calculator_data[setup_data[pet_slot]]["pet_prices"][setup_data[pet_slot + "_rarity"]]["min"] = source_cost;
        };
        return;
    };

    setup_repay_time() {
        // Outputs the time (in days) it take for a setup to repay itself
        let setup_data = this.calc.gui.get_from_GUI(["time_seconds", "setupcost", "free_will", "total_profit"]);
        let setupcost = setup_data["setupcost"];
        let profit = setup_data["total_profit"];
        if (profit < 0) {
            this.calc.collect_add_on_output("Setup Repay Time", "Negative profit, cannot repay");
            return;
        };
        let profitpersecond = profit / setup_data["time_seconds"];
        let repay_time_s = setupcost / profitpersecond;
        if (profitpersecond === Infinity || repay_time_s === Infinity) {
            this.calc.collect_add_on_output("Setup Repay Time", "Division by zero");
            return;
        };
        let repay_time = GUI.round_number(repay_time_s / 86400);
        this.calc.collect_add_on_output("Setup Repay Time", `${repay_time} Days`);
        return;
    };

    async basic_minion_loop(results) {
        let setup_data = this.calc.gui.get_from_GUI(this.calc.ID_order);
        let cost_filter = results["setup_cost_limit"];
        if (cost_filter === 0) {
            cost_filter = Infinity;
        };
        let auto_crystal = results["auto_crystal"];
        let auto_afkpet = results["auto_afkpet"];
        let markdown_output = results["markdown_output"];
        let calculated_setup_profits = {};
        let calculated_setup_costs = {};
        const loop_minion_options = Object.values(this.calc.input_options["minion"]);
        const loop_minion_skip = ["CUSTOM_MINION"];
        const loop_minion_smelting = ["IRON_MINION", "GOLD_MINION", "CACTUS_MINION"];
        let super_compactor = false;
        if (["SUPER_COMPACTOR_3000", "DWARVEN_COMPACTOR"].includes(setup_data["upgrade1"])) {
            super_compactor = true;
        };
        if (["SUPER_COMPACTOR_3000", "DWARVEN_COMPACTOR"].includes(setup_data["upgrade2"])) {
            super_compactor = true;
            setup_data["upgrade2"] = setup_data["upgrade1"];
            setup_data["upgrade1"] = "SUPER_COMPACTOR_3000";
        };
        
        const upgrades = [setup_data["upgrade1"], setup_data["upgrade2"]]
        let outputs;
        for (const loop_minion of loop_minion_options) {
            if (loop_minion_skip.includes(loop_minion)) {
                continue;
            };
            if (upgrades.includes("CORRUPT_SOIL") && !(this.calc.md.has_data_tag(loop_minion, "mob_minion"))) {
                continue;
            };
            setup_data["minion"] = loop_minion;
            setup_data["miniontier"] = Number(Object.keys(this.calc.md.calculator_data[loop_minion]["speed"]).slice(-1)[0]);
            if (super_compactor) {
                if (loop_minion_smelting.includes(loop_minion)) {
                    setup_data["upgrade1"] = "DWARVEN_COMPACTOR";
                } else {
                    setup_data["upgrade1"] = "SUPER_COMPACTOR_3000";
                };
            };
            let auto_crystal_and_pet;
            if (auto_crystal || auto_afkpet) {
                auto_crystal_and_pet = this.crystal_and_pet(setup_data["minion"], true);
            };
            if (auto_crystal) {
                setup_data["crystal"] = auto_crystal_and_pet["crystal"];
            };
            if (auto_afkpet) {
                setup_data["afkpet"] = auto_crystal_and_pet["afkpet"];
                setup_data["afkpet_lvl"] = auto_crystal_and_pet["afkpet_lvl"];
            };
            outputs = await this.calc.calculate(false, setup_data, true);
            if (outputs["setupcost"] < cost_filter) {
                calculated_setup_profits[loop_minion] = outputs["total_profit"];
                calculated_setup_costs[loop_minion] = outputs["setupcost"];
            };
        };
        if (this.calc.gui.get_length(calculated_setup_profits) === 0) {
            this.calc.collect_add_on_output("Basic Minion Loop", "No setups pass the cost filter");
            return;
        };
        Object.assign(setup_data, this.calc.decode_id(outputs["calculated_ID"]));
        Object.assign(setup_data, outputs);
        setup_data["bazaar_update_txt"] = this.calc.bazaar_update_txt.get();
        let text_output_order = {
            "amount": null,
            "Upgrades: ": { "": new Set(["fuel", "hopper", "upgrade1", "upgrade2", "chest", "beacon", "crystal", "postcard", "infusion", "free_will"]) },
            "Beacon Info": { "\n> ": ["scorched", "B_constant", "B_acquired"] },
            "Inferno Info": { "\n> ": ["inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override"] },
            "afk": {
                "%\n> ": [["afkpet_rarity", "afkpet"]],
                " lvl ": new Set(["afkpet_lvl"]),
                "\n> ": ["enchanted_clock", "special_layout", "potato_accessory"]
            },
            "player_harvests": { "\n> ": ["player_looting"] },
            "Wisdoms": { "\n> ": ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"] },
            "mayor": null,
            "Leveling pet: ": {
                "%": [["levelingpet_rarity", "levelingpet"]],
                "\n> ": ["taming", "falcon_attribute", "pet_exp_boost", "beastmaster", "toucan_attribute", "expshareitem"],
                "%\n> Exp Share Pets: ": [["expsharepet_rarity", "expsharepet"], ["expsharepetslot2_rarity", "expsharepetslot2"], ["expsharepetslot3_rarity", "expsharepetslot3"]]
            },
            "used_pet_prices": null,
            "": { "": ["sell_loc", "bazaar_update_txt", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper", "sell_form"] },
        };
        if (auto_crystal) {
            text_output_order["Upgrades: "][""].delete("crystal");
        };
        if (auto_afkpet) {
            text_output_order["afk"]["%\n> "][0].splice(1, 1);
        };
        let output_str = this.calc.text_output(setup_data, {}, text_output_order, markdown_output, false);
        if (markdown_output) {
            if (auto_crystal) {
                output_str += "\nAutomatic Crystal: `True`";
            };
            if (auto_afkpet) {
                output_str += "\nAutomatic AFK Pet: `True`";
            };
            output_str += "\n```";
        } else {
            if (auto_crystal) {
                output_str += "\nAutomatic Crystal: True";
            };
            if (auto_afkpet) {
                output_str += "\nAutomatic AFK Pet: True";
            };
            output_str += "\n";
        };
        output_str += `\nMinion: profit, setup cost (limit: ${this.calc.gui.reduced_number(cost_filter)})`;
        for (let i = 1; i <= 10; i++) {
            if (this.calc.gui.get_length(calculated_setup_profits) === 0) {
                break;
            };
            let top_minion = Object.keys(calculated_setup_profits).reduce((a, b) => calculated_setup_profits[a] > calculated_setup_profits[b] ? a : b);
            output_str += "\n" + this.calc.md.calculator_data[top_minion]["display"] + ": " + this.calc.gui.reduced_number(calculated_setup_profits[top_minion]) + ", " + this.calc.gui.reduced_number(calculated_setup_costs[top_minion]);
            delete calculated_setup_profits[top_minion];
        };
        if (markdown_output) {
            output_str += "\n```";
        };
        output_str += "\n";
        if (this.calc.output_to_clipboard.get()) {
            try {
                navigator.clipboard.writeText(output_str);
            } catch (error) {
                if (error.name === "NotAllowedError") {
                    console.log("Not allowed to write to clipboard.");
                } else {
                    console.log("Unknown Error", error);
                };
            };
        };
        console.log(output_str);
        this.calc.collect_add_on_output("Basic Minion Loop", "See console (F12)");
        return;
    };

    bad_luck_inferno(setup_data=null, outputs=null, return_value=false) {
        // Outputs the profit of the common Hypergolic drops and the price per Inferno Vertex
        if (setup_data === null) {
            setup_data = this.calc.gui.get_from_GUI(["fuel", "inferno_grade", "bazaar_buy_type", "bazaar_sell_type", "bazaar_taxes", "bazaar_flipper", "mayor"]);
            outputs = this.calc.gui.get_from_GUI(["total_profit", "itemtype_profit", "harvests"]);
        };
        if (setup_data["fuel"] != "INFERNO_FUEL") {
            this.calc.collect_add_on_output("Bad Luck Inferno", "No Inferno Minion Fuel Found");
            return;
        };
        let total_profit = outputs["total_profit"];
        if (setup_data["inferno_grade"] != "HYPERGOLIC_GABAGOOL") {
            if (return_value) {
                return total_profit;
            };
            this.calc.collect_add_on_output("Bad Luck Inferno", "No Hypergolic Items Found");
            return;
        };
        let item_type_profit = outputs["itemtype_profit"];
        let no_rng_profit_average = total_profit - item_type_profit["INFERNO_APEX"] - item_type_profit["REAPER_PEPPER"] - item_type_profit["GABAGOOL_THE_FISH"];
        if (return_value) {
            return no_rng_profit_average;
        };
        const prediction_interval_size = 1.96;  // for 95% of cases within the interval, https://en.wikipedia.org/wiki/Prediction_interval#Known_mean,_known_variance
        let interval_radius_vertex_amount = prediction_interval_size * Math.sqrt(outputs["harvests"] * this.calc.md.inferno_fuel_data["drops"]["INFERNO_VERTEX"] * (1 - this.calc.md.inferno_fuel_data["drops"]["INFERNO_VERTEX"]));
        let per_vertex = this.calc.get_price("INFERNO_VERTEX", setup_data, "sell", "bazaar");
        let interval_min = no_rng_profit_average - per_vertex * interval_radius_vertex_amount
        let interval_max = no_rng_profit_average + per_vertex * interval_radius_vertex_amount
        this.calc.collect_add_on_output("Bad Luck Inferno Profit", `average: ${this.calc.gui.reduced_number(no_rng_profit_average, 2)}, 95% of cases: ${this.calc.gui.reduced_number(interval_min, 2)} -- ${this.calc.gui.reduced_number(interval_max, 2)}, average (no Vertexes): ${this.calc.gui.reduced_number(no_rng_profit_average - item_type_profit["INFERNO_VERTEX"], 2)}`);
        return;
    };

    async inferno_minion_loop(results) {
        let setup_data = this.calc.gui.get_from_GUI(this.calc.ID_order);
        let calculated_setup_profits = {};
        let calculated_setup_bad_luck_profits = {};
        let calculated_setup_costs = {};
    
        let cost_filter = results["setup_cost_limit"];
        if (cost_filter === 0) {
            cost_filter = Infinity;
        };
        let minion_amount_limit = results["amount_limit"];
        if (minion_amount_limit < 1) {
            this.calc.collect_add_on_output("Inferno Minion Loop", "Positive minion amount limit is required");
            return;
        };
        let markdown_output = results["markdown_output"];
        setup_data["minion"] = "INFERNO_MINION";
        setup_data["fuel"] = "INFERNO_FUEL";
        if (setup_data["inferno_grade"] === "HYPERGOLIC_GABAGOOL") {
            setup_data["chest"] = "XXLARGE_ENCHANTED_CHEST";
        };
        setup_data["rising_celsius_override"] = true;
    
        const loop_tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const loop_amounts = [...Array(minion_amount_limit + 1).keys()].splice(1);
        let outputs;
        for (const loop_tier of loop_tiers) {
            setup_data["miniontier"] = loop_tier;
            for (const loop_amount of loop_amounts) {
                setup_data["amount"] = loop_amount;
                outputs = await this.calc.calculate(false, setup_data, true);
                let bad_luck_profit = this.bad_luck_inferno(setup_data, outputs, true);
                let cost = outputs["setupcost"];
                if (cost < cost_filter) {
                    calculated_setup_costs[`${loop_tier}, ${loop_amount}`] = cost;
                    calculated_setup_profits[`${loop_tier}, ${loop_amount}`] = outputs["total_profit"];
                    calculated_setup_bad_luck_profits[`${loop_tier}, ${loop_amount}`] = bad_luck_profit;
                };
            };
        };
        if (this.calc.gui.get_length(calculated_setup_bad_luck_profits) === 0) {
            this.calc.collect_add_on_output("Inferno Minion Loop", "No setups pass the cost filter");
            return;
        };
        Object.assign(setup_data, this.calc.decode_id(outputs["calculated_ID"]));
        Object.assign(setup_data, outputs);
        setup_data["bazaar_update_txt"] = this.calc.bazaar_update_txt.get();
        let output_str = this.calc.text_output(setup_data, {}, {
            "Upgrades: ": { "": new Set(["fuel", "hopper", "upgrade1", "upgrade2", "chest", "beacon", "crystal", "postcard", "infusion", "free_will"]) },
            "Beacon Info": { "\n> ": ["scorched", "B_constant", "B_acquired"] },
            "Inferno Info": { "\n> ": ["inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override"] },
            "afk": {
                "%\n> ": [["afkpet_rarity", "afkpet"]],
                " lvl ": new Set(["afkpet_lvl"]),
                "\n> ": ["enchanted_clock", "special_layout", "potato_accessory"]
            },
            "player_harvests": { "\n> ": ["player_looting"] },
            "Wisdoms": { "\n> ": ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"] },
            "mayor": null,
            "Leveling pet: ": {
                "%": [["levelingpet_rarity", "levelingpet"]],
                "\n> ": ["taming", "falcon_attribute", "pet_exp_boost", "beastmaster", "toucan_attribute", "expshareitem"],
                "%\n> Exp Share Pets: ": [["expsharepet_rarity", "expsharepet"], ["expsharepetslot2_rarity", "expsharepetslot2"], ["expsharepetslot3_rarity", "expsharepetslot3"]]
            },
            "used_pet_prices": null,
            "": { "": ["sell_loc", "bazaar_update_txt", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper", "sell_form"] },
        }, markdown_output, false);
        if (markdown_output) {
            output_str += "\n```";
        } else {
            output_str += "\n";
        };
        output_str += `\nTier, Amount (limit: ${this.calc.gui.reduced_number(minion_amount_limit)}): bad luck profit, setup cost (limit: ${this.calc.gui.reduced_number(cost_filter)}), true average profit`;
        for (let i = 1; i <= 10; i++) {
            if (this.calc.gui.get_length(calculated_setup_bad_luck_profits) === 0) {
                break;
            };
            let top_minion = Object.keys(calculated_setup_bad_luck_profits).reduce((a, b) => calculated_setup_bad_luck_profits[a] > calculated_setup_bad_luck_profits[b] ? a : b);
            output_str += "\n" + top_minion + ": " + this.calc.gui.reduced_number(calculated_setup_bad_luck_profits[top_minion]) + ", " + this.calc.gui.reduced_number(calculated_setup_costs[top_minion]) + ", " + this.calc.gui.reduced_number(calculated_setup_profits[top_minion]);
            delete calculated_setup_bad_luck_profits[top_minion];
        };
        if (markdown_output) {
            output_str += "\n```";
        };
        output_str += "\n";
        if (this.calc.output_to_clipboard.get()) {
            try {
                navigator.clipboard.writeText(output_str);
            } catch(error) {
                if (error.name === "NotAllowedError") {
                    console.log("Not allowed to write to clipboard, outputting output here instead:");
                } else {
                    console.log("Unknown Error", error);
                };
                console.log(output_str);
            };
        };
        console.log(output_str);
        this.calc.collect_add_on_output("Inferno Minion Loop", "See console (F12)");
    };

    basic_minion_loop_inputs() {
        this.calc.gui.edit_vars("basic_minion_loop");
        return;
    };

    inferno_minion_loop_inputs() {
        this.calc.gui.edit_vars("inferno_minion_loop");
        return;
    };

    dragon_xp(gained_xp, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item) {
        const drag_lvl_100 = this.calc.md.calculator_data["LEGENDARY"]["max_lvl_pet_xp_amount"];
        const drag_lvl_200 = this.calc.md.calculator_data["DRAGON"]["max_lvl_pet_xp_amount"];
        let gained_pet_xp = 0.0;
        let skill_xp_per_pet = (drag_lvl_200 + drag_lvl_100 * (xp_boost_pet_item - 1)) / (xp_boost_pet_item * pet_xp_boost);
        gained_pet_xp = - left_over_pet_xp
        if (left_over_pet_xp <= drag_lvl_100) {
            gained_xp += left_over_pet_xp / pet_xp_boost;
        } else {
            gained_xp += (left_over_pet_xp + drag_lvl_100 * (xp_boost_pet_item - 1)) / (pet_xp_boost * xp_boost_pet_item);
        };
        gained_pet_xp += Math.floor(gained_xp / skill_xp_per_pet) * drag_lvl_200;
        let left_over_xp = gained_xp % skill_xp_per_pet;
        if (left_over_xp <= drag_lvl_100 / pet_xp_boost) {
            left_over_pet_xp = left_over_xp * pet_xp_boost;
        } else {
            left_over_pet_xp = left_over_xp * pet_xp_boost * xp_boost_pet_item + drag_lvl_100 * (1 - xp_boost_pet_item);
        };
        gained_pet_xp += left_over_pet_xp;
        return [gained_pet_xp, left_over_pet_xp];
    };

    exact_pet_levelling_inputs() {
        let setup_data = this.calc.gui.get_from_GUI(["mayor", "levelingpet", "levelingpet_rarity", "expsharepet", "expsharepetslot2", "expsharepetslot3", "expsharepet_rarity", "expsharepetslot2_rarity", "expsharepetslot3_rarity"])
        if (setup_data["levelingpet"] === "NONE") {
            this.calc.collect_add_on_output("Exact Pet Levelling", "No pet levelling active");
            return;
        };
        let setup_pets = { "levelingpet": { "pet": setup_data["levelingpet"], "rarity": setup_data["levelingpet_rarity"], "pet_xp": {}, "levelled_pets": 0.0 } }
        for (const var_key of ["expsharepet", "expsharepetslot2", "expsharepetslot3"]) {
            if (setup_data[var_key] === "NONE" || (setup_data["mayor"] !== "MAYOR_DIANA" && ["expsharepetslot2", "expsharepetslot3"].includes(var_key))) {
                continue;
            };
            setup_pets[var_key] = { "pet": setup_data[var_key], "rarity": setup_data[var_key + "_rarity"], "pet_xp": { "exp_share": 0.0 }, "levelled_pets": 0.0 };
        };
        let input_variables = {};
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            input_variables[pet_slot + "_starting_pet_xp"] = {"dtype": "number", "display": this.calc.md.calculator_data[pet_info["rarity"]]["display"] + " " + this.calc.md.calculator_data[pet_info["pet"]]["display"] + " starting pet xp", "initial": 0, "options": null};
        };
        if ("exact_pet_levelling" in this.calc.gui.edit_vars_requests) {
            this.calc.gui.edit_vars_requests["exact_pet_levelling"]["frame"].remove();
        };
        this.calc.gui.new_edit_vars("exact_pet_levelling", input_variables, (results, pet_data=setup_pets) => this.exact_pet_levelling.bind(this)(results, pet_data))
        this.calc.gui.edit_vars("exact_pet_levelling");
        return;
    };

    exact_pet_levelling(results, setup_pets) {
        let setup_data = this.calc.gui.get_from_GUI(["mayor", "xp", "taming", "toucan_attribute", "expshareitem", "pet_exp_boost", "beastmaster", "falcon_attribute", "bazaar_buy_type", "bazaar_sell_type", "bazaar_taxes", "bazaar_flipper"])
        let skill_xp = setup_data["xp"]
        let main_pet = setup_pets["levelingpet"]["pet"];
        let main_pet_xp = setup_pets["levelingpet"]["pet_xp"];
        let pet_xp_boost, xp_boost_pet_item, left_over_pet_xp, exp_share_pet, equiv_pet_xp_boost, equiv_xp_boost_pet_item, non_matching, dragon_xp_outputs;
        if (this.calc.md.has_data_tag(main_pet, "dragon_pet")) {
            left_over_pet_xp = results["levelingpet_starting_pet_xp"];
            for (let [skill, amount] of Object.entries(skill_xp)) {
                [pet_xp_boost, xp_boost_pet_item] = this.calc.get_pet_xp_boosts(main_pet, skill, setup_data);
                dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item);
                main_pet_xp[skill] = dragon_xp_outputs[0];
                left_over_pet_xp = dragon_xp_outputs[1];
            };
        } else {
            for (let [skill, amount] of Object.entries(skill_xp)) {
                [pet_xp_boost, xp_boost_pet_item] = this.calc.get_pet_xp_boosts(main_pet, skill, setup_data);
                main_pet_xp[skill] = amount * pet_xp_boost * xp_boost_pet_item;
            };
        };
        let exp_share_boost = 0.2 * setup_data["taming"] + 10 * (mayor == "MAYOR_DIANA") + setup_data["toucan_attribute"];
        let exp_share_item = 15 * setup_data["expshareitem"];
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            if (pet_slot === "levelingpet") {
                continue;
            };
            exp_share_pet = pet_info["pet"];
            if (this.calc.md.has_data_tag(exp_share_pet, "dragon_pet")) {
                if (exp_share_boost === 0) {
                    continue;
                };
                left_over_pet_xp = results[pet_slot + "_starting_pet_xp"];
                for (let [skill, amount] of Object.entries(main_pet_xp)) {
                    non_matching = this.calc.get_pet_xp_boosts(exp_share_pet, skill, setup_data, true);
                    equiv_pet_xp_boost = non_matching * (exp_share_boost / 100);
                    equiv_xp_boost_pet_item = 1 + exp_share_item / exp_share_boost;
                    dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, equiv_pet_xp_boost, equiv_xp_boost_pet_item);
                    pet_info["pet_xp"]["exp_share"] += dragon_xp_outputs[0];
                    left_over_pet_xp = dragon_xp_outputs[1];
                };
            } else {
                for (let [skill, amount] of Object.entries(main_pet_xp)) {
                    non_matching = this.calc.get_pet_xp_boosts(exp_share_pet, skill, setup_data, true);
                    pet_info["pet_xp"]["exp_share"] += amount * ((exp_share_boost + exp_share_item * (!(this.calc.md.has_data_tag(exp_share_pet, "dragon_egg_pet")))) / 100) * non_matching;
                };
            };
        };
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            let pets_levelled, max_lvl_pet_xp;
            if (this.calc.md.has_data_tag(pet_info["pet"], "dragon_pet")) {
                max_lvl_pet_xp = this.calc.md.calculator_data["DRAGON"]["max_lvl_pet_xp_amount"];
            } else if (this.calc.md.has_data_tag(pet_info["pet"], "hatched_dragon_pet")) {
                max_lvl_pet_xp = this.calc.md.calculator_data["DRAGON"]["max_lvl_pet_xp_amount"] - this.calc.md.calculator_data["LEGENDARY"]["max_lvl_pet_xp_amount"];
            } else {
                max_lvl_pet_xp = this.calc.md.calculator_data[pet_info["rarity"]]["max_lvl_pet_xp_amount"];
            };
            pets_levelled = (results[pet_slot + "_starting_pet_xp"] + Object.values(pet_info["pet_xp"]).reduce((partialSum, a) => partialSum + a, 0)) / max_lvl_pet_xp;
            pet_info["levelled_pets"] = pets_levelled;
        };
        let output_string = Array.from(Object.values(setup_pets), pet_info => `${this.calc.gui.reduced_number(pet_info['levelled_pets'], 4)} ${this.calc.md.calculator_data[pet_info["rarity"]]["display"]} ${this.calc.md.calculator_data[pet_info["pet"]]["display"]}`).join(", ")
        this.calc.collect_add_on_output("Exact Pet Levelling", output_string);
    };

    collection_maxing_inputs() {
        this.calc.gui.edit_vars("collection_maxing");
        return;
    };

    async collection_maxing(results) {
        let display_name = "Chili Pepper Collection";
        let setup_data = this.calc.gui.get_from_GUI(this.calc.ID_order);
        let calculated_setup_profits = {};
        let calculated_setup_costs = {};
        let calculated_collection_max_cost = {};
        let calculated_needed_time = {};
    
        let ordering = results["sort_by"];
        let ordering_data = {"Fastest Time": calculated_needed_time, "Lowest Setup Cost": calculated_setup_costs, "Lowest Total Cost": calculated_collection_max_cost}[ordering];
        
        let cost_filter = results["setup_cost_limit"];
        let time_filter = results["time_limit"];
        if (cost_filter === 0) {
            cost_filter = Infinity;
        };
        if (time_filter === 0) {
            time_filter = Infinity;
        };
        let minion_amount_limit = results["amount_limit"];
        if (minion_amount_limit < 1) {
            this.calc.collect_add_on_output(display_name, "Positive minion amount limit is required");
            return;
        };
        let markdown_output = results["markdown_output"];
        setup_data["minion"] = "INFERNO_MINION";
        setup_data["fuel"] = "INFERNO_FUEL";
        setup_data["inferno_grade"] = "HYPERGOLIC_GABAGOOL";
        setup_data["chest"] = "XXLARGE_ENCHANTED_CHEST";
        setup_data["rising_celsius_override"] = true;
        setup_data["sell_form"] = 1;
        setup_data["scale_time"] = false;
        
        const loop_tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const loop_amounts = [...Array(minion_amount_limit + 1).keys()].splice(1);
        let outputs;
        for (const loop_tier of loop_tiers) {
            setup_data["miniontier"] = loop_tier;
            for (const loop_amount of loop_amounts) {
                setup_data["amount"] = loop_amount;
                outputs = await this.calc.calculate(false, setup_data, true);
                let cost = outputs["setupcost"];
                let needed_time_scaling = 10000 / outputs["items"]["CHILI_PEPPER"];
                let needed_time = setup_data["empty_time_amount"] * needed_time_scaling;
                if (cost < cost_filter && needed_time < time_filter) {
                    calculated_setup_costs[`${loop_tier}, ${loop_amount}`] = cost;
                    calculated_setup_profits[`${loop_tier}, ${loop_amount}`] = needed_time_scaling * outputs["total_profit"];
                    calculated_collection_max_cost[`${loop_tier}, ${loop_amount}`] = cost - needed_time_scaling * outputs["total_profit"]
                    calculated_needed_time[`${loop_tier}, ${loop_amount}`] = needed_time
                };
            };
        };
        if (this.calc.gui.get_length(calculated_collection_max_cost) === 0) {
            this.calc.collect_add_on_output(display_name, "No setups pass the filters");
            return;
        };
        Object.assign(setup_data, this.calc.decode_id(outputs["calculated_ID"]));
        Object.assign(setup_data, outputs);
        setup_data["bazaar_update_txt"] = this.calc.bazaar_update_txt.get();
        let output_str = this.calc.text_output(setup_data, {}, {
            "Upgrades: ": { "": new Set(["fuel", "hopper", "upgrade1", "upgrade2", "chest", "beacon", "crystal", "postcard", "infusion", "free_will"]) },
            "Beacon Info": { "\n> ": ["scorched", "B_constant", "B_acquired"] },
            "Inferno Info": { "\n> ": ["inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override"] },
            "afk": {
                "%\n> ": [["afkpet_rarity", "afkpet"]],
                " lvl ": new Set(["afkpet_lvl"]),
                "\n> ": ["enchanted_clock", "special_layout", "potato_accessory"]
            },
            "player_harvests": { "\n> ": ["player_looting"] },
            "Wisdoms": { "\n> ": ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"] },
            "mayor": null,
            "Leveling pet: ": {
                "%": [["levelingpet_rarity", "levelingpet"]],
                "\n> ": ["taming", "falcon_attribute", "pet_exp_boost", "beastmaster", "toucan_attribute", "expshareitem"],
                "%\n> Exp Share Pets: ": [["expsharepet_rarity", "expsharepet"], ["expsharepetslot2_rarity", "expsharepetslot2"], ["expsharepetslot3_rarity", "expsharepetslot3"]]
            },
            "used_pet_prices": null,
            "": { "": ["sell_loc", "bazaar_update_txt", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper", "sell_form"] },
        }, markdown_output, false);
        if (markdown_output) {
            output_str += "\n```";
        } else {
            output_str += "\n";
        };
        output_str += `\nTier, Amount (limit: ${this.calc.gui.reduced_number(minion_amount_limit)}): max collection cost, time (limit: ${this.calc.gui.reduced_number(time_filter)} ${setup_data["empty_time_unit"]}), setup cost (limit: ${this.calc.gui.reduced_number(cost_filter)}), profit`;

        for (let i = 1; i <= 10; i++) {
            if (this.calc.gui.get_length(ordering_data) === 0) {
                break;
            };
            let top_minion = Object.keys(ordering_data).reduce((a, b) => ordering_data[a] < ordering_data[b] ? a : b);
            output_str += "\n" + top_minion + ": " + this.calc.gui.reduced_number(calculated_collection_max_cost[top_minion]) + ", " + `${this.calc.gui.reduced_number(calculated_needed_time[top_minion])} ${setup_data["empty_time_unit"]}` + ", " + this.calc.gui.reduced_number(calculated_setup_costs[top_minion]) + ", " + this.calc.gui.reduced_number(calculated_setup_profits[top_minion]);
            delete ordering_data[top_minion];
        };
        if (markdown_output) {
            output_str += "\n```";
        };
        output_str += `\nOrdered by: ${ordering}`;
        if (this.calc.output_to_clipboard.get()) {
            try {
                navigator.clipboard.writeText(output_str);
            } catch(error) {
                if (error.name === "NotAllowedError") {
                    console.log("Not allowed to write to clipboard, outputting output here instead:");
                } else {
                    console.log("Unknown Error", error);
                };
                console.log(output_str);
            };
        };
        console.log(output_str);
        this.calc.collect_add_on_output(display_name, "See console (F12)");
        return;
    };

    partial_setup_cost_inputs() {
        this.calc.gui.edit_vars("partial_setup_cost");
        return;
    };

    partial_setup_cost(results) {
        let outputs = this.calc.gui.get_from_GUI(["setupcost_breakdown"]);
        let partial_cost = 0;
        let used_parts = [];
        for (let [setup_part, state] of Object.entries(results)) {
            if (state && setup_part in outputs["setupcost_breakdown"]) {
                partial_cost += outputs["setupcost_breakdown"][setup_part];
                used_parts.push(this.calc.var_dict[setup_part].get_display());
            };
        };
        if (used_parts.length === 0) {
            this.calc.collect_add_on_output("Partial Setup Cost", "No setup parts pass the filter");
            return;
        };
        this.calc.collect_add_on_output("Partial Setup Cost", this.calc.gui.reduced_number(partial_cost) + " for " + used_parts.join(", "));
        return;
    };
};