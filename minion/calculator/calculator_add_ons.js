
class Calc_add_ons {
    constructor() {
        this.add_ons_package = {"Minion Crafting": this.craft_material_amount, "Days to Repay Setup": this.setup_repay_time, "Basic Minion Loop": this.basic_minion_loop_inputs, "Bad Luck Inferno": this.bad_luck_inferno, "Inferno Minion Loop": this.inferno_minion_loop_inputs, "Exact Pet Levelling": this.exact_pet_levelling_inputs};
    };

    craft_material_amount(calculator) {
        let setup_data = calculator.gui.get_from_GUI(["minion", "miniontier", "amount", "extracost"]);
        const materials = md.minionCostSum(setup_data["minion"], setup_data["miniontier"]);
        const extra_costs_string = setup_data["extracost"]
        let materials_string = Object.keys(materials).map(material => `${materials[material] * setup_data["amount"]} ${md.calculator_data[material]["display"]}`).join(", ");
        if (calculator.gui.get_length(extra_costs_string) !== 0) {
            materials_string += ", " + extra_costs_string;
        };
        calculator.collect_addon_output("Minion Crafting Materials", materials_string);
        return;
    };

    setup_repay_time(calculator) {
        // Outputs the time (in days) it take for a setup to repay itself
        let setup_data = calculator.gui.get_from_GUI(["time_seconds", "setupcost", "free_will", "total_profit"]);
        let setupcost = setup_data["setupcost"];
        let profit = setup_data["total_profit"];
        if (profit < 0) {
            calculator.collect_addon_output("Setup Repay Time", "Negative profit, cannot repay");
            return;
        };
        let profitpersecond = profit / setup_data["time_seconds"];
        let repay_time_s = setupcost / profitpersecond;
        if (profitpersecond === Infinity || repay_time_s === Infinity) {
            calculator.collect_addon_output("Setup Repay Time", "Division by zero");
            return;
        };
        let repay_time = GUI.round_number(repay_time_s / 86400);
        calculator.collect_addon_output("Setup Repay Time", `${repay_time} Days`);
        return;
    };

