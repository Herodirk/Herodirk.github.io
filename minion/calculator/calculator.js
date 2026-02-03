class Calculator {
    constructor() {
        this.edit_vars_output = {};
        this.pet_costs = {
            "None": {"min": 0, "max": 0}
        };
        this.edit_pet_price_pet = "None";

        this.templateList = {
            "Choose Template": {},
            "ID": {},
            "Clean": {},
            "Corrupt": {
                "hopper": "Enchanted Hopper",
                "upgrade1": "Corrupt Soil",
                "upgrade2": "Diamond Spreading",
                "sell_loc": "Hopper",
            },
            "Compact": {
                "sell_loc": "Best (NPC/Bazaar)",
                "upgrade1": "Super Compactor 3000",
            },
            "Compact Corrupt": {
                "sell_loc": "Best (NPC/Bazaar)",
                "hopper": "Enchanted Hopper",
                "upgrade1": "Super Compactor 3000",
                "upgrade2": "Corrupt Soil",
            },
            "Cheap speed": {
                "fuel": "Enchanted Lava Bucket",
                "upgrade2": "Diamond Spreading",
                "beacon": 0,
                "infusion": false,
                "free_will": false,
                "postcard": true,
            },
            "No permanent speed": {
                "fuel": "Plasma Bucket",
                "upgrade2": "Flycatcher",
                "beacon": 5,
                "infusion": false,
                "free_will": false,
                "postcard": true,
            },
            "Max speed": {
                "fuel": "Plasma Bucket",
                "upgrade2": "Flycatcher",
                "beacon": 5,
                "infusion": true,
                "free_will": true,
                "postcard": true,
            },
            "Hyper speed": {
                "fuel": "Hyper Catalyst",
                "upgrade2": "Flycatcher",
                "beacon": 5,
                "infusion": true,
                "free_will": true,
                "postcard": true,
            },
            "AFK with pet": {
                "afkpet_lvl": 100,
                "afk": true,
            },
            "Solo Wisdom": {
                "mining_wisdom": 83.5,  // max Seasoned Mineman (15), cookie (25), god pot (20), Cavern Wisdom (6.5), Refined Divine drill with Compact X (7 + 10)
                "combat_wisdom": 109,  // max Slayer unique tier kills (6 + 6 + 6 + 12 + 6), Rift Necklace (1), Hunter Ring (5), Bubba Blister (2), Veteran (10), cookie (25), god pot (30)
                "farming_wisdom": 72.5,  // Fruit Bowl (1), Pelt Belt (1), Zorro's Cape (1), Rift Necklace (1), Agarimoo Artifact (1), Garden Wisdom (6.5) cookie (25), god pot (20), Blessed Mythic farming tool with Cultivating X (6 + 10)
                "fishing_wisdom": 55.5,  // Moby-Duck (1), Future Calories Talisman (1), Agarimoo Artifact (1), Chumming Talisman (1), Sea Wisdom (6.5), cookie (25), god pot (20)
                "foraging_wisdom": 93.82,  // Efficient Forager (15), Foraging Wisdom (6.5), David's Cloak (5), Foraging Wisdom Boosters armor and equipment (4 + 2), cookie (25), god pot (20), Moonglade Legendary Axe with Absorb X, Foraging Wisdom Boosters and essence shop perk Axed I ((5 + 10 + 1) * 1.02)
            },
            "Full Coop Wisdom": {  // cookie (25), god pot (20), 8 * (1 + 45 / 100) = 8 + (8 * 45) / 100 =  1 + (700 + 8 * 45) / 100 = 1 + 1060 / 100
                "mining_wisdom": 1060,  
                "combat_wisdom": 1060,
                "farming_wisdom": 1060,
                "fishing_wisdom": 1060,
                "foraging_wisdom": 1060,
            },
            "Combat Pet Leveling": {
                "expshareitem": true,
                "taming": 60,
                "falcon_attribute": 10,
                "petxpboost": "Epic Combat Exp Boost",
                "toucan_attribute": 10,
            },
            "Maxed Inferno Minion": {
                "minion": "Inferno",
                "amount": 32,
                "fuel": "Inferno Minion Fuel",
                "inferno_grade": "Hypergolic Gabagool",
                "inferno_distillate": "Gabagool Distillate",
                "inferno_eyedrops": true,
                "sell_loc": "Best (NPC/Bazaar)",
                "upgrade1": "Super Compactor 3000",
                "upgrade2": "Flycatcher",
                "chest": "XX-Large",
                "beacon": 5,
                "scorched": true,
                "infusion": true,
                "free_will": true,
                "postcard": true,
                "bazaar_sell_type": "Sell Offer",
                "bazaar_buy_type": "Buy Order",
            },
        };

        this.version = 1.2;
        GUI.main = this;
        this.var_dict = {}
        this.gui = GUI;
        this.frames = {
            "inputs_minion_grid": document.getElementById("inputs_minion_grid"),
            "inputs_player_grid": document.getElementById("inputs_player_grid"),
            "outputs_setup_grid": document.getElementById("outputs_setup_grid"),
            "outputs_profit_grid": document.getElementById("outputs_profit_grid"),
            "controls": document.getElementById("controls"),
            "addons_buttons_grid": document.getElementById("addons_buttons_grid"),
            "addons_output_grid": document.getElementById("addons_output_grid"),
        };

        this.template = new Hvar({"huim": this.gui, "key": "template", "vtype": "input", "display": "Templates", "initial": "Choose Template", "dtype": "string", "frame": "inputs_minion_grid", "options": Object.keys(this.templateList), "command": this.load_template});
        this.load_ID = new Hvar({"huim": this.gui, "key": "load_id", "vtype": "input", "dtype": "string", "frame": "inputs_minion_grid", "display": "Load ID", "initial": ""});
        this.minion = new Hvar({"huim": this.gui, "key": "minion", "vtype": "input", "dtype": "string", "display": "Minion", "frame": "inputs_minion_grid", "initial": "Custom", "options": Object.keys(md.minionList), "command": () => this.multiswitch('minion')});
        this.miniontier = new Hvar({"huim": this.gui, "key": "miniontier", "vtype": "input", "dtype": "number", "display": "Tier", "frame": "inputs_minion_grid", "initial": 12, "options": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "command": () => this.multiswitch('tier')});
        this.amount = new Hvar({"huim": this.gui, "key": "amount", "vtype": "input", "dtype": "number", "display": "Amount", "frame": "inputs_minion_grid", "initial": 1, "options": null});
        this.fuel = new Hvar({"huim": this.gui, "key": "fuel", "vtype": "input", "dtype": "string", "display": "Fuel", "frame": "inputs_minion_grid", "initial": "None", "options": md.fuel_options, "command": () => this.multiswitch('fuel')});
        this.inferno_grade = new Hvar({"huim": this.gui, "key": "inferno_grade", "vtype": "input", "dtype": "string", "display": "Grade", "frame": "inputs_minion_grid", "initial": "Hypergolic Gabagool", "options": md.inferno_fuel_grade_options});
        this.inferno_distillate = new Hvar({"huim": this.gui, "key": "inferno_distillate", "vtype": "input", "dtype": "string", "display": "Distillate", "frame": "inputs_minion_grid", "initial": "Gabagool Distillate", "options": md.inferno_fuel_distillate_options});
        this.inferno_eyedrops = new Hvar({"huim": this.gui, "key": "inferno_eyedrops", "vtype": "input", "dtype": "boolean", "display": "Eyedrops", "frame": "inputs_minion_grid", "initial": true});
        this.hopper = new Hvar({"huim": this.gui, "key": "hopper", "vtype": "input", "dtype": "string", "display": "Hopper", "frame": "inputs_minion_grid", "initial": "None", "options": md.hopper_options});
        this.upgrade1 = new Hvar({"huim": this.gui, "key": "upgrade1", "vtype": "input", "dtype": "string", "display": "Upgrade 1", "frame": "inputs_minion_grid", "initial": "None", "options": md.upgrade_options});
        this.upgrade2 = new Hvar({"huim": this.gui, "key": "upgrade2", "vtype": "input", "dtype": "string", "display": "Upgrade 2", "frame": "inputs_minion_grid", "initial": "None", "options": md.upgrade_options});
        this.chest = new Hvar({"huim": this.gui, "key": "chest", "vtype": "input", "dtype": "string", "display": "Chest", "frame": "inputs_minion_grid", "initial": "None", "options": md.chest_options});
        this.beacon = new Hvar({"huim": this.gui, "key": "beacon", "vtype": "input", "dtype": "string", "display": "Beacon", "frame": "inputs_minion_grid", "initial": "None", "options": md.beacon_options, "command": this.gui.create_switch_call("beacon", "beacon")});
        this.scorched = new Hvar({"huim": this.gui, "key": "scorched", "vtype": "input", "dtype": "boolean", "display": "Scorched", "frame": "inputs_minion_grid", "initial": false});
        this.B_constant = new Hvar({"huim": this.gui, "key": "B_constant", "vtype": "input", "dtype": "boolean", "display": "Free Fuel Beacon", "frame": "inputs_minion_grid", "initial": false});
        this.B_acquired = new Hvar({"huim": this.gui, "key": "B_acquired", "vtype": "input", "dtype": "boolean", "display": "Acquired Beacon", "frame": "inputs_minion_grid", "initial": false});
        this.infusion = new Hvar({"huim": this.gui, "key": "infusion", "vtype": "input", "dtype": "boolean", "display": "Infusion", "frame": "inputs_minion_grid", "initial": false});
        this.crystal = new Hvar({"huim": this.gui, "key": "crystal", "vtype": "input", "dtype": "string", "display": "Crystal", "frame": "inputs_minion_grid", "initial": "None", "options": md.floating_crystal_options});
        this.free_will = new Hvar({"huim": this.gui, "key": "free_will", "vtype": "input", "dtype": "boolean", "display": "Free Will", "frame": "inputs_minion_grid", "initial": false, "command": this.gui.create_switch_call("free_will", "free_will")});
        this.postcard = new Hvar({"huim": this.gui, "key": "postcard", "vtype": "input", "dtype": "boolean", "display": "Postcard", "frame": "inputs_minion_grid", "initial": false});
        this.afk = new Hvar({"huim": this.gui, "key": "afk", "vtype": "input", "dtype": "boolean", "display": "AFK", "frame": "inputs_player_grid", "initial": false, "command": () => this.multiswitch("afk")});
        this.afkpet = new Hvar({"huim": this.gui, "key": "afkpet", "vtype": "input", "dtype": "string", "display": "AFK Pet", "frame": "inputs_player_grid", "initial": "None", "options": Object.keys(md.boost_pets)});
        this.afkpet_rarity = new Hvar({"huim": this.gui, "key": "afkpet_rarity", "vtype": "input", "dtype": "string", "display": "AFK Pet Rarity", "frame": "inputs_player_grid", "initial": "Legendary", "options": ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']});
        this.afkpet_lvl = new Hvar({"huim": this.gui, "key": "afkpet_lvl", "vtype": "input", "dtype": "number", "display": "AFK Pet level", "frame": "inputs_player_grid", "initial": 0.0});
        this.enchanted_clock = new Hvar({"huim": this.gui, "key": "enchanted_clock", "vtype": "input", "dtype": "boolean", "display": "Enchanted Clock", "frame": "inputs_player_grid", "initial": false});
        this.special_layout = new Hvar({"huim": this.gui, "key": "special_layout", "vtype": "input", "dtype": "boolean", "display": "Special Layout", "frame": "inputs_player_grid", "initial": false});
        this.player_harvests = new Hvar({"huim": this.gui, "key": "player_harvests", "vtype": "input", "dtype": "boolean", "display": "Player Harvests", "frame": "inputs_player_grid", "initial": false});
        this.player_looting = new Hvar({"huim": this.gui, "key": "player_looting", "vtype": "input", "dtype": "number", "display": "Looting", "frame": "inputs_player_grid", "initial": 0, "options": [0, 1, 2, 3, 4, 5]});
        this.potato_accessory = new Hvar({"huim": this.gui, "key": "potato_accessory", "vtype": "input", "dtype": "string", "display": "Potato Accessory", "frame": "inputs_player_grid", "initial": "None", "options": md.potato_accessory_options});
        this.combat_wisdom = new Hvar({"huim": this.gui, "key": "combat_wisdom", "vtype": "storage", "dtype": "number", "display": "Combat", "initial": 0.0});
        this.mining_wisdom = new Hvar({"huim": this.gui, "key": "mining_wisdom", "vtype": "storage", "dtype": "number", "display": "Mining", "initial": 0.0});
        this.farming_wisdom = new Hvar({"huim": this.gui, "key": "farming_wisdom", "vtype": "storage", "dtype": "number", "display": "Farming", "initial": 0.0});
        this.fishing_wisdom = new Hvar({"huim": this.gui, "key": "fishing_wisdom", "vtype": "storage", "dtype": "number", "display": "Fishing", "initial": 0.0});
        this.foraging_wisdom = new Hvar({"huim": this.gui, "key": "foraging_wisdom", "vtype": "storage", "dtype": "number", "display": "Foraging", "initial": 0.0});
        this.alchemy_wisdom = new Hvar({"huim": this.gui, "key": "alchemy_wisdom", "vtype": "storage", "dtype": "number", "display": "Alchemy", "initial": 0.0});
        this.wisdom = new Hvar({"huim": this.gui, "key": "wisdom", "vtype": "output", "dtype": "object", "display": "Wisdom", "frame": "inputs_player_grid", "widget_width": null, "widget_height": 6, "initial": {'combat': this.combat_wisdom.var, 'mining': this.mining_wisdom.var, 'farming': this.farming_wisdom.var, 'fishing': this.fishing_wisdom.var, 'foraging': this.foraging_wisdom.var, 'alchemy': this.alchemy_wisdom.var}});
        this.mayor = new Hvar({"huim": this.gui, "key": "mayor", "vtype": "input", "dtype": "string", "display": "Mayor", "frame": "inputs_player_grid", "initial": "None", "options": ['None', 'Aatrox', 'Cole', 'Diana', 'Diaz', 'Finnegan', 'Foxy', 'Marina', 'Paul', 'Jerry', 'Derpy', 'Scorpius', 'Aura'], "command": () => this.multiswitch("mayors")});
        this.levelingpet = new Hvar({"huim": this.gui, "key": "levelingpet", "vtype": "input", "dtype": "string", "display": "Leveling pet", "frame": "inputs_player_grid", "initial": "None", "options": Object.keys(md.all_pets), "command": () => this.multiswitch("pet_leveling")});
        this.taming = new Hvar({"huim": this.gui, "key": "taming", "vtype": "input", "dtype": "number", "display": "Taming", "frame": "inputs_player_grid", "initial": 0.0});
        this.falcon_attribute = new Hvar({"huim": this.gui, "key": "falcon_attribute", "vtype": "input", "dtype": "number", "display": "Battle Experience", "frame": "inputs_player_grid", "initial": 0, "options": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]});
        this.toucan_attribute = new Hvar({"huim": this.gui, "key": "toucan_attribute", "vtype": "input", "dtype": "number", "display": "Why Not More", "frame": "inputs_player_grid", "initial": 0, "options": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]});
        this.petxpboost = new Hvar({"huim": this.gui, "key": "petxpboost", "vtype": "input", "dtype": "string", "display": "Pet XP boost", "frame": "inputs_player_grid", "initial": "None", "options": md.pet_exp_boost_options});
        this.beastmaster = new Hvar({"huim": this.gui, "key": "beastmaster", "vtype": "input", "dtype": "number", "display": "Beastmaster", "frame": "inputs_player_grid", "initial": 0.0});
        this.expsharepet = new Hvar({"huim": this.gui, "key": "expsharepet", "vtype": "input", "dtype": "string", "display": "Exp Share pet", "frame": "inputs_player_grid", "initial": "None", "options": Object.keys(md.all_pets)});
        this.expsharepetslot2 = new Hvar({"huim": this.gui, "key": "expsharepetslot2", "vtype": "input", "dtype": "string", "display": "Exp Share pet 2", "frame": "inputs_player_grid", "initial": "None", "options": Object.keys(md.all_pets)});
        this.expsharepetslot3 = new Hvar({"huim": this.gui, "key": "expsharepetslot3", "vtype": "input", "dtype": "string", "display": "Exp Share pet 3", "frame": "inputs_player_grid", "initial": "None", "options": Object.keys(md.all_pets)});
        this.expshareitem = new Hvar({"huim": this.gui, "key": "expshareitem", "vtype": "input", "dtype": "boolean", "display": "Exp Share pet item", "frame": "inputs_player_grid", "initial": false});
        this.scale_time = new Hvar({"huim": this.gui, "key": "scale_time", "vtype": "input", "dtype": "boolean", "display": "Scale Time", "frame": "inputs_player_grid", "initial": false, "command": this.gui.create_switch_call("scaled_time_switch", "scale_time")});
        this.sell_loc = new Hvar({"huim": this.gui, "key": "sell_loc", "vtype": "input", "dtype": "string", "display": "Sell Location", "frame": "inputs_player_grid", "initial": "Best (NPC/Bazaar)", "options": ['Best (NPC/Bazaar)', 'Bazaar', 'Hopper', 'NPC'], "command": this.gui.create_switch_call("NPC_Bazaar", "sell_loc")});
        this.bazaar_sell_type = new Hvar({"huim": this.gui, "key": "bazaar_sell_type", "vtype": "input", "dtype": "string", "display": "Bazaar sell type", "frame": "inputs_player_grid", "initial": "Sell Offer", "options": Object.keys(md.bazaar_sell_types)});
        this.bazaar_buy_type = new Hvar({"huim": this.gui, "key": "bazaar_buy_type", "vtype": "input", "dtype": "string", "display": "Bazaar buy type", "frame": "inputs_player_grid", "initial": "Buy Order", "options": Object.keys(md.bazaar_buy_types)});
        this.bazaar_taxes = new Hvar({"huim": this.gui, "key": "bazaar_taxes", "vtype": "input", "dtype": "boolean", "display": "Bazaar taxes", "frame": "inputs_player_grid", "initial": true, "command": this.gui.create_switch_call("bazaar_tax", "bazaar_taxes")});
        this.bazaar_flipper = new Hvar({"huim": this.gui, "key": "bazaar_flipper", "vtype": "input", "dtype": "number", "display": "Bazaar Flipper", "frame": "inputs_player_grid", "initial": 1, "options": [0, 1, 2]});
        this.ID = new Hvar({"huim": this.gui, "key": "ID", "vtype": "output", "dtype": "string", "display": "Setup ID", "frame": "outputs_setup_grid", "initial": "", "switch_initial": true});
        this.ID_container = new Hvar({"huim": this.gui, "key": "ID_container", "vtype": "output", "dtype": "object", "display": "ID", "frame": "outputs_setup_grid", "widget_width": 35, "widget_height": 1, "initial": [], "switch_initial": false});
        this.scaled_time = new Hvar({"huim": this.gui, "key": "scaled_time", "vtype": "output", "dtype": "string", "display": "Scaled Time", "frame": "outputs_setup_grid", "initial": "1.0 Days", "switch_initial": true});
        this.time_seconds = new Hvar({"huim": this.gui, "key": "time_seconds", "vtype": "storage", "dtype": "number", "display": "Time (s)", "initial": 86400.0});
        this.empty_time = new Hvar({"huim": this.gui, "key": "empty_time", "vtype": "output", "dtype": "string", "display": "Empty Time", "fancy_display": "Empty every", "frame": "outputs_setup_grid", "initial": "1.0 Days", "switch_initial": true});
        this.actiontime = new Hvar({"huim": this.gui, "key": "actiontime", "vtype": "output", "dtype": "number", "display": "Action time (s)", "frame": "outputs_setup_grid", "initial": 0.0, "switch_initial": false});
        this.harvests = new Hvar({"huim": this.gui, "key": "harvests", "vtype": "output", "dtype": "number", "display": "Harvests", "frame": "outputs_setup_grid", "initial": 0.0, "switch_initial": false});
        this.items = new Hvar({"huim": this.gui, "key": "items", "vtype": "output", "dtype": "object", "display": "Item amounts", "frame": "outputs_setup_grid", "widget_width": 35, "widget_height": null, "initial": {}, "switch_initial": false, "tags": ["item_ID_to_display"]});
        this.item_sell_loc = new Hvar({"huim": this.gui, "key": "item_sell_loc", "vtype": "output", "dtype": "object", "display": "Sell locations", "frame": "outputs_profit_grid", "widget_width": 35, "widget_height": null, "initial": {}, "switch_initial": false, "tags": ["item_ID_to_display"]});
        this.filltime = new Hvar({"huim": this.gui, "key": "filltime", "vtype": "output", "dtype": "number", "display": "Fill time", "frame": "outputs_setup_grid", "initial": 0.0, "switch_initial": false});
        this.used_storage = new Hvar({"huim": this.gui, "key": "used_storage", "vtype": "output", "dtype": "number", "display": "Used Storage", "frame": "outputs_setup_grid", "initial": 0, "switch_initial": false});
        this.itemtype_profit = new Hvar({"huim": this.gui, "key": "itemtype_profit", "vtype": "output", "dtype": "object", "display": "Itemtype profits", "fancy_display": "Profits per item type", "frame": "outputs_profit_grid", "widget_width": 35, "widget_height": null, "initial": {}, "switch_initial": false, "tags": ["item_ID_to_display"]});
        this.item_profit = new Hvar({"huim": this.gui, "key": "item_profit", "vtype": "output", "dtype": "number", "display": "Total item profit", "frame": "outputs_profit_grid", "initial": 0.0, "switch_initial": false});
        this.xp = new Hvar({"huim": this.gui, "key": "xp", "vtype": "output", "dtype": "object", "display": "XP amounts", "frame": "outputs_setup_grid", "widget_width": 35, "widget_height": 4, "initial": {}, "switch_initial": false});
        this.pets_levelled = new Hvar({"huim": this.gui, "key": "pets_levelled", "vtype": "output", "dtype": "object", "display": "Pets Levelled", "frame": "outputs_setup_grid", "widget_width": 35, "widget_height": 4, "initial": {}, "switch_initial": false});
        this.pet_profit = new Hvar({"huim": this.gui, "key": "pet_profit", "vtype": "output", "dtype": "number", "display": "Pet profit", "frame": "outputs_profit_grid", "initial": 0.0, "switch_initial": false});
        this.fuelcost = new Hvar({"huim": this.gui, "key": "fuelcost", "vtype": "output", "dtype": "number", "display": "Fuel cost", "frame": "outputs_profit_grid", "initial": 0.0, "switch_initial": false});
        this.fuelamount = new Hvar({"huim": this.gui, "key": "fuelamount", "vtype": "output", "dtype": "number", "display": "Fuel amount", "frame": "outputs_setup_grid", "initial": 0.0, "switch_initial": false});
        this.total_profit = new Hvar({"huim": this.gui, "key": "total_profit", "vtype": "output", "dtype": "number", "display": "Total profit", "frame": "outputs_profit_grid", "initial": 0.0, "switch_initial": true});
        this.notes = new Hvar({"huim": this.gui, "key": "notes", "vtype": "output", "dtype": "object", "display": "Notes", "frame": "outputs_setup_grid", "widget_width": 50, "widget_height": 4, "initial": {}, "switch_initial": false});
        this.bazaar_update_txt = new Hvar({"huim": this.gui, "key": "bazaar_update_txt", "vtype": "output", "dtype": "string", "display": "Bazaar data", "frame": "outputs_profit_grid", "initial": "Not Loaded", "switch_initial": true});
        this.setupcost = new Hvar({"huim": this.gui, "key": "setupcost", "vtype": "output", "dtype": "number", "display": "Setup cost", "frame": "outputs_profit_grid", "initial": 0.0, "switch_initial": true});
        this.freewillcost = new Hvar({"huim": this.gui, "key": "freewillcost", "vtype": "output", "dtype": "number", "display": "Free Will cost", "fancy_display": "+ Average Free Will cost", "frame": "outputs_profit_grid", "initial": 0.0, "switch_initial": true});
        this.extracost = new Hvar({"huim": this.gui, "key": "extracost", "vtype": "storage", "dtype": "string", "display": "Extra cost", "fancy_display": "+ Extra cost", "initial": ""});
        this.optimal_tier_free_will = new Hvar({"huim": this.gui, "key": "optimal_tier_free_will", "vtype": "storage", "dtype": "number", "display": "Optimal Tier Free Will", "initial": 1});
        this.available_storage = new Hvar({"huim": this.gui, "key": "available_storage", "vtype": "storage", "dtype": "number", "display": "Available Storage", "initial": 0});
        this.addons_output_container = new Hvar({"huim": this.gui, "key": "addons_output_container", "vtype": "output", "dtype": "object", "display": "Add-on Outputs", "frame": "addons_output_grid", "widget_width": 65, "widget_height": 20, "initial": {}, "switch_initial": false});
        this.empty_time_amount = new Hvar({"huim": this.gui, "key": "empty_time_amount", "vtype": "input", "dtype": "number", "display": "Empty Time span", "initial": 1.0, "frame": "inputs_player_grid"});
        this.empty_time_unit = new Hvar({"huim": this.gui, "key": "empty_time_unit", "vtype": "input", "dtype": "string", "display": "Empty Time unit", "initial": "Days", "frame": "inputs_player_grid", "options": ["Years", "Weeks", "Days", "Hours", "Minutes", "Seconds", "Harvests"]});
        this.scaled_time_amount = new Hvar({"huim": this.gui, "key": "scaled_time_amount", "vtype": "input", "dtype": "number", "display": "Scaled Time span", "initial": 1.0, "frame": "inputs_player_grid"});
        this.scaled_time_unit = new Hvar({"huim": this.gui, "key": "scaled_time_unit", "vtype": "input", "dtype": "string", "display": "Scaled Time unit", "initial": "Days", "frame": "inputs_player_grid", "options": ["Years", "Weeks", "Days", "Hours", "Minutes", "Seconds", "Harvests"]});
        this.rising_celsius_override = new Hvar({"huim": this.gui, "key": "rising_celsius_override", "vtype": "input", "dtype": "boolean", "display": "Force Rising Celsius", "initial": false, "frame": "inputs_minion_grid"});
        this.used_pet_prices = new Hvar({"huim": this.gui, "key": "used_pet_prices", "vtype": "output", "dtype": "object", "display": "Used Pet Prices", "initial": {}, "frame": "outputs_profit_grid", "widget_width": 35, "widget_height": 4, "switch_initial": true});

        this.empty_time_amount.widget.push(this.empty_time_unit.widget[this.empty_time_unit.widget.length - 1]);
        this.scaled_time_amount.widget.push(this.scaled_time_unit.widget[this.scaled_time_unit.widget.length - 1]);

        let wisdomB = GUI.create_button('Edit', () => GUI.edit_vars.bind(this)(this.wisdom.update_listbox.bind(this)(x => x, x => x.get(), (key, val) => val.get() !== 0.0), ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"]));
        this.wisdom.widget.push(wisdomB);
        
        this.notesAnchor = GUI.genLabel("notesAnchor", "");
        this.notesAnchor.className = "notes_anchor";
        
        let calcB = GUI.create_button("Calculate", () => this.calculate.bind(this)(true), true);
        this.statusC = document.createElement("div")
        Object.assign(this.statusC, {innerText: "\n", className: "status_div", id: "status_div", style: "background: green;"});
        let outputB = GUI.create_button('Short Output', this.output_data.bind(this), true);
        let fancyoutputB = GUI.create_button('Share Output', this.fancy_output.bind(this), true);
        let bazaarB = GUI.create_button("Update Prices", this.update_prices.bind(this), true);
        let settingsB = GUI.create_button('Edit Settings', () => GUI.edit_vars.bind(this)(GUI.update_color_palette.bind(GUI), ["bazaar_auto_update", "bazaar_cooldown", "compact_tolerance", "output_to_clipboard", "color_palette"]), true);
        let pet_priceB = GUI.create_button('Edit Pet Prices', () => GUI.edit_vars.bind(this)(this.edit_pet_price_redirect.bind(this), {"edit_pet_price_pet": {"dtype": "string", "display": "Pet", "initial": "None", "options": Object.keys(md.all_pets)}}, false), true);
        let emptyspaceLB = GUI.genLabel("control_frame_filler", "")
        let creditLB = GUI.genLabel("credit_label", `Minion Calculator V${this.version}\nMade by Herodirk`);
        let API_creditLB = GUI.genLabel("API_credit_label", `Bazaar data from <a href="https://api.hypixel.net">Hypixel API</a>,<br>AH data from <a href="https://sky.coflnet.com/data">SkyCofl API</a> `, true);
        let manualLB = GUI.genLabel("manual_label", `Online Manual:<br><a href="https://herodirk.github.io/minion/index.html">Calculator Manual</a>`, true);
        API_creditLB.className = "control_label"
        creditLB.className = "control_label"
        manualLB.className = "control_label"
        
        let controlsGrid = [calcB, this.statusC, outputB, fancyoutputB, bazaarB, pet_priceB, settingsB, emptyspaceLB, API_creditLB, manualLB, creditLB];
        GUI.fill_arr(controlsGrid, this.frames["controls"]);
        
        let miniontitleLB = GUI.genLabel("miniontitleLB", "\nMinion options");
        let islandtitleLB = GUI.genLabel("islandtitleLB", "\nIsland options");
        let playertitleLB = GUI.genLabel("playertitleLB", "Player options");
        let timingtitleLB = GUI.genLabel("timingtitleLB", "\nTime options");
        let markettitleLB = GUI.genLabel("markettitleLB", "\nMarket options");
        let setupoutputsLB = GUI.genLabel("setupoutputsLB", "Setup Information");
        let setupprintLB = GUI.genLabel("setupprintLB", "Share");
        let minionoutputsLB = GUI.genLabel("minionoutputsLB", "Minion Outputs");
        let minionprintLB = GUI.genLabel("minionprintLB", "Share");
        let profitoutputsLB = GUI.genLabel("profitoutputsLB", "Profit Outputs");
        let profitprintLB = GUI.genLabel("profitprintLB", "Share");
        let addonsprintLB = GUI.genLabel("addonsprintLB", "Share")
        let addonsoutputsLB = GUI.genLabel("addonsoutputsLB", "Add-on Outputs")
        
        let afk_options_button = GUI.create_show_hide_toggle("afking");
        this.afk.widget.push(afk_options_button);
        let beacon_options_button = GUI.create_show_hide_toggle("beacon");
        this.beacon.widget.push(beacon_options_button);
        
        this.grids = {
            "inputs_minion_grid": {
                "template": null,
                "load_id": null,
                "minion_label": [null, miniontitleLB],
                "minion": null,
                "miniontier": null,
                "amount": null,
                "fuel": null,
                "inferno_grade": null,
                "inferno_distillate": null,
                "inferno_eyedrops": null,
                "rising_celsius_override": null,
                "hopper": null,
                "upgrade1": null,
                "upgrade2": null,
                "chest": null,
                "infusion": null,
                "free_will": null,
                "island_label": [null, islandtitleLB],
                "beacon": null,
                "scorched": null,
                "B_constant": null,
                "B_acquired": null,
                "crystal": null,
                "postcard": null,
            },
            "inputs_player_grid": {
                "player_label": [null, playertitleLB],
                "afk": null,
                "afkpet": null,
                "afkpet_rarity": null,
                "afkpet_lvl": null,
                "enchanted_clock": null,
                "special_layout": null,
                "player_harvests": null,
                "player_looting": null,
                "potato_accessory": null,
                "wisdom": null,
                "mayor": null,
                "levelingpet": null,
                "toggle_levelingpet_options": [null, GUI.create_show_hide_toggle(() => this.multiswitch("pet_leveling", true))],
                "taming": null,
                "falcon_attribute": null,
                "petxpboost": null,
                "beastmaster": null,
                "expsharepet": null,
                "expsharepetslot2": null,
                "expsharepetslot3": null,
                "toucan_attribute": null,
                "expshareitem": null,
                "timing_label": [null, timingtitleLB],
                "empty_time_amount": null,
                "scale_time": null,
                "scaled_time_amount": null,
                "market_label": [null, markettitleLB],
                "sell_loc": null,
                "bazaar_sell_type": null,
                "bazaar_buy_type": null,
                "bazaar_taxes": null,
                "bazaar_flipper": null
            },
            "outputs_setup_grid": {
                "labels": [null, setupoutputsLB, setupprintLB],
                "ID": [this.ID.widget[0], this.ID_container.widget[1], this.ID.widget[2]],
                "empty_time": null,
                "scaled_time": null,
                "actiontime": null,
                "fuelamount": null,
                "notes": [this.notes.widget[0], null, this.notes.widget[2]],
                "notes_anchor": [this.notesAnchor],
                "notes_space_1": [null],
                "notes_space_2": [null],
                "notes_space_3": [null],
                "minions_labels": [null, minionoutputsLB, minionprintLB],
                "harvests": null,
                "items": null,
                "used_storage": null,
                "xp": null,
                "pets_levelled": null,
            },
            "outputs_profit_grid": {
                "labels": [null, profitoutputsLB, profitprintLB],
                "bazaar_update_txt": null,
                "setupcost": null,
                "freewillcost": null,
                "item_sell_loc": null,
                "itemtype_profit": null,
                "item_profit": null,
                "used_pet_prices": null,
                "pet_profit": null,
                "fuelcost": null,
                "total_profit": null
            },
            "addons_output_grid": {
                "labels": [addonsoutputsLB, addonsprintLB],
                "addons_output_container": [this.addons_output_container.widget[1], this.addons_output_container.widget[2]]
            },
        };
        for (let grid_key of Object.keys(this.grids)) {
            GUI.fill_grid(this.gui.create_grid(this.grids[grid_key]), this.frames[grid_key]);
        };
        
        this.notes.widget[1].className = "notes_box";
        this.notesAnchor.appendChild(this.notes.widget[1]);
        
        // Add-ons buttons
        this.addons_list = {...add_ons.add_ons_package};
        this.addons_widgets = {};
        for (const [addon_name, addon_function] of Object.entries(this.addons_list)) {
            this.addons_widgets[addon_name] = []
            let button_function = () => addon_function.bind(add_ons)(this)
            this.addons_widgets[addon_name].push(GUI.create_button(addon_name, button_function, false))
            this.addons_widgets[addon_name].push(GUI.def_input_var(`${addon_name}_auto_run`, "boolean", null, false))
        };
        GUI.fill_grid(Object.entries(this.addons_widgets), this.frames["addons_buttons_grid"]);
        
        this.wisdom.update_listbox(x => x, x => x.get(), (key, val) => val.get() !== 0.0)
        for (const var_key of this.var_dict){
            if (this.var_dict[var_key].initial !== null) {
                this.var_dict[var_key].set(this.var_dict[var_key].initial);
            };
        };
        
        GUI.def_switch("pet_leveling", ["taming", "petxpboost", "beastmaster", "expsharepet", "expshareitem", "pets_levelled", "pet_profit", "falcon_attribute", "toucan_attribute", "used_pet_prices"], "None", true, false);
        GUI.def_switch("exp_share_diana", ["expsharepetslot2", "expsharepetslot3"], "Dianatrue", false, false);
        GUI.def_switch("NPC_Bazaar", ["item_sell_loc"], "Best (NPC/Bazaar)", false, true);
        GUI.def_switch("infernofuel", ["inferno_grade", "inferno_distillate", "inferno_eyedrops"], "Inferno Minion Fuel", false, false);
        GUI.def_switch("rising_celsius", ["rising_celsius_override"], "Inferno", false, false);
        GUI.def_switch("beacon", ["scorched", "B_constant", "B_acquired"], 0, true, false);
        GUI.def_switch("potato_accessory_switch", ["potato_accessory"], "Potatotrue", false, false);
        GUI.def_switch("bazaar_tax", ["bazaar_flipper"], true, false, true);
        GUI.def_switch("afking", ["afkpet", "afkpet_rarity", "afkpet_lvl", "enchanted_clock", "special_layout", "player_harvests", "player_looting"], true, false, false);
        GUI.def_switch("fuel_amount", ["fuelamount"], -1, true, false);
        GUI.def_switch("scaled_time_switch", ["scaled_time_amount", "scaled_time_unit", "scaled_time"], true, false, false);
        GUI.def_switch("free_will", ["freewillcost"], true, false, false);


        this.dependent_variables = {"afkpet_rarity": "afkpet", "afkpet_lvl": "afkpet", "player_harvests": "afk", "empty_time": "scale_time", "freewillcost": "free_will", "expshareitem": "expsharepet", "used_pet_prices": "levelingpet", "pet_profit": "levelingpet"}
        this.key_replace_bool = ["infusion", "free_will", "postcard"]

        this.outputOrder = ['fuel', "inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override",
                            'hopper', 'upgrade1', 'upgrade2', 'chest',
                            'beacon', 'scorched', 'B_constant', 'B_acquired',
                            'crystal', 'postcard', 'infusion', 'free_will', 'afk', 'afkpet', 'afkpet_rarity', 'afkpet_lvl', 'enchanted_clock', 'special_layout', 'potato_accessory', 'player_harvests', "player_looting",
                            'wisdom', 'mayor', 'levelingpet', 'taming', 'falcon_attribute', 'petxpboost', 'beastmaster', 'toucan_attribute', 'expshareitem', 'expsharepet', 'expsharepetslot2', 'expsharepetslot3',
                            'ID', 'setupcost', 'freewillcost', 'extracost', 'actiontime', 'fuelamount', 'sell_loc', 'bazaar_update_txt', 'bazaar_taxes', 'bazaar_flipper', 'notes',
                            'empty_time', 'scaled_time', 'harvests', 'used_storage', 'items', 'item_sell_loc',
                            'item_profit', 'itemtype_profit', 'xp', 'pet_profit', 'pets_levelled', 'used_pet_costs',
                            'fuelcost', 'total_profit', 'addons_output_container']


        this.fancyOrder = {
            "**Minion Upgrades**": {
                "\n> Internal: ": new Set(["fuel", "hopper", "upgrade1", "upgrade2"]),
                "\n> External: ": new Set(["chest", "beacon", "crystal", "postcard"]),
                "\n> Permanent: ": new Set(["infusion", "free_will"])
            },
            "Beacon Info": { "\n> ": ["scorched", "B_constant", "B_acquired"] },
            "Inferno Info": { "\n> ": ["inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override"] },
            "afk": { "\n> ": ["afkpet", "afkpet_rarity", "afkpet_lvl", "enchanted_clock", "special_layout", "potato_accessory"] },
            "playerHarvests": { "\n> ": ["player_looting"] },
            "wisdom": null,
            "mayor": null,
            "levelingpet": {
                "\n> ": ["taming", "falcon_attribute", "petxpboost", "beastmaster", "toucan_attribute", "expshareitem"],
                "\n> Exp Share Pets: ": new Set(["expsharepet", "expsharepetslot2", "expsharepetslot3"])
            },
            "used_pet_prices": null,
            "**Setup Information**": { "!\n> ": ["ID", "setupcost", "freewillcost", "extracost", "actiontime", "fuelamount"] },
            "Bazaar Info": { "\n> ": ["sell_loc", "bazaar_update_txt", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper"] },
            "notes": null,
            "empty_time": null,
            "**Outputs** for ": { "": new Set(["scaled_time"]) },
            "harvests": null,
            "used_storage": null,
            "items": null,
            "item_sell_loc": null,
            "item_profit": null,
            "itemtype_profit": null,
            "xp": null,
            "pet_profit": null,
            "pets_levelled": null,
            "fuelcost": null,
            "total_profit": null,
            "addons_output_container": null
        };

        this.ID_order = [
            "minion", "miniontier", "amount", "fuel",
            "hopper", "upgrade1", "upgrade2", "chest", "beacon", "scorched", "B_constant", "B_acquired",
            "infusion", "crystal", "free_will", "postcard",
            "inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override",
            "afk", "afkpet", "afkpet_rarity", "afkpet_lvl", "enchanted_clock", "special_layout",
            "player_harvests", "player_looting", "potato_accessory",
            "combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom",
            "mayor",
            "levelingpet", "taming", "falcon_attribute", "toucan_attribute", "petxpboost", "beastmaster",
            "expsharepet", "expsharepetslot2", "expsharepetslot3", "expshareitem",
            "sell_loc", "bazaar_sell_type", "bazaar_buy_type", "bazaar_taxes", "bazaar_flipper",
            "empty_time_amount", "empty_time_unit", "scale_time", "scaled_time_amount", "scaled_time_unit",
        ];

        this.API_timer = 0;
        this.bazaar_items = [];
        this.AH_items = [];
        this.recipe_items = [];
        this.init_prices();
        this.update_prices(false);
    };

    multiswitch(multi_ID, force=false) {
        if (multi_ID === "minion") {
            let minionType = this.minion.get();
            GUI.set_value("miniontier", Object.keys(md.minionList[minionType]["speed"]).slice(-1));
            GUI.toggle_switch("potato_accessory_switch", minionType + String(this.afk.get()));
            GUI.toggle_switch("rising_celsius", minionType);
        } else if (multi_ID === "tier") {
            let minionType = this.minion.get();
            let minionTier = this.miniontier.get();
            if (!(minionTier in md.minionList[minionType]["speed"])) {
                GUI.set_value("miniontier", Object.keys(md.minionList[minionType]["speed"]).slice(-1));
            };
        } else if (multi_ID === "fuel") {
            let control = this.fuel.get();
            GUI.toggle_switch("infernofuel", control);
            GUI.toggle_switch("fuel_amount", md.itemList[md.fuel_options[control]]["fuel_duration"]);
        } else if (multi_ID === "afk") {
            let afkState = this.afk.get();
            let minionType = this.minion.get();
            GUI.toggle_switch("afking", afkState);
            GUI.toggle_switch("potato_accessory_switch", minionType + String(afkState));
        } else if (multi_ID === "pet_leveling") {
            let mayor = this.mayor.get();
            let pet_leveling_state;
            if (force) {
                GUI.toggle_switch("pet_leveling");
                pet_leveling_state = GUI.switches["pet_leveling"]["state"]
                GUI.toggle_switch("exp_share_diana", mayor + String(pet_leveling_state));
            } else {
                let control = this.levelingpet.get();
                GUI.toggle_switch("pet_leveling", control);
                pet_leveling_state = GUI.switches["pet_leveling"]["state"]
                GUI.toggle_switch("exp_share_diana", mayor + String(pet_leveling_state));
            };
        } else if (multi_ID === "mayors") {
            let mayor = this.mayor.get();
            let pet_leveling_state = GUI.switches["pet_leveling"]["state"];
            GUI.toggle_switch("exp_share_diana", mayor + String(pet_leveling_state));
        };
        return;
    };

    load_template() {
        let templateName = this.template.get();
        if (templateName === "Choose Template") {
            return;
        };
        this.template.set("Choose Template")
        let template;
        if (templateName === "ID") {
            template = this.decodeID(this.load_ID.get());
        } else if (templateName === "Clean") {
            template = {};
            for (let var_key in this.ID_order) {
                if (!(["minion", "miniontier"].includes(var_key))) {
                    template[var_key] = this.var_dict[var_key].initial;
                };
            };
        } else {
            template = this.templateList[templateName];
        };
        for (let [setting, variable] of Object.entries(template)) {
            this.var_dict[setting].set(variable);
            if (this.var_dict[setting].command !== null) {
                this.var_dict[setting].command();
            };
            if (setting.includes("_wisdom")) {
                this.wisdom.update_listbox(x => x, x => x.get(), (key, val) => val.get() !== 0.0);
            };
        };
    };

    output_data(toTerminal=true) {
        this.get_output_switches();
        let crafted_string = `${this.variables["amount"]["var"]}x ${this.variables["minion"]["var"]} t${this.variables["miniontier"]["var"]}; `;
        let string_parts = {};
        for (let var_key of this.outputOrder) {
            if (var_key in this.dependent_variables) {
                if (["None", "0", "0.0", "", false].includes(this.variables[this.dependent_variables[var_key]]["var"])) {
                    continue;
                };
            } else if (["expsharepetslot2", "expsharepetslot3"].includes(var_key)) {
                if (this.variables["mayor"]["var"] !== "Diana") {
                    continue;
                };
            };
            if ("output_switch" in this.variables[var_key]) {
                if (this.variables[var_key]["output_switch"] === false) {
                    if (var_key === "notes" && this.variables["specialLayout"]["var"] === true && "Special Layout" in this.variables["notes"]["list"]) {
                        string_parts["notes"] = "Notes: Special Layout: " + this.variables['notes']['list']['Special Layout'];
                    } else {
                        continue;
                    };
                };
            };
            if (var_key === "wisdom") {
                let wisdoms = {};
                for (let [list_key, wisdom_val] of Object.entries(this.variables["wisdom"]["list"])) {
                    if (!(list_key in this.variables["xp"]["list"])) {
                        continue;
                    } else if (!(["None", 0, 0.0].includes(wisdom_val))) {
                        wisdoms[list_key] = wisdom_val;
                    };
                };
                if (Object.keys(wisdoms).length !== 0) {
                    string_parts["widsom"] = this.variables["wisdom"]["display"] + ": " + Array.from(Object.keys(wisdoms), wisdom_type => wisdom_type + ": " + wisdoms[wisdom_type]).join(", ");
                };
                continue;
            };
            if (var_key === "bazaar_update_txt") {
                string_parts["bazaar_update_txt"] = `Bazaar info: ${this.variables["bazaar_sell_type"]["var"]}, ${this.variables["bazaar_buy_type"]["var"]}, Last updated at ${this.variables["bazaar_update_txt"]["var"]}`
                continue;
            };
            if (var_key === "extracost") {
                if (this.variables["setupcost"]["output_switch"] === false) {
                    continue;
                };
            };
            
            let vtype = this.variables[var_key]["vtype"];
            let display = this.variables[var_key]["display"];
            if (vtype == "list") {
                if (GUI.get_length(this.variables[var_key]["list"]) === 0) {
                    continue;
                };
                let formatted_list = [];
                let formatting_function = x => x;
                if ("IDtoDisplay" in this.variables[var_key] && this.variables[var_key]["IDtoDisplay"] === true) {
                    formatting_function = x => md.itemList[x]['display'];
                } else if (var_key === "pets_levelled") {
                    formatting_function = x => this.variables[x]["var"];
                };
                for (let [list_key, list_val] of Object.entries(this.variables[var_key]["list"])) {
                    if (var_key === "pets_levelled" && formatting_function(list_key) === "None") {
                        continue;
                    };
                    if (typeof list_val === "number") {
                        formatted_list.push(formatting_function(list_key) + ": " + GUI.reduced_number(list_val));
                    } else {
                        formatted_list.push(formatting_function(list_key) + ": " + list_val);
                    };
                };
                string_parts[var_key] = display + ": " + formatted_list.join(", ");
                continue;
            };

            let dtype = this.variables[var_key]["dtype"];
            let val = this.variables[var_key]["var"];
            if (vtype === "input") {
                if (["None", 0, 0.0, false, ""].includes(val)) {
                    continue;
                };
                if (dtype === "number") {
                    string_parts[var_key] = `${display}: ${val}`;
                } else if (dtype === "boolean") {
                    val = `${val}`;
                    string_parts[var_key] = `${display}: ${{"true": "True", "false" : "False"}[val]}`;
                } else if (val === "Inferno Minion Fuel") {
                    string_parts[var_key] = `Inferno Minion Fuel (${this.variables["infernoGrade"]["var"]}, ${this.variables["infernoDistillate"]["var"]}, Capcaisin: ${{"true": "True", "false" : "False"}[`${this.variables["infernoEyedrops"]["var"]}`]})`;
                } else {
                    string_parts[var_key] = `${val}`;
                };
            } else {
                if (dtype === "number") {
                    string_parts[var_key] = `${display}: ${GUI.reduced_number(val)}`;
                } else {
                    string_parts[var_key] = `${display}: ${val}`;
                };
            };
        };
        crafted_string += Object.values(string_parts).join("; ");
        if (this.variables["output_to_clipboard"]["var"]) {
            try {
                navigator.clipboard.writeText(crafted_string);
            } catch(error) {
                if (error.name === "NotAllowedError") {
                    console.log("Not allowed to write to clipboard, outputting output here instead:");
                } else {
                    console.log("Unknown Error", error);
                };
                console.log(crafted_string);
                toTerminal = false;
            };
        };
        if (toTerminal) {
            console.log(crafted_string, "\n");
            return;
        } else {
            return crafted_string;
        };
    };

    prep_fancy_data(var_key, display=true, newline=false) {
        let force = false;
        let val;
        if (var_key in this.dependent_variables) {
            if (["None", "0", "0.0", "", false].includes(this.variables[this.dependent_variables[var_key]]["var"])) {
                return null;
            };
        } else if (["expsharepetslot2", "expsharepetslot3"].includes(var_key)) {
            if (this.variables["mayor"]["var"] !== "Diana") {
                return null;
            };
        };
        if ("output_switch" in this.variables[var_key]) {
            if (this.variables[var_key]["output_switch"] === false) {
                if (var_key === "notes" && this.variables["specialLayout"]["var"] === true && "Special Layout" in this.variables["notes"]["list"]) {
                    return "Notes:\n> Special Layout: `" + this.variables['notes']['list']['Special Layout'] + "`";
                } else {
                    return null;
                };
            } else {
                force = true;
            };
        };
        if (var_key === "wisdom") {
            let wisdoms = {};
            for (let [list_key, wisdom_val] of Object.entries(this.variables["wisdom"]["list"])) {
                if (!(list_key in this.variables["xp"]["list"])) {
                    continue;
                } else if (!(["None", 0, 0.0].includes(wisdom_val))) {
                    wisdoms[list_key] = wisdom_val;
                };
            };
            if (Object.keys(wisdoms).length !== 0) {
                return this.variables["wisdom"]["display"] + ":\n> " + Array.from(Object.keys(wisdoms), wisdom_type => wisdom_type + ": `" + wisdoms[wisdom_type] + "`").join(", ");
            };
            return null;
        } else if (var_key === "beacon") {
            val = {0: "", 1: "`Beacon I`", 2: "`Beacon II`", 3: "`Beacon III`", 4: "`Beacon IV`", 5: "`Beacon V`"}[this.variables[var_key]["var"]];
        } else if (var_key === "used_storage") {
            val = "`" + this.variables[var_key]['var'] + "` (out of `" + this.variables['available_storage']['var'] + "`)";
        } else if (var_key === "chest") {
            if (this.variables[var_key]["var"] === "None") {
                val = "";
            } else {
                val = "`" + this.variables[var_key]['var'] + " Storage`";
            };
        } else if (this.key_replace_bool.includes(var_key)) {
            if (this.variables[var_key]["var"] === true) {
                val = "`" + this.variables[var_key]['display'] + "`";
            } else {
                return null;
            };
        } else if (var_key === "extracost") {  // special case: setup cost is turned off
            if (this.variables["setupcost"]["output_switch"] === false) {
                return null;
            } else {
                val = "`" + `${this.variables[var_key]['var']}` + "`";
            };
        } else if (var_key === "ID") {
            val = `||${this.variables[var_key]['var']}||`.replace("\\", "\\\\")
        } else if (this.variables[var_key]["vtype"] == "list") {
            if (GUI.get_length(this.variables[var_key]["list"]) === 0) {
                return null;
            };
            let formatted_list = [];
            let formatting_function = x => x;
            if ("IDtoDisplay" in this.variables[var_key] && this.variables[var_key]["IDtoDisplay"] === true) {
                formatting_function = x => md.itemList[x]['display'];
            } else if (var_key === "pets_levelled") {
                formatting_function = x => this.variables[x]["var"];
            };
            for (let [list_key, list_val] of Object.entries(this.variables[var_key]["list"])) {
                if (var_key === "pets_levelled" && formatting_function(list_key) === "None") {
                    continue;
                };
                if (typeof list_val === "number") {
                    formatted_list.push(formatting_function(list_key) + ": `" + GUI.reduced_number(list_val) + "`");
                } else {
                    formatted_list.push(formatting_function(list_key) + ": `" + list_val + "`");
                };
            };
            val = "\n> " + formatted_list.join(", ");
        } else if (this.variables[var_key]["dtype"] === "number") {
            val = "`" + GUI.reduced_number(this.variables[var_key]['var']) + "`";
        } else if (this.variables[var_key]["dtype"] === "boolean") {
            val = "`" + {"true": "True", "false": "False"}[`${this.variables[var_key]['var']}`] + "`";
        } else {
            val = "`" + this.variables[var_key]['var'] + "`";
        };
        if (["`None`", "`0`", "`0.0`", "", "``", "`False`"].includes(val) && force === false) {
            return null;
        };
        if (var_key === "freewillcost") {
            val += ` (optimal: apply on t${this.variables['optimal_tier_free_will']['var']})`
        };
        let return_str = ""
        if (display) {
            if ("fancy_display" in this.variables[var_key]) {
                return_str += `${this.variables[var_key]['fancy_display']}: `;
            } else {
                return_str += `${this.variables[var_key]['display']}: `;
            };
        };
        return_str += `${val}`;
        if (newline) {
            return_str += "\n";
        };
        return return_str;
    };
    
    fancyOutput(toTerminal=true) {
        this.get_output_switches()
        let crafted_string = `${this.variables["amount"]["var"]}x **${this.variables["minion"]["var"]} t${this.variables["miniontier"]["var"]}**`;
        for (let key in this.fancyOrder) {
            let line_str = "";
            let header = "";
            let force_line = false;
            let joined_keys;
            if (key in this.variables) {
                header = this.prep_fancy_data(key);
                force_line = true;
            } else {
                header = key;
            };
            if (header === null) {
                continue;
            };
            if (header === "Beacon Info" && this.variables["beacon"]["var"] === 0) {
                continue;
            };
            if (header === "Fuel Info" && this.variables["fuel"]["var"] !== "Inferno Minion Fuel") {
                continue;
            };
            if (header === "Bazaar Info" && this.variables["bazaar_update_txt"]["output_switch"] === false) {
                continue;
            };
            if (this.fancyOrder[key] instanceof Object) {
                for (let [sub_key, key_arr] of Object.entries(this.fancyOrder[key])) {
                    if (sub_key.includes("!")) {
                        sub_key = sub_key.substring(1);
                        if ((joined_keys = Array.from(key_arr, var_key => this.prep_fancy_data(var_key)).filter(x => x !== null).join(sub_key)) !== "") {
                            line_str += sub_key + joined_keys;
                        };
                    } else if (key_arr instanceof Array) {
                        if ((joined_keys = Array.from(key_arr, var_key => this.prep_fancy_data(var_key)).filter(x => x !== null).join(", ")) !== "") {
                            line_str += sub_key + joined_keys;
                        };
                    } else if (key_arr instanceof Set) {
                        if ((joined_keys = Array.from(key_arr, var_key => this.prep_fancy_data(var_key, false)).filter(x => x !== null).join(", ")) !== "") {
                            line_str += sub_key + joined_keys;
                        };
                    };
                };
            };
            if (line_str !== "" || force_line === true) {
                crafted_string += "\n" + header + line_str;
            };
        };
        if (this.variables["output_to_clipboard"]["var"]) {
            try {
                navigator.clipboard.writeText(crafted_string);
            } catch(error) {
                if (error.name === "NotAllowedError") {
                    console.log("Not allowed to write to clipboard, outputting output here instead:");
                } else {
                    console.log("Unknown Error", error);
                };
                console.log(crafted_string);
                toTerminal = false
            };
        };
        if (toTerminal) {
            console.log(crafted_string, "\n")
            return;
        } else {
            return crafted_string;
        };
    };

    constructID() {
        let ID = String(this.version) + "!";
        for (let [key, var_data] of Object.entries(this.variables)) {
            if (var_data["vtype"] !== "input") {
                continue;
            };
            let val = var_data["var"];
            if (var_data["options"].length === 0) {
                if (parseInt(val) === val) {
                    val = parseInt(val);
                };
                ID += "!" + String(val) + "!";
            } else {
                let index = var_data["options"].indexOf(val);
                ID += String.fromCharCode(48 + index);
            };
        };
        return ID;
    };

    decodeID(ID) {
        if (!(ID instanceof String)) {
            ID = String(ID);
        };
        let template = {};
        let end_ver = ID.indexOf("!");
        let ID_version;
        let end_val;
        if (end_ver === -1) {
            console.log("WARNING: Invalid ID, could not find version number");
            return template;
        };
        try {
            ID_version = Number(ID.slice(0, end_ver));
        } catch(Exception) {
            console.log("WARNING: Invalid ID, could not find version number");
            return template;
        };
        let ID_index = end_ver + 1;
        if (ID_version !== this.version) {
            console.log("WARNING: Invalid ID, Incompatible version");
            return template;
        };
        try {
            for (let [key, var_data] of Object.entries(this.variables)) {
                if (var_data["vtype"] !== "input") {
                    continue;
                };
                if (var_data["options"].length === 0) {
                    if (ID[ID_index] !== "!") {
                        console.log(`WARNING: did not find ${key}`);
                        return {};
                    };
                    end_val = ID.indexOf("!", ID_index + 1);
                    template[key] = {"string": String, "number": Number, "boolean": Boolean}[var_data["dtype"]](ID.slice(ID_index + 1, end_val));
                    ID_index = end_val + 1;
                } else {
                    template[key] = var_data["options"][ID.charCodeAt(ID_index) - 48];
                    ID_index += 1;
                };
            };
        } catch(error) {
            console.log("WARNING: Invalid ID, ID incomplete");
            return {};
        };
        return template;
    };

    getPrice(ID, action="buy", location="bazaar", force=false) {
        let multiplier = 1;
        if (location === "bazaar") {
            if (action === "buy") {
                location = md.bazaar_buy_types[this.variables["bazaar_buy_type"]["var"]];
            } else if (action === "sell") {
                location = md.bazaar_sell_types[this.variables["bazaar_sell_type"]["var"]];
                if (this.variables["bazaar_taxes"]["var"]) {
                    let bazaar_tax = 0.0125 - 0.00125 * this.variables["bazaar_flipper"]["var"];
                    if (this.variables["mayor"]["var"] === "Derpy") {
                        bazaar_tax *= 4;
                    };
                    if (this.variables["mayor"]["var"] === "Aura") {
                        bazaar_tax *= 2;
                    };
                    multiplier = 1 - bazaar_tax;
                };
            };
        } else if (location === "npc" && action === "buy") {
            multiplier = 2;
        };
        if (ID in md.itemList) {
            if (location in md.itemList[ID]["prices"]) {
                return multiplier * md.itemList[ID]["prices"][location];
            } else if (force) {
                console.log("WARNING:", ID, "no forced cost found");
                return 0;
            } else if ("custom" in md.itemList[ID]["prices"]) {
                return md.itemList[ID]["prices"]["custom"];
            } else if ("npc" in md.itemList[ID]["prices"]) {
                return multiplier * md.itemList[ID]["prices"]["npc"];
            } else {
                console.log("WARNING:", ID, "no cost found");
                return 0;
            };
        } else {
            console.log("WARNING:", ID, "not in itemList");
            return 0;
        };
    };

    getPetXPBoosts(pet, xp_type, exp_share=false) {
        let non_matching = 1
        if (md.all_pets[pet]["type"] !== "all" && md.all_pets[pet]["type"] !== xp_type) {
            if (["alchemy", "enchanting"].includes(xp_type)) {
                non_matching = 1 / 12;
            } else {
                non_matching = 1 / 3;
            };
        };
        if (exp_share) {
            return non_matching;
        };
        let petxpbonus = (1 + this.variables["taming"]["var"] / 100) * (1 + this.variables["beastmaster"]["var"] / 100) * non_matching;
        let pet_item;
        if ([xp_type, "all"].includes(md.pet_xp_boosts[this.variables["petxpboost"]["var"]][0])) {
            pet_item = 1 + md.pet_xp_boosts[this.variables["petxpboost"]["var"]][1] / 100;
        } else {
            pet_item = 1;
        };
        if (this.variables["mayor"]["var"] === "Diana") {
            petxpbonus *= 1.35;
        };
        if (["mining", "fishing"].includes(xp_type)) {
            petxpbonus *= 1.5;
        };
        if (pet === "Reindeer") {
            petxpbonus *= 2;
        };
        if (xp_type === "combat" && this.variables["falcon_attribute"]["var"] !== 0) {
            petxpbonus *= (1 + this.variables["falcon_attribute"]["var"] / 100);
        };
        return [petxpbonus, pet_item];
    };

    dragon_xp(gained_xp, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item) {
        const drag_lvl_100 = 25353230;
        const drag_lvl_200 = 210255385;
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
    
    get_inputs() {
        for (const [var_key, var_data] of Object.entries(this.variables)) {
            if (var_data["vtype"] === "input" && !("noWidget" in var_data)) {
                var_data["var"] = GUI.get_value(var_key);
            };
        };
        return 0;
    };
    
    async calculate(inGUI=false) {
        if (inGUI === true) {
            this.statusC.style.background = "yellow";
            this.get_inputs();

            // auto update bazaar
            if (this.variables["bazaar_auto_update"]["var"]) {
                await this.update_bazaar(false);
            };
        };


        // clear list outputs from previous calculation
        for (let [var_key, var_data] of Object.entries(this.variables)) {
            if (var_data["vtype"] === "list"){
                if (var_key === "wisdom") {
                    continue;
                };
                GUI.clear_object(var_data["list"]);
            };
        };

        // extracting often used minion constants
        let minion_type = this.variables["minion"]["var"];
        let minion_tier = this.variables["miniontier"]["var"];
        let minion_amount = this.variables["amount"]["var"];
        let minion_fuel = md.fuel_options[this.variables["fuel"]["var"]];
        let minion_beacon = this.variables["beacon"]["var"];
        let mayor = this.variables["mayor"]["var"];

        // Enchanted Clock uses offline calculations, but you can be on the island when using it to apply boosts that require a loaded island.
        // This clock_override replaces afk_toggle for these boosts
        let afk_toggle = this.variables["afk"]["var"];
        let clock_toggle = this.variables["enchanted_clock"]["var"];
        let clock_override = false;
        if (clock_toggle && afk_toggle) {
            afk_toggle = false;
            clock_override = true;
        };

        // list upgrades types
        let upgrades = [md.upgrade_options[this.variables["upgrade1"]["var"]], md.upgrade_options[this.variables["upgrade2"]["var"]]];
        let upgrades_types = [];
        for (let upgrade of upgrades) {
            for (let temp_type of md.itemList[upgrade]["upgrade"]["special"]["type"].split(", ")) {
                upgrades_types.push(temp_type);
            };
        };


        // adding up minion speed bonus
        // uses the fact that booleans can be seen as 0 or 1 or false and true resp.
        let speedBonus = 0;
        speedBonus += md.itemList[minion_fuel]["upgrade"]["speed"];
        speedBonus += md.itemList[upgrades[0]]["upgrade"]["speed"] + md.itemList[upgrades[1]]["upgrade"]["speed"];
        speedBonus += 2 * minion_beacon + 10 * this.variables["infusion"]["var"];
        speedBonus += 10 * this.variables["free_will"]["var"] + 5 * this.variables["postcard"]["var"];
        speedBonus += 5 * this.variables["potatoTalisman"]["var"] * (afk_toggle || clock_override) * (minion_type === "Potato");
        if (this.variables["crystal"]["var"] !== "None") {
            if (Object.values(md.floating_crystals[this.variables["crystal"]["var"]])[0].includes(minion_type)) {
                speedBonus += Number(Object.keys(md.floating_crystals[this.variables["crystal"]["var"]])[0]);
            };
        };
        if (minion_beacon !== 0) {
            speedBonus += 1 * this.variables["scorched"]["var"];
        };
        if (minion_type === "Inferno") {
            if (this.rising_celsius_override) {
                speedBonus += 180;
            } else {
                speedBonus += 18 * Math.min(10, minion_amount);
            };
        };
        if (mayor === "Cole" && (afk_toggle || clock_override) && md.affected_by_cole.includes(minion_type)) {
            speedBonus += 25;
        };
        // if (mayor === "Aura" && minion_type === "Potato") {
        //     speedBonus += 33;
        // };
        let afkpet = this.variables["afkpet"]["var"];
        let afkpet_rarity = this.variables["afkpetrarity"]["var"];
        let afkpet_lvl = this.variables["afkpetlvl"]["var"];
        if ((afk_toggle || clock_override) && md.boost_pets[afkpet]["affects"].includes(minion_type) && afkpet_rarity in md.boost_pets[afkpet]) {
            speedBonus += md.boost_pets[afkpet][afkpet_rarity][0] + afkpet_lvl * md.boost_pets[afkpet][afkpet_rarity][1];
        };

        // multiply up minion drop bonus
        let dropMultiplier = 1;
        dropMultiplier *= md.itemList[minion_fuel]["upgrade"]["drop"];
        dropMultiplier *= md.itemList[upgrades[0]]["upgrade"]["drop"];
        if (afk_toggle && (dropMultiplier > 1)) {
            // drop multiplier greater than 1 is rounded down while online
            dropMultiplier = Math.floor(dropMultiplier);
        };
        dropMultiplier *= md.itemList[upgrades[1]]["upgrade"]["drop"];
        if (afk_toggle && (dropMultiplier > 1)) {
            dropMultiplier = Math.floor(dropMultiplier);
        };
        if (mayor === "Derpy") {
            dropMultiplier *= 2;
        };

        // AFKing, Special Layouts and Player Harvests influences
        let actionsPerHarvest = 2;
        if (minion_type === "Fishing") {
            // only has harvests actions
            actionsPerHarvest = 1;
        };
        if (afk_toggle) {
            if (["Pumpkin", "Melon"].includes(minion_type)) {
                // pumpkins and melons are forced to regrow for minion to harvest
                actionsPerHarvest = 1;
            };
            if (this.variables["playerHarvests"]["var"]) {
                if (["Fishing", "Pumpkin", "Melon"].includes(minion_type)) {
                    this.variables["notes"]["list"]["Player Harvests"] = "Player Harvesting does not work with this minion";
                } else {
                    actionsPerHarvest = 1;
                    dropMultiplier = 1;
                    if (minion_type === "Gravel") {
                        upgrades.push("FLINT_SHOVEL");
                        this.variables["notes"]["list"]["Player Tools"] = "Assuming Player is using Flint Shovel";
                    };
                    if (minion_type === "Ice") {
                        this.variables["notes"]["list"]["Player Tools"] = "Assuming Player is using Silk Touch";
                    };
                    if (["Zombie", "Revenant", "Voidling", "Inferno", "Vampire", "Skeleton", "Creeper", "Spider", "Tarantula", "Cave Spider", "Blaze", "Magma Cube", "Enderman", "Ghast", "Slime", "Cow", "Pig", "Chicken", "Sheep", "Rabbit"].includes(minion_type)) {
                        dropMultiplier *= 1 + 15 * this.variables["playerLooting"]["var"] / 100;
                    };
                };
            } else if (this.variables["specialLayout"]["var"]) {
                if (["Cobblestone", "Mycelium", "Ice"].includes(minion_type)) {
                    // cobblestone generator, regrowing mycelium, freezing water
                    actionsPerHarvest = 1;
                };
                if (["Flower", "Sand", "Red Sand", "Gravel"].includes(minion_type)) {
                    // harvests through natural means: water flushing, gravity
                    actionsPerHarvest = 1;
                    // speedBonus -= 10  // only spawning has 10% action speed reduction, not confirmed yet.
                };
            };
        };

        // AFK loot table changes
        if (['Oak', 'Spruce', 'Birch', 'Dark Oak', 'Acacia', 'Jungle'].includes(minion_type)) {
            if (afk_toggle) {
                // chopped trees have 4 blocks of wood, unknown why offline gives 3
                md.minionList[minion_type]["drops"][md.getID[`${minion_type} Log`]] = 4;
            } else {
                md.minionList[minion_type]["drops"][md.getID[`${minion_type} Log`]] = 3;
            };
        };
        if (minion_type == "Gravel") {
            if (afk_toggle) {
                // vanilla minecraft chance for gravel to become flint
                md.minionList[minion_type]["drops"]["GRAVEL"] = 0.9;
                md.minionList[minion_type]["drops"]["FLINT"] = 0.1;
            } else {
                md.minionList[minion_type]["drops"]["GRAVEL"] = 1;
                md.minionList[minion_type]["drops"]["FLINT"] = 0;
            };
        };
        if (minion_type == "Pumpkin") {
            if (afk_toggle) {
                // it just does this, idk, ask Hypixel
                md.minionList[minion_type]["drops"]["PUMPKIN"] = 1;
            } else {
                md.minionList[minion_type]["drops"]["PUMPKIN"] = 3;
            };
        };
        if (minion_type == "Sheep") {
            if (upgrades.includes("ENCHANTED_SHEARS")) {
                md.minionList[minion_type]["drops"]["WOOL"] = 0;
            } else {
                md.minionList[minion_type]["drops"]["WOOL"] = 1;
            };
        };
        if (minion_type == "Flower") {
            if (minion_fuel === "THORNY_VINES") {
                md.minionList[minion_type]["drops"] = { "WILD_ROSE": 2 };
            } else if (afk_toggle && this.variables["specialLayout"]["var"]) {
                // tall flowers blocked by low ceiling
                md.minionList[minion_type]["drops"] = { "YELLOW_FLOWER": 0.35, "RED_ROSE": 0.15, "SMALL_FLOWER": 0.5 };
            } else {
                md.minionList[minion_type]["drops"] = { "YELLOW_FLOWER": 0.35, "RED_ROSE": 0.15, "SMALL_FLOWER": 4 / 11, "LARGE_FLOWER": 3 / 22 };
            };
        };
        if (minion_type === "Sunflower") {
            if (minion_fuel === "DAYSWITCH") {
                md.minionList[minion_type]["drops"] = { "DOUBLE_PLANT": 2 };
            } else if (minion_fuel === "NIGHTSWITCH") {
                md.minionList[minion_type]["drops"] = { "MOONFLOWER": 2 };
            } else {
                md.minionList[minion_type]["drops"] = { "DOUBLE_PLANT": 1, "MOONFLOWER": 1 };
            };
        };

        // calculate final minion speed
        let base_speed = md.minionList[minion_type]["speed"][minion_tier];
        let secondsPaction = base_speed / (1 + speedBonus / 100);
        if (minion_fuel == "INFERNO_FUEL") {
            secondsPaction /= 1 + md.infernofuel_data["grades"][md.getID[this.variables["infernoGrade"]["var"]]];
        };

        // time calculations
        let emptytimeNumber;
        let timeratio;
        let emptytimeamount = GUI.get_value("emptytimeamount");
        let emptytimelength = GUI.get_value("emptytimelength");
        let totaltimelength = GUI.get_value("totaltimelength");
        let totaltimeamount = GUI.get_value("totaltimeamount");
        if (this.variables["often_empty"]["var"]) {
            emptytimeNumber = this.time_number(emptytimelength, emptytimeamount, secondsPaction, actionsPerHarvest);
            let timeNumber = this.time_number(totaltimelength, totaltimeamount, secondsPaction, actionsPerHarvest);
            timeratio = timeNumber / emptytimeNumber;
            this.variables["emptytime"]["var"] = (`${emptytimeamount} ${emptytimelength}`);
        } else {
            emptytimeNumber = this.time_number(totaltimelength, totaltimeamount, secondsPaction, actionsPerHarvest);
            timeratio = 1;
        };
        this.variables["time"]["var"] = `${totaltimeamount} ${totaltimelength}`;
        let harvestsPerTime;
        if (emptytimelength == "Harvests") {
            harvestsPerTime = emptytimeamount;
        } else {
            harvestsPerTime = emptytimeNumber / (actionsPerHarvest * secondsPaction);
        };
        this.variables["actiontime"]["var"] = secondsPaction;
        this.variables["harvests"]["var"] = minion_amount * harvestsPerTime * timeratio;

        // drop multiplier online/offline mode
        if (!(afk_toggle)) {
            harvestsPerTime *= dropMultiplier;
            dropMultiplier = 1;
        };

        // base drops
        for (const [item, amount] of Object.entries(md.minionList[minion_type]["drops"])) {
            this.variables["items"]["list"][item] = harvestsPerTime * amount * dropMultiplier;
        };

        // upgrade drops
        // create seperate dict to keep it separate from the main drops
        // because some upgrades use main drops to generate something
        let upgrade_drops = {};
        let spreading_drops = {};
        let cooldown_drops = {};
        for (let upgrade of upgrades) {
            let upgrade_type = md.itemList[upgrade]["upgrade"]["special"]["type"];
            if (upgrade_type.includes("replace")) {
                // replacing upgrades are like Auto Smelters
                for (const item of Object.keys(this.variables["items"]["list"])) {
                    if (item in md.itemList[upgrade]["upgrade"]["special"]["list"]) {
                        let replacement_item = md.itemList[upgrade]["upgrade"]["special"]["list"][item];
                        if (!(replacement_item in this.variables["items"]["list"])) {
                            this.variables["items"]["list"][replacement_item] = 0;
                        };
                        this.variables["items"]["list"][replacement_item] += this.variables["items"]["list"][item];
                        this.variables["items"]["list"][item] = 0;
                        delete this.variables["items"]["list"][item];
                    };
                };
            };
            if (upgrade_type === "generate") {
                // generating upgrades are like Diamond Spreadings
                let finalAmount = 0;
                let spreading_chance = md.itemList[upgrade]["upgrade"]["special"]["chance"];
                for (const amount of Object.values(this.variables["items"]["list"])) {
                    finalAmount += spreading_chance * amount;
                };
                if (minion_fuel === "INFERNO_FUEL" && afk_toggle) {
                    finalAmount /= 5;
                };
                for (const [item, amount] of Object.entries(md.itemList[upgrade]["upgrade"]["special"]["item"])) {
                    if (!(item in spreading_drops)) {
                        spreading_drops[item] = 0;
                    };
                    spreading_drops[item] += finalAmount * amount;
                };
            } else if (upgrade_type === "add") {
                // adding upgrades are like Corrupt Soils
                for (const [item, amount] of Object.entries(md.itemList[upgrade]["upgrade"]["special"]["item"])) {
                    if (!(item in upgrade_drops)) {
                        upgrade_drops[item] = 0;
                    };
                    upgrade_drops[item] += harvestsPerTime * amount;
                };
            } else if (upgrade_type === "timer") {
                // timer upgrades are like Soulflow Engines
                // formula for effective_cooldown still in research
                // if afk_toggle:
                //     effective_cooldown = 2 * secondsPaction * (1 + np.floor(np.ceil(md.itemList[upgrade]["upgrade"]["special"]["cooldown"] / secondsPaction) / 2))
                // else:
                //     effective_cooldown = ???
                if (afk_toggle && upgrade == "LESSER_SOULFLOW_ENGINE" && upgrades.includes("SOULFLOW_ENGINE")) {
                    continue;  // Soulflow Engine overrides Lesser Soulflow Engine while online
                };
                let effective_cooldown = md.itemList[upgrade]["upgrade"]["special"]["cooldown"];
                for (const [item, amount] of Object.entries(md.itemList[upgrade]["upgrade"]["special"]["item"])) {
                    if (!(item in cooldown_drops)) {
                        cooldown_drops[item] = 0;
                    }
                    cooldown_drops[item] += amount * emptytimeNumber / effective_cooldown;
                };
            };
        };

        // other upgrades behaviours
        if (afk_toggle) {
            if (upgrades.includes("CORRUPT_SOIL")) {
                if ("afkcorrupt" in md.minionList[minion_type]) {
                    // Certain mob minions get more corrupt drops when afking
                    // It is not a constant multiplier, it is equivalent in chance to the main drops of the minion
                    upgrade_drops["SULPHUR_ORE"] *= md.minionList[minion_type]["afkcorrupt"];
                    upgrade_drops["CORRUPTED_FRAGMENT"] *= md.minionList[minion_type]["afkcorrupt"];
                };
                if (minion_type === "Chicken" && !(upgrades.includes("ENCHANTED_EGG"))) {
                    // Online Chicken minion without Enchanted Egg does not make corrupt drops
                    upgrade_drops["SULPHUR_ORE"] = 0;
                    upgrade_drops["CORRUPTED_FRAGMENT"] = 0;
                };
            };
            if (upgrades.includes("ENCHANTED_EGG")) {
                // Enchanted Eggs make one laid egg and one egg on kill while AFKing
                // the egg on spawn is affected by drop multipliers
                upgrade_drops["EGG"] *= 1 + dropMultiplier;
            };
        };
        if (upgrades.includes("SOULFLOW_ENGINE") && minion_type === "Voidling") {
            cooldown_drops["RAW_SOULFLOW"] *= 1 + 0.03 * minion_tier;  // correct most likely, needs testing
        };

        // spreading upgrades triggering from some upgrade drops
        for (let upgrade of upgrades) {
            let upgrade_type = md.itemList[upgrade]["upgrade"]["special"]["type"];
            if (upgrade_type !== "generate") {
                continue;
            } else {
                let spreading_chance = md.itemList[upgrade]["upgrade"]["special"]["chance"];
                if (afk_toggle) {
                    if (upgrades.includes("ENCHANTED_EGG")) {
                        // the egg on spawn triggers spreadings
                        for (const [item, amount] of Object.entries(md.itemList[upgrade]["upgrade"]["special"]["item"])) {
                            if (!(item in spreading_drops)) {
                                spreading_drops[item] = 0;
                            };
                            spreading_drops[item] += harvestsPerTime * dropMultiplier * spreading_chance * amount;
                        };
                    };
                } else {
                    let finalAmount = 0;
                    for (const amount of Object.values(upgrade_drops)) {
                        finalAmount += spreading_chance * amount;
                    }
                    for (const [item, amount] of Object.entries(md.itemList[upgrade]["upgrade"]["special"]["item"])) {
                        if (!(item in spreading_drops)) {
                                spreading_drops[item] = 0;
                            };
                        spreading_drops[item] += finalAmount * amount;
                    };
                };
            };
        };

        // Inferno minion fuel drops
        // https://wiki.hypixel.net/Inferno_Minion_Fuel
        if (minion_fuel === "INFERNO_FUEL") {
            // distilate drops
            let distilate = md.getID[this.variables["infernoDistillate"]["var"]]
            let distilate_item = md.infernofuel_data["distilates"][distilate][0]
            let amount_per = md.infernofuel_data["distilates"][distilate][1]
            let distillate_harvests = (harvestsPerTime * 4) / 5
            upgrade_drops[distilate_item] = distillate_harvests * amount_per
            for (const item of Object.keys(this.variables["items"]["list"])) {  // replacing main drops with distilate drops
                this.variables["items"]["list"][item] /= 5;
            };

            // Hypergolic drops
            if (this.variables["infernoGrade"]["var"] === "Hypergolic Gabagool") {  // hypergolic fuel stuff
                let multiplier = 1;
                if (this.variables["infernoEyedrops"]["var"] === true) {  // Capsaicin Eyedrops
                    multiplier = 1.3;
                };
                for (let [item, chance] of Object.entries(md.infernofuel_data["drops"])) {
                    upgrade_drops[item] = 0;
                    if (item === "INFERNO_APEX" && minion_tier >= 10) {  // Apex Minion perk
                        chance *= 2;
                    };
                    upgrade_drops[item] += multiplier * chance * harvestsPerTime;
                };
                upgrade_drops["HYPERGOLIC_IONIZED_CERAMICS"] = emptytimeNumber / md.itemList[minion_fuel]["upgrade"]["duration"];
            };

            // calculate fuel cost
            let infernofuel_components = {
                "INFERNO_FUEL_BLOCK": 2,  // 2 inferno fuel blocks
                "CAPSAICIN_EYEDROPS_NO_CHARGES": Number(this.variables["infernoEyedrops"]["var"])  // capsaicin eyedrops
            };
            infernofuel_components[distilate] = 6;  // 6 times distilate item
            infernofuel_components[md.getID[this.variables["infernoGrade"]["var"]]] = 1;  // 1 gabagool core
            let costPerInfernofuel = 0;
            for (const [component_ID, amount] of Object.entries(infernofuel_components)) {
                costPerInfernofuel += amount * this.getPrice(component_ID, "buy", "bazaar");
            };
            md.itemList["INFERNO_FUEL"]["prices"]["custom"] = costPerInfernofuel;
            // the fuel cost is put into the item data to be used later in the general fuel cost calculator
        };

        // add upgrade drops to main item list
        for (const [item, amount] of Object.entries({...upgrade_drops, ...spreading_drops, ...cooldown_drops})) {
            if (!(item in this.variables["items"]["list"])) {
                this.variables["items"]["list"][item] = 0;
            };
            this.variables["items"]["list"][item] += amount;
        };

        // (Super) Compactor logic at the end because it applies to all drops
        // for both compactor types it floors the ratio between items and needed items for one compacted
        // multiplies the floored ratio if the action creates multiple compacted item
        // uses modulo to find the left over amount
        // keeps track of which items have been compacted to check for loss of profit
        // saves per item the following dict
        // {"from": item, "makes": compact item, "amount": amount of compacted, "per": amount of item needed}
        let compacted_items = [];
        // Compactors
        // loops once through item list because there are no double normal compacted items
        if (upgrades_types.includes("compact")) {
            for (const [item, amount] of Object.entries(this.variables["items"]["list"])) {
                if (item in md.compactorList) {
                    let compact_name = md.compactorList[item]["makes"];
                    let percompact = md.compactorList[item]["per"];
                    let compact_amount = Math.floor(amount / percompact);
                    if (compact_amount === 0) {
                        continue;
                    };
                    if ("amount" in md.compactorList[item]) {
                        compact_amount *= md.compactorList[item]["amount"];
                    };
                    let left_over = amount % percompact;
                    if (left_over === 0) {  // floating point error may cause extremely small numbers that should have been 0 too not trigger this
                        delete this.variables["items"]["list"][item];
                    } else {
                        this.variables["items"]["list"][item] = left_over;
                    };
                    this.variables["items"]["list"][compact_name] = compact_amount;
                    compacted_items.push({"from": item, ...md.compactorList[item]});
                };
            };
        };

        // Super compactor
        // loops continously through the item list until is cannot find something to compact
        if (upgrades_types.includes("enchant")) {
            let found_enchantable = true
            let safety_lock = 0;
            while (found_enchantable === true) {
                safety_lock += 1;
                if (safety_lock >= 10) {  // safety to prevent an infinite while loop
                    console.log("While-loop overflow, super compactor 3000");
                    break;
                };
                found_enchantable = false;
                // static_items = list(this.variables["items"]["list"].items())
                for (const [item, amount] of Object.entries(this.variables["items"]["list"])) {
                    if (item in md.enchanterList) {
                        let enchanted_name = md.enchanterList[item]["makes"];
                        let perenchanted = md.enchanterList[item]["per"];
                        let enchanted_amount = Math.floor(amount / perenchanted);
                        if (enchanted_amount === 0) {
                            continue;
                        };
                        if ("amount" in md.enchanterList[item]) {
                            enchanted_amount *= md.enchanterList[item]["amount"];
                        };
                        let left_over = amount % perenchanted;
                        if (left_over == 0.0) {
                            delete this.variables["items"]["list"][item];
                        } else {
                            this.variables["items"]["list"][item] = left_over;
                        };
                        this.variables["items"]["list"][enchanted_name] = enchanted_amount;
                        compacted_items.push({"from": item, ...md.enchanterList[item]});
                        if (enchanted_name in md.enchanterList) {
                            found_enchantable = true;
                        };
                    };
                };
            };
        };

        // storage calculations
        // amount of storage measured in slots
        let available_storage = md.minion_chests[this.variables["chest"]["var"]];
        if ("storage" in md.minionList[minion_type] && minion_tier in md.minionList[minion_type]["storage"]) {
            available_storage += md.minionList[minion_type]["storage"][minion_tier];
        } else {
            available_storage += md.standard_storage[minion_tier];
        };

        // WARNING: calculation for fill_time does not work with compactors and is not accurate for setup with multiple drops
        // used_storage_slots calculations work fine.
        let used_storage = 0;
        let used_storage_slots = 0;
        for (const [itemtype, amount] of Object.entries(this.variables["items"]["list"])) {
            used_storage += amount / 64;  // hypixel does not care about smaller max stack sizes
            used_storage_slots += Math.ceil(amount / 64);
        };
        let fill_time = (emptytimeNumber * available_storage) / used_storage;
        // this.variables["filltime"]["var"] = fill_time;
        this.variables["used_storage"]["var"] = used_storage_slots;
        this.variables["available_storage"]["var"] = available_storage;
        
        // multiply drops by minion amount
        // all processes as calculated above should be linear with minion amount
        for (const itemtype of Object.keys(this.variables["items"]["list"])) {
            this.variables["items"]["list"][itemtype] *= minion_amount;
        };

        // convert items into coins and xp
        // while keeping track where items get sold
        // it makes a list of all prices and takes the one that matches the choice of sellLoc
        let minion_hopper = this.variables["hopper"]["var"];
        let minion_sellLoc = this.variables["sellLoc"]["var"];
        let coinsPerTime = 0.0;
        let sellto = "NPC";
        let hopper_multiplier = 1;
        if (minion_sellLoc === "Bazaar") {
            sellto = "bazaar";
        } else if (minion_sellLoc === "Best (NPC/Bazaar)") {
            sellto = "best";
        } else if (minion_sellLoc === "Hopper") {
            hopper_multiplier = md.hopper_data[minion_hopper];
        };
        let prices = {};
        // Coins
        if (minion_sellLoc !== "None") {
            for (const [itemtype, amount] of Object.entries(this.variables["items"]["list"])) {
                GUI.clear_object(prices);
                prices["bazaar"] = this.getPrice(itemtype, "sell", "bazaar");
                prices["NPC"] = this.getPrice(itemtype, "sell", "npc");
                let final_price;
                if (sellto in prices) {
                    this.variables["itemSellLoc"]["list"][itemtype] = sellto;
                    final_price = prices[sellto];
                } else {
                    this.variables["itemSellLoc"]["list"][itemtype] = Object.keys(prices).reduce((a, b) => prices[a] > prices[b] ? a : b);
                    final_price = prices[this.variables["itemSellLoc"]["list"][itemtype]];
                };
                this.variables["itemtypeProfit"]["list"][itemtype] = amount * final_price * hopper_multiplier;
                coinsPerTime += amount * final_price;
            };
        };
        // XP
        for (const [itemtype, amount] of Object.entries(this.variables["items"]["list"])) {
            let [xptype, value] = Object.entries(md.itemList[itemtype]["xp"])[0];
            if (value === 0) {
                continue;
            };
            if (!(xptype in this.variables["xp"]["list"])) {
                this.variables["xp"]["list"][xptype] = 0;
            };
            this.variables["xp"]["list"][xptype] += amount * value * (1 + this.variables["wisdom"]["list"][xptype] / 100);
        };
        if (mayor === "Derpy" || mayor === "Aura") {
            for (const xptype of Object.keys(this.variables["xp"]["list"])) {
                this.variables["xp"]["list"][xptype] *= 1.5;
            };
        };
        coinsPerTime *= hopper_multiplier;
        this.variables["itemProfit"]["var"] = coinsPerTime * timeratio;
        if (afk_toggle && this.variables["playerHarvests"]["var"] && "combat" in this.variables["xp"]["list"]) {
            delete this.variables["xp"]["list"]["combat"];
        };

        // Check for over-compacting
        if (["best", "bazaar"].includes(sellto)) {
            let overcompacting = [];
            for (const data of compacted_items) {
                let item = data["from"];
                let compact_item = data["makes"];
                let per_compact = data["per"];
                let compact_amount = 1;
                if ("amount" in data) {
                    compact_amount = data["amount"];
                };
                let cost = this.getPrice(item, "sell", "bazaar") * per_compact;
                let compact_cost = this.getPrice(compact_item, "sell", "bazaar") * compact_amount;
                if (cost - compact_cost > this.variables["compact_tolerance"]["var"]) {
                    overcompacting.push(md.itemList[item]['display']);
                };
            };
            if (GUI.get_length(overcompacting) !== 0) {
                this.variables["notes"]["list"]["Over-compacting"] = overcompacting.join(', ');
            };
        };

        // Pet leveling calculations
        // https://wiki.hypixel.net/Pets#Leveling
        // for Golden Dragon: special algorithm taking into account that pet items cannot be applied to Golden Dragon Eggs
        // the pet costs are manually added in pet_data
        let petProfitPerTime = 0.0;
        let all_pets = {
            "levelingpet": {"pet": this.variables["levelingpet"]["var"], "pet_xp": {}, "levelled_pets": 0.0},
            "expsharepet": {"pet": this.variables["expsharepet"]["var"], "pet_xp": {"exp_share": 0.0}, "levelled_pets": 0.0},
            "expsharepetslot2": {"pet": this.variables["expsharepetslot2"]["var"], "pet_xp": {"exp_share": 0.0}, "levelled_pets": 0.0},
            "expsharepetslot3": {"pet": this.variables["expsharepetslot3"]["var"], "pet_xp": {"exp_share": 0.0}, "levelled_pets": 0.0}
        };
        let main_pet = this.variables["levelingpet"]["var"];
        let main_pet_xp = all_pets["levelingpet"]["pet_xp"];
        let left_over_pet_xp;
        if (main_pet !== "None") {
            if (["Golden Dragon", "Jade Dragon"].includes(main_pet)) {
                left_over_pet_xp = 0.0;
                for (const [skill, amount] of Object.entries(this.variables["xp"]["list"])) {
                    let [pet_xp_boost, xp_boost_pet_item] = this.getPetXPBoosts(main_pet, skill);
                    let dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item);
                    main_pet_xp[skill] = dragon_xp_outputs[0];
                    left_over_pet_xp = dragon_xp_outputs[1];
                };
            } else {
                for (const [skill, amount] of Object.entries(this.variables["xp"]["list"])) {
                    let [pet_xp_boost, xp_boost_pet_item] = this.getPetXPBoosts(main_pet, skill);
                    main_pet_xp[skill] = amount * pet_xp_boost * xp_boost_pet_item;
                };
            };
            const exp_share_boost = 0.2 * this.variables["taming"]["var"] + 10 * (this.variables["mayor"]["var"] === "Diana") + this.variables["toucan_attribute"]["var"];
            const exp_share_item = 15 * this.variables["expshareitem"]["var"];
            let exp_share_pet;
            let non_matching;
            for (let [pet_slot, pet_info] of Object.entries(all_pets)) {
                if (pet_slot === "levelingpet") {
                    continue;
                };
                exp_share_pet = pet_info["pet"];
                if (exp_share_pet !== "None") {
                    if (["Golden Dragon", "Jade Dragon"].includes(exp_share_pet)) {
                        if (exp_share_boost === 0) {
                            continue;
                        };
                        left_over_pet_xp = 0.0;
                        for (const [skill, amount] of Object.entries(main_pet_xp)) {
                            non_matching = this.getPetXPBoosts(exp_share_pet, skill, true);
                            let equiv_pet_xp_boost = non_matching * (exp_share_boost / 100);
                            let equiv_xp_boost_pet_item = 1 + exp_share_item / exp_share_boost;
                            let dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, equiv_pet_xp_boost, equiv_xp_boost_pet_item);
                            pet_info["pet_xp"]["exp_share"] += dragon_xp_outputs[0];
                            left_over_pet_xp = dragon_xp_outputs[1];
                        };
                    } else {
                        for (const [skill, amount] of Object.entries(main_pet_xp)) {
                            non_matching = this.getPetXPBoosts(exp_share_pet, skill, true);
                            pet_info["pet_xp"]["exp_share"] += amount * ((exp_share_boost + exp_share_item) / 100) * non_matching;
                        };
                    };
                };
                if (mayor !== "Diana") {
                    break;
                };
            };
            let exp_share_price = this.getPrice("PET_ITEM_EXP_SHARE", "buy", "custom", true);
            if (exp_share_price === 0) {
                exp_share_price = this.getPrice("PET_ITEM_EXP_SHARE_DROP", "buy", "bazaar") + 72 * this.getPrice("ENCHANTED_GOLD", "buy", "bazaar");
            };
            for (let [pet_slot, pet_info] of Object.entries(all_pets)) {
                this.variables["pets_levelled"]["list"][pet_slot] = Object.values(pet_info["pet_xp"]).reduce((partialSum, a) => partialSum + a, 0) / md.max_lvl_pet_xp_amounts[md.all_pets[pet_info["pet"]]["rarity"]];
                if (!(pet_info["pet"] in this.pet_costs)) {
                    this.variables["notes"]["list"]["Pet Costs"] = `${pet_info['pet']} is not in pet_costs.`;
                } else {
                    petProfitPerTime += this.variables["pets_levelled"]["list"][pet_slot] * (this.pet_costs[pet_info["pet"]]["max"] - this.pet_costs[pet_info["pet"]]["min"]);
                };
                let main_pet_item = this.variables["petxpboost"]["var"];
                if (pet_slot === "levelingpet" && main_pet_item !== "None") {
                    petProfitPerTime -= this.variables["pets_levelled"]["list"][pet_slot] * this.getPrice(md.getID[main_pet_item], "buy", "custom", true);
                } else if (this.variables["expshareitem"]["var"]) {
                    petProfitPerTime -= this.variables["pets_levelled"]["list"][pet_slot] * exp_share_price;
                };
                this.variables["pets_levelled"]["list"][pet_slot] *= timeratio;
            };
        };

        this.variables["petProfit"]["var"] = petProfitPerTime * timeratio;

        // calculating beacon and limited fuel cost
        let fuelCostPerTime = 0.0;
        let neededFuelPerTime = 0.0;
        if (minion_beacon !== 0) {
            let beacon_fuel_ID;
            if (this.variables["scorched"]["var"]) {
                beacon_fuel_ID = "SCORCHED_POWER_CRYSTAL";
            } else {
                beacon_fuel_ID = "POWER_CRYSTAL";
            };
            let costPerCrystal = this.getPrice(beacon_fuel_ID, "buy", "bazaar");
            fuelCostPerTime += emptytimeNumber * costPerCrystal / md.itemList[beacon_fuel_ID]["duration"] * Number(!(this.variables["B_constant"]["var"]));
        };
        if (md.itemList[minion_fuel]["upgrade"]["duration"] !== 0) {
            let costPerFuel = this.getPrice(minion_fuel, "buy", "bazaar");
            neededFuelPerTime = minion_amount * emptytimeNumber / md.itemList[minion_fuel]["upgrade"]["duration"];
            fuelCostPerTime += neededFuelPerTime * costPerFuel;
        };
        this.variables["fuelcost"]["var"] = fuelCostPerTime * timeratio;
        this.variables["fuelamount"]["var"] = Math.max(neededFuelPerTime * timeratio, minion_amount);

        // Setup cost
        let total_cost = 0.0;
        // Single minion cost
        let cost_cache = {};
        let tiered_coin_cost = {};
        let tiered_extra_cost = {};
        let tier_loop = [...Array(minion_tier).keys()].map(x => x + 1);
        for (const tier of tier_loop) {
            tiered_coin_cost[tier] = 0.0;
            if (minion_type in md.extraMinionCosts) {
                if (tier in md.extraMinionCosts[minion_type]) {
                    if ("COINS" in md.extraMinionCosts[minion_type][tier]) {
                        tiered_coin_cost[tier] += md.extraMinionCosts[minion_type][tier]["COINS"];
                    };
                    if (GUI.get_length(md.extraMinionCosts[minion_type][tier]) > 1 || !("COINS" in md.extraMinionCosts[minion_type][tier])) {
                        if (!(tier in tiered_extra_cost)) {
                            tiered_extra_cost[tier] = {}
                        }
                        for (const [cost_type, amount] of Object.entries(md.extraMinionCosts[minion_type][tier])) {
                            if (cost_type === "COINS") {
                                continue;
                            };
                            tiered_extra_cost[tier][GUI.toTitleCase(cost_type.replace(/_/g, ' '))] = amount;
                        };
                    };
                };
            };
            for (const [item, amount] of Object.entries(md.minionCosts[minion_type][tier])) {
                if (!(item in cost_cache)) {
                    cost_cache[item] = this.getPrice(item, "buy", "bazaar");
                };
                tiered_coin_cost[tier] += amount * cost_cache[item];
            };
            if (tier !== 1) {
                tiered_coin_cost[tier] += tiered_coin_cost[tier - 1];
            };
            if (tier - 1 in tiered_extra_cost) {
                if (!(tier in tiered_extra_cost)) {
                    tiered_extra_cost[tier] = {};
                };
                for (const [material, amount] of Object.entries(tiered_extra_cost[tier - 1])) {
                    if (!(material in tiered_extra_cost[tier])) {
                        tiered_extra_cost[tier][material] = 0;
                    };
                    tiered_extra_cost[tier][material] += amount;
                };
            };
        };
        if (GUI.get_length(tiered_extra_cost) != 0) {
            this.variables["notes"]["list"]["Extra cost"] = Array.from(Object.keys(tiered_extra_cost[minion_tier]), material => `${tiered_extra_cost[minion_tier][material]} ${material}`).join(", ") + " per minion";
            this.variables["extracost"]["var"] = Array.from(Object.keys(tiered_extra_cost[minion_tier]), material => `${tiered_extra_cost[minion_tier][material] * minion_amount} ${material}`).join(", ");
        } else {
            this.variables["extracost"]["var"] = "";
        };
        total_cost += tiered_coin_cost[minion_tier];

        // Infinite fuel cost
        if (minion_fuel !== "NONE" && md.itemList[minion_fuel]["upgrade"]["duration"] === 0) {
            if (minion_fuel === "EVERBURNING_FLAME" && this.getPrice("EVERBURNING_FLAME", "buy", "custom", true) === 0) {
                for (const [item_ID, amount] of Object.entries(md.upgrades_material_cost["EVERBURNING_FLAME"])) {
                    total_cost += amount * this.getPrice(item_ID, "buy", "bazaar");
                };
            } else {
                total_cost += this.getPrice(minion_fuel, "buy", "bazaar");
            };
        };

        // Hopper cost
        if (["Budget Hopper", "Enchanted Hopper"].includes(minion_hopper)) {
            let hopper_ID = md.getID[minion_hopper];
            total_cost += this.getPrice(hopper_ID, "buy", "bazaar");
        };

        // Internal minion upgrades cost
        for (const upgrade of upgrades) {
            if (upgrade !== "NONE") {
                total_cost += this.getPrice(upgrade, "buy", "bazaar");
            };
        };

        // Infusion cost
        if (this.variables["infusion"]["var"] === true) {
            total_cost += this.getPrice("MITHRIL_INFUSION", "buy", "bazaar");
        };

        // Free Will costs
        /*
        Amount of Free Wills needed per minion:
        Let p be the chance to get a loyal minion.
        Let X be a r.v. denoting the amount of Free Wills needed.
        Using first step analysis we get
        E(X) = (1- p)(E(X) + 1) + p * 1
        E(X) = (1- p)E(X) + 1 - p + p
        E(X) = E(X)- pE(X) + 1
        E(X)= 1/p
        */
        let free_will_price = this.getPrice("FREE_WILL", "buy", "bazaar");
        let postcard_price = this.getPrice("POSTCARD", "buy", "custom", true);
        let final_postcard_cost;
        if (postcard_price === 0) {
            // # If no price found, use the free will price
            final_postcard_cost = free_will_price;
        } else {
            final_postcard_cost = postcard_price;
        };
        if (this.variables["free_will"]["var"] === true) {
            let tiered_free_will = {};
            for (const tier of tier_loop) {
                let free_wills_needed = 1 / (0.5 + 0.04 * (tier - 1));
                // for each failed Free Will we need another minion and we get a postcard
                // the last Free Will will not give a post card
                let free_wills_failed = free_wills_needed - 1;
                tiered_free_will[tier] = free_wills_failed * (tiered_coin_cost[tier] - final_postcard_cost) + free_wills_needed * free_will_price;
            };
            let optimal = Number(Object.keys(tiered_free_will).reduce((a, b) => tiered_free_will[a] < tiered_free_will[b] ? a : b));
            this.variables["optimal_tier_free_will"]["var"] = optimal;
            this.variables["notes"]["list"]["Free Will"] = `per minion, apply ${GUI.round_number(1 / (0.5 + 0.04 * (optimal - 1)))} Free Wills on Tier ${optimal}`;
            this.variables["freewillcost"]["var"] = tiered_free_will[optimal] * minion_amount;
        };

        // Storage Chest cost
        if (this.variables["chest"]["var"] !== "None") {
            let chest_ID = md.getID[this.variables["chest"]["var"]];
            total_cost += this.getPrice(chest_ID, "buy", "bazaar");
        };

        // multiply by minion amount
        total_cost *= minion_amount;

        // Beacon cost
        if (minion_beacon !== 0 && !(this.variables["B_acquired"]["var"])) {
            for (const i of [...Array(minion_beacon).keys()].map(x => x + 1)) {
                for (const [item_ID, amount] of Object.entries(md.upgrades_material_cost["beacon"][i])) {
                    total_cost += amount * this.getPrice(item_ID, "buy", "bazaar");
                };
            };
        };

        // Floating Crystal cost
        if (this.variables["crystal"]["var"] !== "None") {
            for (const [item_ID, amount] of Object.entries(md.upgrades_material_cost["crystal"][this.variables["crystal"]["var"]])) {
                total_cost += amount * this.getPrice(item_ID, "buy", "bazaar");
            };
        };

        // Postcard cost
        if (this.variables["postcard"]["var"]) {
            total_cost += final_postcard_cost;
        };

        // Potato Talisman cost
        if (this.variables["potatoTalisman"]["var"]) {
            total_cost += this.getPrice("POTATO_TALISMAN", "buy", "custom", true);
        };

        // Attribute costs
        if (this.variables["toucan_attribute"]["var"] !== 0) {
            total_cost += md.attribute_shards["Epic"][this.variables["toucan_attribute"]["var"]] * this.getPrice("SHARD_TOUCAN", "buy", "bazaar");
        };
        if (this.variables["falcon_attribute"]["var"] !== 0) {
            total_cost += md.attribute_shards["Rare"][this.variables["falcon_attribute"]["var"]] * this.getPrice("SHARD_FALCON", "buy", "bazaar");
        };

        // Sending results to this.variables
        this.variables["setupcost"]["var"] = total_cost;
        this.variables["totalProfit"]["var"] = this.variables["itemProfit"]["var"] + this.variables["petProfit"]["var"] - this.variables["fuelcost"]["var"];

        // multiply final lists by timeratio
        for (const loop_key of ["items", "itemtypeProfit", "xp"]) {
            for (const item of Object.keys(this.variables[loop_key]["list"])) {
                this.variables[loop_key]["list"][item] *= timeratio;
            };
        };

        // Construct ID
        let setup_ID = this.constructID();
        this.variables["ID"]["var"] = setup_ID;
        this.variables["ID_container"]["list"].push(setup_ID);

        // Get minion notes
        if ("notes" in md.minionList[minion_type]) {
            for (const [note_name, note_text] of Object.entries(md.minionList[minion_type]["notes"])) {
                this.variables["notes"]["list"][note_name] = note_text;
            };
        };

        // Update listboxes
        if (inGUI === true) {
            if (GUI.get_value("Rising Celsius Override_auto_run")) {
                    this.addons_list["Rising Celsius Override"].bind(add_ons)(this);
                };
            for (let addon_name of Object.keys(this.addons_list)) {
                if (addon_name === "Rising Celsius Override") {
                    continue;
                };
                if (GUI.get_value(`${addon_name}_auto_run`)) {
                    this.addons_list[addon_name].bind(add_ons)(this);
                };
            };
            this.update_GUI();
            this.statusC.style.background = "green";
        };
        return;
    };

    format_date(ms_time) {
        const d = new Date(ms_time);
        let timezone_minutes = d.getTimezoneOffset();
        let timezone_sign = "-";
        if (timezone_minutes < 0) {
            timezone_sign = "+";
            timezone_minutes = Math.abs(timezone_minutes);
        };
        let timezone_hours = Math.floor(timezone_minutes / 60);
        timezone_minutes = timezone_minutes % 60;
        let formatter = x => (x < 10) ? `0${x}` : `${x}`;
        let output_string = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${formatter(d.getHours())}:${formatter(d.getMinutes())}:${formatter(d.getSeconds())} UTC${timezone_sign}${formatter(timezone_hours)}${formatter(timezone_minutes)}`;
        return output_string;
    };

    async init_prices() {
        /*
        calls to Hypixel's Item API got get NPC prices.

        Returns
        -------
        None
        */
        console.log("INFO: Calling Item API");
        try {
            const f = await fetch("https://api.hypixel.net/resources/skyblock/items");
            var raw_item_data = await f.json();
        } catch(error) {
            console.log("ERROR: Could not finish Item API call to Hypixel");
            console.log(error);
            return;
        };
        if (!("success" in raw_item_data) || raw_item_data["success"] === false) {
            console.log("ERROR: Item API call was unsuccessful");
            return;
        };
        console.log("INFO: Item API call successful");
        let dict_item_data = {};
        for (let item_data of raw_item_data["items"]) {
            dict_item_data[item_data["id"]] = item_data;
        };

        for (let item_id in md.itemList) {
            if (item_id in dict_item_data && "npc_sell_price" in dict_item_data[item_id]) {
                md.itemList[item_id]["prices"]["npc"] = dict_item_data[item_id]["npc_sell_price"];
            } else if (!("npc" in md.itemList[item_id]["prices"])) {
                md.itemList[item_id]["prices"]["npc"] = 0;
            };
        };
    };


    async update_bazaar(cooldown_warning=true) {
        if (Date.now() - this.bazaar_timer < this.variables["bazaar_cooldown"]["var"] * 1000 && this.bazaar_timer !== 0) {
            if (cooldown_warning) {
                console.log("BAZAAR: Bazaar is on cooldown");
            };
            return;
        };
        try {
            const f = await fetch("https://api.hypixel.net/v2/skyblock/bazaar");
            var raw_data = await f.json();
        } catch(error) {
            console.log("ERROR: Could not finish API call to Hypixel");
            console.log(error);
            return;
        };
        if (!("success" in raw_data) || raw_data["success"] === false) {
            console.log("ERROR: API call was unsuccessful");
            return;
        };
        this.bazaar_timer = raw_data["lastUpdated"];
        this.variables["bazaar_update_txt"]["var"] = this.format_date(this.bazaar_timer);
        document.getElementById("bazaar_update_txt").innerHTML = this.variables["bazaar_update_txt"]["var"];
        let top_percent = 0.1;
        for (let [itemtype, item_data] of Object.entries(md.itemList)) {
            if (!(itemtype in raw_data["products"])) {
                continue;
            };
            for (let action of ["buy", "sell"]) {
                let top_amount = top_percent * raw_data["products"][itemtype][`${action}_summary`].map(x => x["amount"]).reduce((partialSum, a) => partialSum + a, 0);
                if (top_amount === 0) {
                    item_data["prices"][`${action}Price`] = 0;
                    if (!("npc" in item_data["prices"])) {
                        console.log(`BAZAAR: no ${action} supply for ${itemtype}`);
                    };
                    continue;
                };
                let counter = top_amount;
                let top_sum = 0;
                for (let order of raw_data["products"][itemtype][`${action}_summary`]) {
                    if (counter <= 0) {
                        break;
                    };
                    if (counter >= order["amount"]) {
                        top_sum += order["amount"] * order["pricePerUnit"];
                        counter -= order["amount"];
                    } else {
                        top_sum += counter * order["pricePerUnit"];
                        counter = 0;
                        break;
                    };
                };
                let top_percent_avg_price = top_sum / top_amount;
                let top_price = raw_data["products"][itemtype][`${action}_summary`][0]["pricePerUnit"];
                if (top_price / top_percent_avg_price >= 2.5) {
                    item_data["prices"][`${action}Price`] = top_price;
                    console.log(`BAZAAR: bottom heavy ${action} supply for ${itemtype}, taking top order price`);
                } else {
                    item_data["prices"][`${action}Price`] = top_percent_avg_price;
                };
            };
        };
        this.update_AH();
    };

    async update_AH() {
        try {
            let postcard_url = "https://sky.coflnet.com/api/item/price/POSTCARD/bin";
            const f = await fetch(postcard_url);
            var raw_data = await f.json();
        } catch(error) {
            console.log("ERROR: Could not finish API call to Coflnet");
            console.log(error);
            return;
        };
        md.itemList["POSTCARD"]["prices"]["custom"] = (raw_data["lowest"] + raw_data["secondLowest"]) / 2;
        return;
    };

    update_GUI() {
        for (const [var_key, var_data] of Object.entries(this.variables)) {
            let var_vtype = this.variables[var_key]["vtype"];
            if (var_vtype === "output" && document.getElementById(var_key) !== null) {
                document.getElementById(var_key).innerHTML = this.variables[var_key]["var"];
            } else if (var_vtype === "list" && var_key !== "wisdom") {
                let lines = [];

                let format_function = x => x;
                if ("IDtoDisplay" in var_data && var_data["IDtoDisplay"] === true) {
                    format_function = x => md.itemList[x]["display"];
                } else if (var_key === "pets_levelled") {
                    format_function = x => this.variables[x]["var"];
                };

                if (this.variables[var_key]["list"] instanceof Array) {
                    for (let val of this.variables[var_key]["list"]) {
                        lines.push(format_function(val));
                    };
                } else {
                    for (const [key, val] of Object.entries(this.variables[var_key]["list"])) {
                        if (var_key === "pets_levelled" && format_function(key) === "None") {
                            continue;
                        };
                        lines.push(`${format_function(key)}: ${val}`);
                    };
                };
                GUI.fill_list_box(var_key, lines);
            };
        };
    };

    collect_addon_output(output_name, output_str) {
        this.variables["addons_output_container"]["list"][output_name] = output_str;
        let listbox_list = [];
        for (const [key, val] of Object.entries(this.variables["addons_output_container"]["list"])) {
            listbox_list.push(`${key}: ${val}`);
        };
        GUI.fill_list_box("addons_output_container", listbox_list);
        return;
    };

    edit_pet_price_redirect() {
        this.edit_pet_price_pet = this.edit_vars_output["edit_pet_price_pet"];
        if (!(this.edit_pet_price_pet in this.pet_costs)) {
            this.pet_costs[this.edit_pet_price_pet] = {"min": 0, "max": 0};
        };
        let initial_max = this.pet_costs[this.edit_pet_price_pet]["max"];
        let initial_min = this.pet_costs[this.edit_pet_price_pet]["min"];
        GUI.edit_vars.bind(this)(this.edit_pet_price_store.bind(this), {"min_price": {"dtype": "number", "display": "Level 1 price", "initial": initial_min, "options": []}, "max_price": {"dtype": "number", "display": "Max level price", "initial": initial_max, "options": []}}, false);
    };

    edit_pet_price_store() {
        this.pet_costs[this.edit_pet_price_pet]["max"] = this.edit_vars_output["max_price"];
        this.pet_costs[this.edit_pet_price_pet]["min"] = this.edit_vars_output["min_price"];
    };

};
