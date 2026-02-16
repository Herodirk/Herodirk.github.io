
class Calc_add_ons {
    constructor() {
        this.add_ons_package = {"Minion Crafting": this.craft_material_amount, "Days to Repay Setup": this.setup_repay_time, "Basic Minion Loop": this.basic_minion_loop, "Bad Luck Inferno": this.bad_luck_inferno, "Inferno Minion Loop": this.inferno_minion_loop};
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
        let setup_data = calculator.gui.get_from_GUI(["time_seconds", "setupcost", "free_will", "freewillcost", "total_profit"]);
        let setupcost = setup_data["setupcost"];
        // if (setup_data["free_will"]) {
        //     setupcost += setup_data["freewillcost"];
        // };
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
            let outputs = await calculator.calculate(false, setup_data, true);
            calculated_setup_profits[loop_minion] = outputs["total_profit"];
            calculated_setup_costs[loop_minion] = outputs["setupcost"];
            // if (calculator.variables["free_will"]["var"]) {
            //     calculated_setup_costs[loop_minion] += calculator.variables["freewillcost"]["var"];
            // };
        };
        let output_string = "Minion : profit , setup cost\n";
        for (let i = 1; i <= 10; i++) {
            let top_minion = Object.keys(calculated_setup_profits).reduce((a, b) => calculated_setup_profits[a] > calculated_setup_profits[b] ? a : b);
            output_string += md.calculator_data[top_minion]["display"] + " : " + calculator.gui.reduced_number(calculated_setup_profits[top_minion]) + " , " + calculator.gui.reduced_number(calculated_setup_costs[top_minion]) + "\n";
            delete calculated_setup_profits[top_minion];
        };
        console.log(output_string);
        calculator.collect_addon_output("Basic Minion Loop", "See console (F12)");
        return;
    };

    bad_luck_inferno(calculator, setup_data=null, outputs=null, return_value=false) {
        // Outputs the profit of the common Hypergolic drops and the price per Inferno Vertex
        if (setup_data === null) {
            setup_data = calculator.gui.get_from_GUI(["fuel", "inferno_grade", "bazaar_buy_type", "bazaar_sell_type", "bazaar_taxes", "bazaar_flipper", "mayor"]);
            outputs = calculator.gui.get_from_GUI(["total_profit", "itemtype_profit"]);
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
        let no_rng_profit = total_profit - item_type_profit["INFERNO_APEX"] - item_type_profit["REAPER_PEPPER"] - item_type_profit["INFERNO_VERTEX"] - item_type_profit["GABAGOOL_THE_FISH"];
        if (return_value) {
            return no_rng_profit;
        };
        let per_vertex = calculator.get_price("INFERNO_VERTEX", setup_data, "sell", "bazaar");
        calculator.collect_addon_output("Bad Luck Inferno Profit", `${calculator.gui.reduced_number(no_rng_profit, 2)} + ${calculator.gui.reduced_number(per_vertex, 2)} per Inferno Vertex`);
        return;
    };

    async inferno_minion_loop(calculator) {
        let setup_data = calculator.gui.get_from_GUI(calculator.ID_order);
        let calculated_setup_profits = {};
        let calculated_setup_bad_luck_profits = {};
        let calculated_setup_costs = {};
    
        let cost_filter = await this.get_inferno_cost_filter(calculator);
        setup_data["minion"] = "INFERNO_MINION"
        setup_data["fuel"] = "INFERNO_FUEL"
        setup_data["chest"] = "XXLARGE_ENCHANTED_CHEST"
        setup_data["rising_celsius_override"] = true
    
        const loop_tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const loop_amounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
        for (const loop_tier of loop_tiers) {
            setup_data["miniontier"] = loop_tier;
            for (const loop_amount of loop_amounts) {
                setup_data["amount"] = loop_amount;
                let outputs = await calculator.calculate(false, setup_data, true);
                let bad_luck_profit = this.bad_luck_inferno(calculator, setup_data, outputs, true);
                let cost = outputs["setupcost"];
                // if (calculator.variables["free_will"]["var"]) {
                //     cost += calculator.variables["freewillcost"]["var"];
                // };
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
        let output_string = "Tier, Amount : bad luck profit , minion cost , true average profit\n";
        for (let i = 1; i <= 10; i++) {
            if (calculator.gui.get_length(calculated_setup_bad_luck_profits) === 0) {
                break;
            };
            let top_minion = Object.keys(calculated_setup_bad_luck_profits).reduce((a, b) => calculated_setup_bad_luck_profits[a] > calculated_setup_bad_luck_profits[b] ? a : b);
            output_string += top_minion + " : " + calculator.gui.reduced_number(calculated_setup_bad_luck_profits[top_minion]) + " , " + calculator.gui.reduced_number(calculated_setup_costs[top_minion]) + " , " + calculator.gui.reduced_number(calculated_setup_profits[top_minion]) + "\n";
            delete calculated_setup_bad_luck_profits[top_minion];
        };
        
        output_string += `Bad Luck Profit: + ${calculator.gui.reduced_number(calculator.get_price('INFERNO_VERTEX', setup_data, 'sell', 'bazaar'), 2)} per Inferno Vertex\n`;
        console.log(output_string);
        calculator.collect_addon_output("Inferno Minion Loop", "See console (F12)");
    };

    get_inferno_cost_filter(calculator) {
        var promiseResolve, promiseReject;
        var cost_promise = new Promise(function(resolve, reject){
            promiseResolve = () => resolve(calculator.edit_vars_output["inferno_loop_cost_filter"]);
            promiseReject = () => reject(600000000);
        });
        calculator.gui.edit_vars.bind(calculator)(promiseResolve, {"inferno_loop_cost_filter": {"dtype": "number", "display": "Max Setup Cost", "initial": 0, "options": null}}, false);
        return cost_promise;
    };
};