    async basic_minion_loop(calculator) {
        let setup_data = calculator.gui.get_from_GUI(calculator.ID_order);
        let cost_filter = calculator.gui.edit_vars_output["setup_cost_limit"];
        if (cost_filter === 0) {
            cost_filter = Infinity;
        };
        let markdown_output = calculator.gui.edit_vars_output["markdown_output"];
        let calculated_setup_profits = {};
        let calculated_setup_costs = {};
        const loop_minion_options = Object.values(md.minion_options);
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
            if (upgrades.includes("CORRUPT_SOIL") && !(md.has_data_tag(loop_minion, "mob_minion"))) {
                continue;
            };
            setup_data["minion"] = loop_minion;
            setup_data["miniontier"] = Number(Object.keys(md.calculator_data[loop_minion]["speed"]).slice(-1));
            if (super_compactor) {
                if (loop_minion_smelting.includes(loop_minion)) {
                    setup_data["upgrade1"] = "DWARVEN_COMPACTOR";
                } else {
                    setup_data["upgrade1"] = "SUPER_COMPACTOR_3000";
                };
            };
            outputs = await calculator.calculate(false, setup_data, true);
            if (outputs["setupcost"] < cost_filter) {
                calculated_setup_profits[loop_minion] = outputs["total_profit"];
                calculated_setup_costs[loop_minion] = outputs["setupcost"];
            };
        };
        if (calculator.gui.get_length(calculated_setup_profits) === 0) {
            calculator.collect_addon_output("Basic Minion Loop", "No setups pass the cost filter");
            return;
        };
        Object.assign(setup_data, calculator.decode_id(outputs["calculated_ID"]));
        setup_data["used_pet_prices"] = outputs["used_pet_prices"];
        setup_data["bazaar_update_txt"] = calculator.bazaar_update_txt.get();
        let output_str = calculator.text_output(setup_data, {}, {
            "amount": null,
            "Upgrades: ": { "": new Set(["fuel", "hopper", "upgrade1", "upgrade2", "chest", "beacon", "crystal", "postcard", "infusion", "free_will"]) },
            "Beacon Info": { "\n> ": ["scorched", "B_constant", "B_acquired"] },
            "Inferno Info": { "\n> ": ["inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override"] },
            "afk": { "\n> ": ["afkpet", "afkpet_rarity", "afkpet_lvl", "enchanted_clock", "special_layout", "potato_accessory"] },
            "player_harvests": { "\n> ": ["player_looting"] },
            "Wisdoms": { "\n> ": ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"] },
            "mayor": null,
            "levelingpet": {
                "\n> ": ["taming", "falcon_attribute", "petxpboost", "beastmaster", "toucan_attribute", "expshareitem"],
                "\n> Exp Share Pets: ": new Set(["expsharepet", "expsharepetslot2", "expsharepetslot3"])
            },
            "used_pet_prices": null,
            "": { "": ["sell_loc", "bazaar_update_txt", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper"] },
        }, markdown_output, false);
        if (markdown_output) {
            output_str += "\n```";
        } else {
            output_str += "\n";
        };
        output_str += `\nMinion: profit, setup cost (limit: ${calculator.gui.reduced_number(cost_filter)})`;
        for (let i = 1; i <= 10; i++) {
            if (calculator.gui.get_length(calculated_setup_profits) === 0) {
                break;
            };
            let top_minion = Object.keys(calculated_setup_profits).reduce((a, b) => calculated_setup_profits[a] > calculated_setup_profits[b] ? a : b);
            output_str += "\n" + md.calculator_data[top_minion]["display"] + ": " + calculator.gui.reduced_number(calculated_setup_profits[top_minion]) + ", " + calculator.gui.reduced_number(calculated_setup_costs[top_minion]);
            delete calculated_setup_profits[top_minion];
        };
        if (markdown_output) {
            output_str += "\n```";
        };
        output_str += "\n";
        if (calculator.output_to_clipboard.get()) {
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
        calculator.collect_addon_output("Basic Minion Loop", "See console (F12)");
        return;
    };

    bad_luck_inferno(calculator, setup_data=null, outputs=null, return_value=false) {
        // Outputs the profit of the common Hypergolic drops and the price per Inferno Vertex
        if (setup_data === null) {
            setup_data = calculator.gui.get_from_GUI(["fuel", "inferno_grade", "bazaar_buy_type", "bazaar_sell_type", "bazaar_taxes", "bazaar_flipper", "mayor"]);
            outputs = calculator.gui.get_from_GUI(["total_profit", "itemtype_profit", "harvests"]);
        };
        if (setup_data["fuel"] != "INFERNO_FUEL") {
            calculator.collect_addon_output("Bad Luck Inferno", "No Inferno Minion Fuel Found");
            return;
        };
        let total_profit = outputs["total_profit"];
        if (setup_data["inferno_grade"] != "HYPERGOLIC_GABAGOOL") {
            if (return_value) {
                return total_profit;
            };
            calculator.collect_addon_output("Bad Luck Inferno", "No Hypergolic Items Found");
            return;
        };
        let item_type_profit = outputs["itemtype_profit"];
        let no_rng_profit_average = total_profit - item_type_profit["INFERNO_APEX"] - item_type_profit["REAPER_PEPPER"] - item_type_profit["GABAGOOL_THE_FISH"];
        if (return_value) {
            return no_rng_profit_average;
        };
        const prediction_interval_size = 1.96;  // for 95% of cases within the interval, https://en.wikipedia.org/wiki/Prediction_interval#Known_mean,_known_variance
        let interval_radius_vertex_amount = prediction_interval_size * Math.sqrt(outputs["harvests"] * md.inferno_fuel_data["drops"]["INFERNO_VERTEX"] * (1 - md.inferno_fuel_data["drops"]["INFERNO_VERTEX"]));
        let per_vertex = calculator.get_price("INFERNO_VERTEX", setup_data, "sell", "bazaar");
        let interval_min = no_rng_profit_average - per_vertex * interval_radius_vertex_amount
        let interval_max = no_rng_profit_average + per_vertex * interval_radius_vertex_amount
        calculator.collect_addon_output("Bad Luck Inferno Profit", `average: ${calculator.gui.reduced_number(no_rng_profit_average, 2)}, 95% of cases: ${calculator.gui.reduced_number(interval_min, 2)} -- ${calculator.gui.reduced_number(interval_max, 2)}, average (no Vertexes): ${calculator.gui.reduced_number(no_rng_profit_average - item_type_profit["INFERNO_VERTEX"], 2)}`);
        return;
    };

    async inferno_minion_loop(calculator) {
        let setup_data = calculator.gui.get_from_GUI(calculator.ID_order);
        let calculated_setup_profits = {};
        let calculated_setup_bad_luck_profits = {};
        let calculated_setup_costs = {};
    
        let cost_filter = calculator.gui.edit_vars_output["setup_cost_limit"];
        if (cost_filter === 0) {
            cost_filter = Infinity;
        };
        let minion_amount_limit = calculator.gui.edit_vars_output["amount_limit"];
        if (minion_amount_limit < 1) {
            calculator.collect_addon_output("Inferno Minion Loop", "Positive minion amount limit is required");
            return;
        };
        let markdown_output = calculator.gui.edit_vars_output["markdown_output"];
        setup_data["minion"] = "INFERNO_MINION"
        setup_data["fuel"] = "INFERNO_FUEL"
        setup_data["chest"] = "XXLARGE_ENCHANTED_CHEST"
        setup_data["rising_celsius_override"] = true
    
        const loop_tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const loop_amounts = [...Array(minion_amount_limit + 1).keys()].splice(1);
        let outputs;
        for (const loop_tier of loop_tiers) {
            setup_data["miniontier"] = loop_tier;
            for (const loop_amount of loop_amounts) {
                setup_data["amount"] = loop_amount;
                outputs = await calculator.calculate(false, setup_data, true);
                let bad_luck_profit = this.bad_luck_inferno(calculator, setup_data, outputs, true);
                let cost = outputs["setupcost"];
                if (cost < cost_filter) {
                    calculated_setup_costs[`${loop_tier}, ${loop_amount}`] = cost;
                    calculated_setup_profits[`${loop_tier}, ${loop_amount}`] = outputs["total_profit"];
                    calculated_setup_bad_luck_profits[`${loop_tier}, ${loop_amount}`] = bad_luck_profit;
                };
            };
        };
        if (calculator.gui.get_length(calculated_setup_bad_luck_profits) === 0) {
            calculator.collect_addon_output("Inferno Minion Loop", "No setups pass the cost filter");
            return;
        };
        Object.assign(setup_data, calculator.decode_id(outputs["calculated_ID"]));
        setup_data["used_pet_prices"] = outputs["used_pet_prices"];
        setup_data["bazaar_update_txt"] = calculator.bazaar_update_txt.get();
        let output_str = calculator.text_output(setup_data, {}, {
            "Upgrades: ": { "": new Set(["fuel", "hopper", "upgrade1", "upgrade2", "chest", "beacon", "crystal", "postcard", "infusion", "free_will"]) },
            "Beacon Info": { "\n> ": ["scorched", "B_constant", "B_acquired"] },
            "Inferno Info": { "\n> ": ["inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override"] },
            "afk": { "\n> ": ["afkpet", "afkpet_rarity", "afkpet_lvl", "enchanted_clock", "special_layout", "potato_accessory"] },
            "player_harvests": { "\n> ": ["player_looting"] },
            "Wisdoms": { "\n> ": ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"] },
            "mayor": null,
            "levelingpet": {
                "\n> ": ["taming", "falcon_attribute", "petxpboost", "beastmaster", "toucan_attribute", "expshareitem"],
                "\n> Exp Share Pets: ": new Set(["expsharepet", "expsharepetslot2", "expsharepetslot3"])
            },
            "used_pet_prices": null,
            "": { "": ["sell_loc", "bazaar_update_txt", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper"] },
        }, markdown_output, false);
        if (markdown_output) {
            output_str += "\n```";
        } else {
            output_str += "\n";
        };
        output_str += `\nTier, Amount (limit: ${calculator.gui.reduced_number(minion_amount_limit)}): bad luck profit, setup cost (limit: ${calculator.gui.reduced_number(cost_filter)}), true average profit`;
        for (let i = 1; i <= 10; i++) {
            if (calculator.gui.get_length(calculated_setup_bad_luck_profits) === 0) {
                break;
            };
            let top_minion = Object.keys(calculated_setup_bad_luck_profits).reduce((a, b) => calculated_setup_bad_luck_profits[a] > calculated_setup_bad_luck_profits[b] ? a : b);
            output_str += "\n" + top_minion + ": " + calculator.gui.reduced_number(calculated_setup_bad_luck_profits[top_minion]) + ", " + calculator.gui.reduced_number(calculated_setup_costs[top_minion]) + ", " + calculator.gui.reduced_number(calculated_setup_profits[top_minion]);
            delete calculated_setup_bad_luck_profits[top_minion];
        };
        if (markdown_output) {
            output_str += "\n```";
        };
        output_str += "\n";
        if (calculator.output_to_clipboard.get()) {
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
        calculator.collect_addon_output("Inferno Minion Loop", "See console (F12)");
    };

    basic_minion_loop_inputs(calculator) {
        calculator.gui.edit_vars(() => this.basic_minion_loop.bind(this)(calculator), {"setup_cost_limit": {"dtype": "number", "display": "Setup Cost Limit", "initial": 0, "options": null}, "markdown_output": {"dtype": "boolean", "display": "Markdown Output", "initial": true, "options": null}}, false);
        return;
    };

    inferno_minion_loop_inputs(calculator) {
        calculator.gui.edit_vars(() => this.inferno_minion_loop.bind(this)(calculator), {"setup_cost_limit": {"dtype": "number", "display": "Setup Cost Limit", "initial": 0, "options": null}, "amount_limit": {"dtype": "number", "display": "Minion Amount Limit", "initial": 32, "options": null}, "markdown_output": {"dtype": "boolean", "display": "Markdown Output", "initial": true, "options": null}}, false);
        return;
    };

    dragon_xp(gained_xp, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item) {
        const drag_lvl_100 = md.max_lvl_pet_xp_amounts["Legendary"];
        const drag_lvl_200 = md.max_lvl_pet_xp_amounts["Dragon"];
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

    exact_pet_levelling_inputs(calculator) {
        let setup_data = calculator.gui.get_from_GUI(["mayor", "levelingpet", "expsharepet", "expsharepetslot2", "expsharepetslot3"])
        if (setup_data["levelingpet"] === "NONE") {
            calculator.collect_addon_output("Exact Pet Levelling", "No pet levelling active");
            return;
        };
        let setup_pets = { "levelingpet": { "pet": setup_data["levelingpet"], "pet_xp": {}, "levelled_pets": 0.0 } }
        for (const var_key of ["expsharepet", "expsharepetslot2", "expsharepetslot3"]) {
            if (setup_data[var_key] === "NONE" || (setup_data["mayor"] !== "MAYOR_DIANA" && ["expsharepetslot2", "expsharepetslot3"].includes(var_key))) {
                continue;
            };
            setup_pets[var_key] = { "pet": setup_data[var_key], "pet_xp": { "exp_share": 0.0 }, "levelled_pets": 0.0 };
        };
        let input_variables = {};
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            input_variables[pet_slot + "_starting_pet_xp"] = {"dtype": "number", "display": md.calculator_data[pet_info["pet"]]["display"] + " pet xp", "initial": 0, "options": null};
        };
        calculator.gui.edit_vars((pet_data=setup_pets) => this.exact_pet_levelling.bind(this)(calculator, pet_data), input_variables, false)
        return;
    };

    exact_pet_levelling(calculator, setup_pets) {
        let setup_data = calculator.gui.get_from_GUI(["mayor", "xp", "taming", "toucan_attribute", "expshareitem", "petxpboost", "beastmaster", "falcon_attribute", "bazaar_buy_type", "bazaar_sell_type", "bazaar_taxes", "bazaar_flipper"])
        let skill_xp = setup_data["xp"]
        let main_pet = setup_pets["levelingpet"]["pet"];
        let main_pet_xp = setup_pets["levelingpet"]["pet_xp"];
        let pet_xp_boost, xp_boost_pet_item, left_over_pet_xp, exp_share_pet, equiv_pet_xp_boost, equiv_xp_boost_pet_item, non_matching, dragon_xp_outputs;
        if (md.has_data_tag(main_pet, "dragon_pet")) {
            left_over_pet_xp = calculator.gui.edit_vars_output["levelingpet_starting_pet_xp"];
            for (let [skill, amount] of Object.entries(skill_xp)) {
                [pet_xp_boost, xp_boost_pet_item] = calculator.get_pet_xp_boosts(main_pet, skill, setup_data);
                dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item);
                main_pet_xp[skill] = dragon_xp_outputs[0];
                left_over_pet_xp = dragon_xp_outputs[1];
            };
        } else {
            for (let [skill, amount] of Object.entries(skill_xp)) {
                [pet_xp_boost, xp_boost_pet_item] = calculator.get_pet_xp_boosts(main_pet, skill, setup_data);
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
            if (md.has_data_tag(exp_share_pet, "dragon_pet")) {
                if (exp_share_boost === 0) {
                    continue;
                };
                left_over_pet_xp = calculator.gui.edit_vars_output[pet_slot + "_starting_pet_xp"];
                for (let [skill, amount] of Object.entries(main_pet_xp)) {
                    non_matching = this.get_pet_xp_boosts(exp_share_pet, skill, setup_data, true);
                    equiv_pet_xp_boost = non_matching * (exp_share_boost / 100);
                    equiv_xp_boost_pet_item = 1 + exp_share_item / exp_share_boost;
                    dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, equiv_pet_xp_boost, equiv_xp_boost_pet_item);
                    pet_info["pet_xp"]["exp_share"] += dragon_xp_outputs[0];
                    left_over_pet_xp = dragon_xp_outputs[1];
                };
            } else {
                for (let [skill, amount] of Object.entries(main_pet_xp)) {
                    non_matching = this.get_pet_xp_boosts(exp_share_pet, skill, setup_data, true);
                    pet_info["pet_xp"]["exp_share"] += amount * ((exp_share_boost + exp_share_item * (!(md.has_data_tag(exp_share_pet, "dragon_egg_pet")))) / 100) * non_matching;
                };
            };
        };
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            let pets_levelled, max_lvl_pet_xp;
            if (md.has_data_tag(pet_info["pet"], "dragon_pet")) {
                max_lvl_pet_xp = md.max_lvl_pet_xp_amounts["Dragon"];
            } else {
                max_lvl_pet_xp = md.max_lvl_pet_xp_amounts[md.calculator_data[pet_info["pet"]]["rarity"]];
            };
            pets_levelled = (calculator.gui.edit_vars_output[pet_slot + "_starting_pet_xp"] + Object.values(pet_info["pet_xp"]).reduce((partialSum, a) => partialSum + a, 0)) / max_lvl_pet_xp;
            pet_info["levelled_pets"] = pets_levelled;
        };
        let output_string = Array.from(Object.values(setup_pets), pet_info => `${calculator.gui.reduced_number(pet_info['levelled_pets'], 4)} ${md.calculator_data[pet_info["pet"]]["display"]}`).join(", ")
        calculator.collect_addon_output("Exact Pet Levelling", output_string);
    };
};