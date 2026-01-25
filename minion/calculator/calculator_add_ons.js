
class Calc_add_ons {
    constructor() {
        this.add_ons_package = {"Minion Crafting": this.craft_material_amount, "Days to Repay Setup": this.setup_repay_time, "Basic Minion Loop": this.basic_minion_loop, "Bad Luck Inferno": this.bad_luck_inferno, "Rising Celsius Override": this.rising_celsius_override, "Inferno Minion Loop": this.inferno_minion_loop};
    };

    craft_material_amount(calculator) {
        calculator.get_inputs()
        const minion = calculator.variables["minion"]["var"];
        const tier = calculator.variables["miniontier"]["var"];
        const minion_amount = calculator.variables["amount"]["var"];
        const materials = md.minionCostSum(minion, tier);
        const extra_costs_string = calculator.variables["extracost"]["var"];
        let materials_string = Object.keys(materials).map(material => `${materials[material] * minion_amount} ${md.itemList[material]["display"]}`).join(", ");
        if (GUI.get_length(extra_costs_string) !== 0) {
            materials_string += ", " + extra_costs_string;
        };
        calculator.collect_addon_output("Minion Crafting Materials", materials_string);
        return;
    };

    setup_repay_time(calculator) {
        // Outputs the time (in days) it take for a setup to repay itself
        const totaltime = calculator.variables["time_seconds"]["var"];
        let setupcost = calculator.variables["setupcost"]["var"];
        if (calculator.variables["free_will"]["var"]) {
            setupcost += calculator.variables["freewillcost"]["var"];
        };
        let profit = calculator.variables["totalProfit"]["var"];
        if (profit < 0) {
            calculator.collect_addon_output("Setup Repay Time", "Negative profit, cannot repay");
            return;
        };
        let profitpersecond = profit / totaltime;
        let repay_time_s = setupcost / profitpersecond;
        if (profitpersecond === Infinity || repay_time_s === Infinity) {
            calculator.collect_addon_output("Setup Repay Time", "Division by zero");
            return;
        };
        let repay_time = GUI.round_number(repay_time_s / 86400);
        calculator.collect_addon_output("Setup Repay Time", `${repay_time} Days`);
        return;
    };

    basic_minion_loop(calculator) {
        calculator.get_inputs();
        let calculated_setup_profits = {};
        let calculated_setup_costs = {};
        const loop_minion_options = Object.keys(md.minionList);
        const loop_minion_skip = ["Custom"];
        const loop_minion_smelting = ["Iron", "Gold", "Cactus"];
        const loop_minion_combat = ["Zombie", "Revenant", "Voidling", "Inferno", "Vampire", "Skeleton", "Creeper", "Spider", "Tarantula", "Cave Spider", "Blaze", "Magma Cube", "Enderman", "Ghast", "Slime", "Cow", "Pig", "Chicken", "Sheep", "Rabbit"];
        let super_compactor = false;
        if (["Super Compactor 3000", "Dwarven Super Compactor"].includes(calculator.variables["upgrade1"]["var"])) {
            super_compactor = true;
        };
        if (["Super Compactor 3000", "Dwarven Super Compactor"].includes(calculator.variables["upgrade2"]["var"])) {
            super_compactor = true;
            calculator.variables["upgrade2"]["var"] = calculator.variables["upgrade1"]["var"];
            calculator.variables["upgrade1"]["var"] = "Super Compactor 3000";
        };
        
        const upgrades = [calculator.variables["upgrade1"]["var"], calculator.variables["upgrade2"]["var"]]
        for (const loop_minion of loop_minion_options) {
            if (loop_minion_skip.includes(loop_minion)) {
                continue;
            };
            if (!(loop_minion_combat.includes(loop_minion)) && upgrades.includes("Corrupt Soil")) {
                continue;
            };
            calculator.variables["minion"]["var"] = loop_minion;
            calculator.variables["miniontier"]["var"] = Number(Object.keys(md.minionList[loop_minion]["speed"]).slice(-1));
            if (super_compactor) {
                if (loop_minion_smelting.includes(loop_minion)) {
                    calculator.variables["upgrade1"]["var"] = "Dwarven Super Compactor";
                } else {
                    calculator.variables["upgrade1"]["var"] = "Super Compactor 3000";
                };
            };
            calculator.calculate();
            calculated_setup_profits[loop_minion] = calculator.variables["totalProfit"]["var"];
            calculated_setup_costs[loop_minion] = calculator.variables["setupcost"]["var"];
            if (calculator.variables["free_will"]["var"]) {
                calculated_setup_costs[loop_minion] += calculator.variables["freewillcost"]["var"];
            };
        };
        let output_string = "Minion : profit , setup cost\n";
        for (let i = 1; i <= 10; i++) {
            let top_minion = Object.keys(calculated_setup_profits).reduce((a, b) => calculated_setup_profits[a] > calculated_setup_profits[b] ? a : b);
            output_string += top_minion + " : " + GUI.reduced_number(calculated_setup_profits[top_minion]) + " , " + GUI.reduced_number(calculated_setup_costs[top_minion]) + "\n";
            delete calculated_setup_profits[top_minion];
        };
        console.log(output_string);
        calculator.collect_addon_output("Basic Minion Loop", "See console (F12)");
        return;
    };

    bad_luck_inferno(calculator, return_value=false) {
        // Outputs the profit of the common Hypergolic drops and the price per Inferno Vertex
        if (calculator.variables["fuel"]["var"] !== "Inferno Minion Fuel") {
            calculator.collect_addon_output("Bad Luck Inferno", "No Inferno Minion Fuel Found");
            return;
        };
        if (calculator.variables["infernoGrade"]["var"] !== "Hypergolic Gabagool") {
            calculator.collect_addon_output("Bad Luck Inferno", "No Hypergolic Items Found");
            return;
        };
        let total_profit = calculator.variables["totalProfit"]["var"];
        let item_type_profit = calculator.variables["itemtypeProfit"]["list"];
        let no_rng_profit = total_profit - item_type_profit["INFERNO_APEX"] - item_type_profit["REAPER_PEPPER"] - item_type_profit["INFERNO_VERTEX"] - item_type_profit["GABAGOOL_THE_FISH"];
        if (return_value) {
            return no_rng_profit;
        };
        let per_vertex = calculator.getPrice("INFERNO_VERTEX", "sell", "bazaar");
        calculator.collect_addon_output("Bad Luck Inferno Profit", `${GUI.reduced_number(no_rng_profit, 2)} + ${GUI.reduced_number(per_vertex, 2)} per Inferno Vertex`);
        return;
    };

    rising_celsius_override(calculator, inGUI=true) {
        // Forces the rising celsius boost to max
        calculator.rising_celsius_override = true;
        if (inGUI === true) {
            calculator.get_inputs();
            calculator.calculate();
            calculator.update_GUI();
            calculator.collect_addon_output("Rising Celsius Override", "Forced Rising Celsius boost to max");
        } else {
            calculator.calculate();
        };
        calculator.rising_celsius_override = false;
        return;
    };

    async inferno_minion_loop(calculator) {
        let calculated_setup_profits = {};
        let calculated_setup_bad_luck_profits = {};
        let calculated_setup_costs = {};
    
        let cost_filter = await this.get_inferno_cost_filter(calculator);
        calculator.get_inputs();
        calculator.variables["minion"]["var"] = "Inferno";
        calculator.variables["fuel"]["var"] = "Inferno Minion Fuel";
        calculator.variables["chest"]["var"] = "XX-Large";
    
        const loop_tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const loop_amounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        for (const loop_tier of loop_tiers) {
            calculator.variables["miniontier"]["var"] = loop_tier;
            for (const loop_amount of loop_amounts) {
                calculator.variables["amount"]["var"] = loop_amount;
                this.rising_celsius_override(calculator, false);
                let bad_luck_profit = this.bad_luck_inferno(calculator, true);
                let cost = calculator.variables["setupcost"]["var"];
                if (calculator.variables["free_will"]["var"]) {
                    cost += calculator.variables["freewillcost"]["var"];
                };
                if (cost < cost_filter) {
                    calculated_setup_costs[`${loop_tier}, ${loop_amount}`] = cost;
                    calculated_setup_profits[`${loop_tier}, ${loop_amount}`] = calculator.variables["totalProfit"]["var"];
                    calculated_setup_bad_luck_profits[`${loop_tier}, ${loop_amount}`] = bad_luck_profit;
                };
            };
        };
        if (GUI.get_length(calculated_setup_bad_luck_profits) === 0) {
            calculator.collect_addon_output("Inferno Minion Loop", "No setups pass the cost filter");
            return;
        };
        let output_string = "Tier, Amount : bad luck profit , minion cost , true average profit\n";
        for (let i = 1; i <= 10; i++) {
            if (GUI.get_length(calculated_setup_bad_luck_profits) === 0) {
                break;
            };
            let top_minion = Object.keys(calculated_setup_bad_luck_profits).reduce((a, b) => calculated_setup_bad_luck_profits[a] > calculated_setup_bad_luck_profits[b] ? a : b);
            output_string += top_minion + " : " + GUI.reduced_number(calculated_setup_bad_luck_profits[top_minion]) + " , " + GUI.reduced_number(calculated_setup_costs[top_minion]) + " , " + GUI.reduced_number(calculated_setup_profits[top_minion]) + "\n";
            delete calculated_setup_bad_luck_profits[top_minion];
        };
        
        output_string += `Bad Luck Profit: + ${GUI.reduced_number(calculator.getPrice('INFERNO_VERTEX', 'sell', 'bazaar'), 2)} per Inferno Vertex\n`;
        console.log(output_string);
        calculator.collect_addon_output("Inferno Minion Loop", "See console (F12)");
    };

    get_inferno_cost_filter(calculator) {
        var promiseResolve, promiseReject;
        var cost_promise = new Promise(function(resolve, reject){
            promiseResolve = () => resolve(calculator.edit_vars_output["inferno_loop_cost_filter"]);
            promiseReject = () => reject(600000000);
        });
        GUI.edit_vars.bind(calculator)(promiseResolve, {"inferno_loop_cost_filter": {"dtype": "number", "display": "Max Setup Cost", "initial": 0, "options": []}}, false);
        return cost_promise;
    };
};