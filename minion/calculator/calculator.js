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
                "beacon": "None",
                "infusion": false,
                "free_will": false,
                "postcard": true,
            },
            "No permanent speed": {
                "fuel": "Plasma Bucket",
                "upgrade2": "Flycatcher",
                "beacon": "Beacon V",
                "infusion": false,
                "free_will": false,
                "postcard": true,
            },
            "Max speed": {
                "fuel": "Plasma Bucket",
                "upgrade2": "Flycatcher",
                "beacon": "Beacon V",
                "infusion": true,
                "free_will": true,
                "postcard": true,
            },
            "Hyper speed": {
                "fuel": "Hyper Catalyst",
                "upgrade2": "Flycatcher",
                "beacon": "Beacon V",
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
                "inferno_eyedrops": false,
                "sell_loc": "Best (NPC/Bazaar)",
                "upgrade1": "Super Compactor 3000",
                "upgrade2": "Flycatcher",
                "chest": "XX-Large Storage",
                "beacon": "Beacon V",
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

        this.bazaar_auto_update = new Hvar({"huim": this.gui, "key": "bazaar_auto_update", "vtype": "storage", "dtype": "boolean", "display": "Bazaar Auto Update", "initial": true});
        this.API_cooldown = new Hvar({"huim": this.gui, "key": "API_cooldown", "vtype": "storage", "dtype": "number", "display": "API Cooldown (s)", "initial": 120});
        this.compact_tolerance = new Hvar({"huim": this.gui, "key": "compact_tolerance", "vtype": "storage", "dtype": "number", "display": "Over-Compacting Tolerance (coins)", "initial": 10000});
        this.output_to_clipboard = new Hvar({"huim": this.gui, "key": "output_to_clipboard", "vtype": "storage", "dtype": "boolean", "display": "Output to Clipboard", "initial": true});
        this.color_palette = new Hvar({"huim": this.gui, "key": "color_palette", "vtype": "storage", "dtype": "string", "display": "Color Palette", "initial": "Dark Red", "options": Object.keys(this.gui.palette_names)});
        this.template = new Hvar({"huim": this.gui, "key": "template", "vtype": "input", "display": "Templates", "initial": "Choose Template", "dtype": "string", "frame": "inputs_minion_grid", "options": Object.keys(this.templateList), "command": this.load_template.bind(this)});
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
        this.wisdom = new Hvar({"huim": this.gui, "key": "wisdom", "vtype": "output", "dtype": "object", "display": "Wisdom", "frame": "inputs_player_grid", "widget_width": 20, "widget_height": 6, "initial": {'combat': this.combat_wisdom, 'mining': this.mining_wisdom, 'farming': this.farming_wisdom, 'fishing': this.fishing_wisdom, 'foraging': this.foraging_wisdom, 'alchemy': this.alchemy_wisdom}});
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
        this.items = new Hvar({"huim": this.gui, "key": "items", "vtype": "output", "dtype": "object", "display": "Item amounts", "frame": "outputs_setup_grid", "widget_width": 35, "widget_height": 10, "initial": {}, "switch_initial": false, "tags": ["item_ID_to_display"]});
        this.item_sell_loc = new Hvar({"huim": this.gui, "key": "item_sell_loc", "vtype": "output", "dtype": "object", "display": "Sell locations", "frame": "outputs_profit_grid", "widget_width": 35, "widget_height": 10, "initial": {}, "switch_initial": false, "tags": ["item_ID_to_display"]});
        this.filltime = new Hvar({"huim": this.gui, "key": "filltime", "vtype": "output", "dtype": "number", "display": "Fill time", "frame": "outputs_setup_grid", "initial": 0.0, "switch_initial": false});
        this.used_storage = new Hvar({"huim": this.gui, "key": "used_storage", "vtype": "output", "dtype": "number", "display": "Used Storage", "frame": "outputs_setup_grid", "initial": 0, "switch_initial": false});
        this.itemtype_profit = new Hvar({"huim": this.gui, "key": "itemtype_profit", "vtype": "output", "dtype": "object", "display": "Itemtype profits", "fancy_display": "Profits per item type", "frame": "outputs_profit_grid", "widget_width": 35, "widget_height": 10, "initial": {}, "switch_initial": false, "tags": ["item_ID_to_display"]});
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

        let wisdomB = GUI.create_button('Edit', () => GUI.edit_vars.bind(this)(() => this.wisdom.update_listbox.bind(this.wisdom)(x => x, x => x.get(), (key, val) => val.get() !== 0.0), ["combat_wisdom", "mining_wisdom", "farming_wisdom", "fishing_wisdom", "foraging_wisdom", "alchemy_wisdom"]));
        this.wisdom.widget.push(wisdomB);
        
        this.notesAnchor = GUI.genLabel("notesAnchor", "");
        this.notesAnchor.className = "notes_anchor";
        
        let calcB = GUI.create_button("Calculate", () => this.calculate.bind(this)(true), true);
        this.statusC = document.createElement("div")
        Object.assign(this.statusC, {innerText: "\n", className: "status_div", id: "status_div", style: "background: green;"});
        let outputB = GUI.create_button('Short Output', this.output_data.bind(this), true);
        let fancyoutputB = GUI.create_button('Share Output', this.fancy_output.bind(this), true);
        let bazaarB = GUI.create_button("Update Prices", this.update_prices.bind(this), true);
        let settingsB = GUI.create_button('Edit Settings', () => GUI.edit_vars.bind(this)(GUI.update_color_palette.bind(GUI), ["bazaar_auto_update", "API_cooldown", "compact_tolerance", "output_to_clipboard", "color_palette"]), true);
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
        
        this.wisdom.update_listbox(x => x, x => x.get(), (key, val) => val.get() !== 0.0);
        for (const var_key of Object.keys(this.var_dict)) {
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


        this.dependent_variables = {"afkpet_rarity": "afkpet", "afkpet_lvl": "afkpet", "player_harvests": "afk", "empty_time": "scale_time", "freewillcost": "free_will", "expshareitem": "expsharepet", "used_pet_prices": "levelingpet", "pet_profit": "levelingpet"};
        this.key_replace_bool = ["infusion", "free_will", "postcard"];

        this.outputOrder = ['fuel', "inferno_grade", "inferno_distillate", "inferno_eyedrops", "rising_celsius_override",
                            'hopper', 'upgrade1', 'upgrade2', 'chest',
                            'beacon', 'scorched', 'B_constant', 'B_acquired',
                            'crystal', 'postcard', 'infusion', 'free_will', 'afk', 'afkpet', 'afkpet_rarity', 'afkpet_lvl', 'enchanted_clock', 'special_layout', 'potato_accessory', 'player_harvests', "player_looting",
                            'wisdom', 'mayor', 'levelingpet', 'taming', 'falcon_attribute', 'petxpboost', 'beastmaster', 'toucan_attribute', 'expshareitem', 'expsharepet', 'expsharepetslot2', 'expsharepetslot3',
                            'ID', 'setupcost', 'freewillcost', 'extracost', 'actiontime', 'fuelamount', 'sell_loc', 'bazaar_update_txt', 'bazaar_taxes', 'bazaar_flipper', 'notes',
                            'empty_time', 'scaled_time', 'harvests', 'used_storage', 'items', 'item_sell_loc',
                            'item_profit', 'itemtype_profit', 'xp', 'pet_profit', 'pets_levelled', 'used_pet_prices',
                            'fuelcost', 'total_profit', 'addons_output_container'];


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
    };

    multiswitch(multi_ID, force=false) {
        if (multi_ID === "minion") {
            let minionType = this.minion.get(false);
            GUI.set_value("miniontier", Object.keys(md.minionList[minionType]["speed"]).slice(-1));
            GUI.toggle_switch("potato_accessory_switch", minionType + String(this.afk.get(false)));
            GUI.toggle_switch("rising_celsius", minionType);
        } else if (multi_ID === "tier") {
            let minionType = this.minion.get(false);
            let minionTier = this.miniontier.get(false);
            if (!(minionTier in md.minionList[minionType]["speed"])) {
                GUI.set_value("miniontier", Object.keys(md.minionList[minionType]["speed"]).slice(-1));
            };
        } else if (multi_ID === "fuel") {
            let control = this.fuel.get(false);
            GUI.toggle_switch("infernofuel", control);
            GUI.toggle_switch("fuel_amount", md.itemList[md.fuel_options[control]]["fuel_duration"]);
        } else if (multi_ID === "afk") {
            let afkState = this.afk.get(false);
            let minionType = this.minion.get(false);
            GUI.toggle_switch("afking", afkState);
            GUI.toggle_switch("potato_accessory_switch", minionType + String(afkState));
        } else if (multi_ID === "pet_leveling") {
            let mayor = this.mayor.get(false);
            let pet_leveling_state;
            if (force) {
                GUI.toggle_switch("pet_leveling");
                pet_leveling_state = GUI.switches["pet_leveling"]["state"]
                GUI.toggle_switch("exp_share_diana", mayor + String(pet_leveling_state));
            } else {
                let control = this.levelingpet.get(false);
                GUI.toggle_switch("pet_leveling", control);
                pet_leveling_state = GUI.switches["pet_leveling"]["state"]
                GUI.toggle_switch("exp_share_diana", mayor + String(pet_leveling_state));
            };
        } else if (multi_ID === "mayors") {
            let mayor = this.mayor.get(false);
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
            template = this.decode_id(this.load_ID.get());
        } else if (templateName === "Clean") {
            template = {};
            for (let var_key of this.ID_order) {
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
        let crafted_string = `${this.amount.get()}x ${this.minion.get()} t${this.miniontier.get()}; `;
        let string_parts = {};
        for (let var_key of this.outputOrder) {
            if (var_key in this.dependent_variables) {
                if (["None", "0", "0.0", "", false].includes(this.var_dict[this.dependent_variables[var_key]].get(false))) {
                    continue;
                };
            } else if (["expsharepetslot2", "expsharepetslot3"].includes(var_key)) {
                if (this.mayor.get() !== "Diana") {
                    continue;
                };
            } else if (["inferno_grade", "inferno_distillate", "inferno_eyedrops"].includes(var_key)) {
                if (this.fuel.get(false) !== "Inferno Minion Fuel") {
                    continue;
                };
            };
            if (this.var_dict[var_key].get_output_switch() === false) {
                if (var_key === "notes" && this.special_layout.get() && "Special Layout" in this.notes.list) {
                    string_parts["notes"] = "Notes: Special Layout: " + this.notes.list['Special Layout'];
                } else {
                    continue;
                };
            };
            if (var_key === "wisdom") {
                let wisdoms = {};
                for (let [list_key, wisdom_var] of Object.entries(this.wisdom.list)) {
                    if (list_key in this.xp.list && !(["None", 0, 0.0].includes(wisdom_var.get()))) {
                        wisdoms[list_key] = wisdom_var.get();
                    };
                };
                if (this.gui.get_length(wisdoms) !== 0) {
                    string_parts["widsom"] = this.wisdom.get_display() + ": " + Array.from(Object.keys(wisdoms), wisdom_type => wisdom_type + ": " + wisdoms[wisdom_type]).join(", ");
                };
                continue;
            };
            if (var_key === "bazaar_update_txt") {
                string_parts["bazaar_update_txt"] = `Bazaar info: ${this.bazaar_sell_type.get()}, ${this.bazaar_buy_type.get()}, Last updated at ${this.bazaar_update_txt.get()}`
                continue;
            };
            if (var_key === "extracost") {
                if (this.setupcost.get_output_switch() === false) {
                    continue;
                };
            };
            
            let vtype = this.var_dict[var_key].vtype;
            let display = this.var_dict[var_key].get_display();
            let dtype = this.var_dict[var_key].dtype;
            if (dtype === "object") {
                if (this.gui.get_length(this.var_dict[var_key].list) === 0) {
                    continue;
                };
                let formatted_list = [];
                let formatting_function = x => x;
                if (this.var_dict[var_key].has_tag("item_ID_to_display")) {
                    formatting_function = x => md.itemList[x]['display'];
                } else if (var_key === "pets_levelled") {
                    formatting_function = x => this.var_dict[x].get();
                };
                for (let [list_key, list_val] of Object.entries(this.var_dict[var_key].list)) {
                    if (typeof list_val === "number") {
                        formatted_list.push(formatting_function(list_key) + ": " + this.gui.reduced_number(list_val));
                    } else {
                        formatted_list.push(formatting_function(list_key) + ": " + list_val);
                    };
                };
                string_parts[var_key] = display + ": " + formatted_list.join(", ");
                continue;
            };

            let val = this.var_dict[var_key].get(false);
            if (vtype === "input") {
                if (["None", 0, 0.0, false, ""].includes(val)) {
                    continue;
                };
                if (dtype === "number") {
                    string_parts[var_key] = `${display}: ${val}`;
                } else if (dtype === "boolean") {
                    val = `${val}`;
                    string_parts[var_key] = `${display}: ${{"true": "True", "false" : "False"}[val]}`;
                } else {
                    string_parts[var_key] = `${val}`;
                };
            } else {
                if (dtype === "number") {
                    string_parts[var_key] = `${display}: ${this.gui.reduced_number(val)}`;
                } else {
                    string_parts[var_key] = `${display}: ${val}`;
                };
            };
        };
        crafted_string += Object.values(string_parts).join("; ");
        if (this.output_to_clipboard.get()) {
            try {
                navigator.clipboard.writeText(crafted_string);
            } catch(error) {
                if (error.name === "NotAllowedError") {
                    console.log("Not allowed to write to clipboard, outputting output here instead:");
                } else {
                    console.log("Unknown Error", error);
                };
                console.log(crafted_string, "\n");
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
            if (["None", "0", "0.0", "", false].includes(this.var_dict[this.dependent_variables[var_key]].get(false))) {
                return null;
            };
        } else if (["expsharepetslot2", "expsharepetslot3"].includes(var_key)) {
            if (this.mayor.get() !== "Diana") {
                return null;
            };
        } else if (var_key === "extracost") {  // special case: setup cost is turned off
            if (this.setupcost.get_output_switch() === false) {
                return null;
            };
        };

        let output_switch_val = this.var_dict[var_key].get_output_switch()
        if (output_switch_val === false) {
            if (var_key === "notes" && this.special_layout.get() === true && "Special Layout" in this.notes.list) {
                return "Notes:\n> Special Layout: `" + this.notes.list['Special Layout'] + "`";
            } else {
                return null;
            };
        } else if (output_switch_val === true) {
            force = true;
        };


        if (var_key === "wisdom") {
            let wisdoms = {};
            for (let [list_key, wisdom_var] of Object.entries(this.wisdom.list)) {
                if (list_key in this.xp.list && !(["None", 0, 0.0].includes(wisdom_var.get()))) {
                    wisdoms[list_key] = wisdom_var.get();
                };
            };
            if (this.gui.get_length(wisdoms) !== 0) {
                return this.wisdom.get_display(true) + ":\n> " + Array.from(Object.keys(wisdoms), wisdom_type => wisdom_type + ": `" + wisdoms[wisdom_type] + "`").join(", ");
            };
            return null;
        } else if (var_key === "used_storage") {
            val = "`" + this.var_dict[var_key].get() + "` (out of `" + this.available_storage.get() + "`)";
        } else if (this.key_replace_bool.includes(var_key)) {
            if (this.var_dict[var_key].get() === true) {
                val = "`" + this.var_dict[var_key].get_display(true) + "`";
            } else {
                return null;
            };
        } else if (var_key === "ID") {
            val = `||${this.var_dict[var_key].get()}||`.replace("\\", "\\\\")
        } else if (this.var_dict[var_key].dtype === "object") {
            if (this.gui.get_length(this.var_dict[var_key].list) === 0) {
                return null;
            };
            let formatted_list = [];
            let formatting_function = x => x;
            if (this.var_dict[var_key].has_tag("item_ID_to_display")) {
                formatting_function = x => md.itemList[x]['display'];
            } else if (var_key === "pets_levelled") {
                formatting_function = x => this.var_dict[x].get();
            };
            for (let [list_key, list_val] of Object.entries(this.var_dict[var_key].list)) {
                if (typeof list_val === "number") {
                    formatted_list.push(formatting_function(list_key) + ": `" + this.gui.reduced_number(list_val) + "`");
                } else {
                    formatted_list.push(formatting_function(list_key) + ": `" + list_val + "`");
                };
            };
            val = "\n> " + formatted_list.join(", ");
        } else if (this.var_dict[var_key].dtype === "number") {
            val = "`" + this.gui.reduced_number(this.var_dict[var_key].get()) + "`";
        } else if (this.var_dict[var_key].dtype === "boolean") {
            val = "`" + {"true": "True", "false": "False"}[`${this.var_dict[var_key].get()}`] + "`";
        } else {
            val = "`" + this.var_dict[var_key].get(false) + "`";
        };
        if (["`None`", "`0`", "`0.0`", "", "``", "`False`"].includes(val) && force === false) {
            return null;
        };
        if (var_key === "freewillcost") {
            val += ` (optimal: apply on t${this.optimal_tier_free_will.get()})`
        };
        let return_str = ""
        if (display) {
            return_str += `${this.var_dict[var_key].get_display(true)}: `;
        };
        return_str += `${val}`;
        if (newline) {
            return_str += "\n";
        };
        return return_str;
    };
    
    fancy_output(toTerminal=true) {
        let crafted_string = `${this.amount.get()}x **${this.minion.get()} t${this.miniontier.get()}**`;
        for (let key of Object.keys(this.fancyOrder)) {
            let line_str = "";
            let header = "";
            let force_line = false;
            let joined_keys;
            if (key in this.var_dict) {
                header = this.prep_fancy_data(key);
                force_line = true;
            } else {
                header = key;
            };
            if (header === null) {
                continue;
            };
            if (header === "Beacon Info" && this.beacon.get() === 0) {
                continue;
            };
            if (header === "Inferno Info" && this.minion.get() !== "Inferno" && this.fuel.get(false) !== "Inferno Minion Fuel") {
                continue;
            };
            if (header === "Bazaar Info" && this.bazaar_update_txt.get_output_switch() === false) {
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
        if (this.output_to_clipboard.get()) {
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
    
    get_from_GUI(var_keys, translate=true) {
        let var_values = {};
        for (const var_key of var_keys) {
            if (!(var_key in this.var_dict)) {
                console.log(`WARNING: ${var_key} key not in this.var_dict`);
                continue;
            };
            if (this.var_dict[var_key].dtype === "object") {
                var_values[var_key] = JSON.parse(JSON.stringify(this.var_dict[var_key].list));
            } else {
                var_values[var_key] = this.var_dict[var_key].get(translate);
            };
        };
        return var_values;
    };

    send_to_GUI(outputs) {
        for (const var_key of Object.keys(outputs)) {
            if (!(var_key in this.var_dict)) {
                console.log(`WARNING: Output ${var_key} not found in this.var_dict`);
                continue;
            };
            if (this.var_dict[var_key].dtype === "object") {
                this.gui.clear_object(this.var_dict[var_key].list);
                if (this.var_dict[var_key].list instanceof Array) {
                    this.var_dict[var_key].list.push(...outputs[var_key]);
                } else {
                    Object.assign(this.var_dict[var_key].list, outputs[var_key]);
                };
            } else {
                this.var_dict[var_key].set(outputs[var_key]);
            };
        };
        return;
    };
    
    construct_id(setup_data) {
        let val;
        let index;
        let setup_id = String(this.version) + "!";
        for (const var_key of this.ID_order) {
            if (!(var_key in setup_data)) {
                console.log(`WARNING: ${var_key} key not in setup_data, assuming default value`);
                val = this.var_dict[var_key].initial;
            } else if (this.var_dict[var_key].translation !== null) {
                val = md.itemList[setup_data[var_key]]["display"];
            } else {
                val = setup_data[var_key];
            };
            let var_options = this.var_dict[var_key].options
            if (var_options === null) {
                if (parseInt(val) === val) {
                    val = parseInt(val);
                };
                setup_id += "!" + String(val) + "!";
            } else if (this.gui.get_length(var_options) > 79) {
                index = var_options.indexOf(val);
                setup_id += "!" + String(index) + "!";
            } else {
                index = var_options.indexOf(val);
                setup_id += String.fromCharCode(48 + index);
            };
        };
        return setup_id;
    };

    decode_id(ID) {
        if (!(ID instanceof String)) {
            ID = String(ID);
        };
        let setup_data = {};
        let end_ver = ID.indexOf("!");
        let ID_version;
        let end_val;
        if (end_ver === -1) {
            console.log("WARNING: Invalid ID, could not find version number");
            return setup_data;
        };
        try {
            ID_version = Number(ID.slice(0, end_ver));
        } catch(Exception) {
            console.log("WARNING: Invalid ID, could not find version number");
            return setup_data;
        };
        let ID_index = end_ver + 1;
        if (ID_version !== this.version) {
            console.log("WARNING: Invalid ID, Incompatible version");
            return setup_data;
        };
        try {
            for (const var_key of this.ID_order) {
                let var_options = this.var_dict[var_key].options
                if (var_options === null) {
                    if (ID[ID_index] !== "!") {
                        console.log(`WARNING: did not find ${var_key}`);
                        return {};
                    };
                    end_val = ID.indexOf("!", ID_index + 1);
                    setup_data[var_key] = {"string": String, "number": Number, "boolean": Boolean}[this.var_dict[var_key].dtype](ID.slice(ID_index + 1, end_val));
                    ID_index = end_val + 1;
                } else if (this.gui.get_length(var_options) > 79) {
                    if (ID[ID_index] !== "!") {
                        console.log(`WARNING: did not find ${var_key}`);
                        return {};
                    };
                    end_val = ID.indexOf("!", ID_index + 1);
                    setup_data[var_key] = var_options[Number(ID.slice(ID_index + 1, end_val))];
                    ID_index = end_val + 1;
                } else {
                    setup_data[var_key] = var_options[ID.charCodeAt(ID_index) - 48];
                    ID_index += 1;
                };
            };
        } catch(error) {
            console.log("WARNING: Invalid ID, ID incomplete");
            return {};
        };
        return setup_data;
    };

    get_price(ID, setup_data, action="buy", location="bazaar", force=false) {
        let multiplier = 1;
        if (location === "bazaar") {
            if (action === "buy") {
                location = md.bazaar_buy_types[setup_data["bazaar_buy_type"]];
            } else if (action === "sell") {
                location = md.bazaar_sell_types[setup_data["bazaar_sell_type"]];
                if (setup_data["bazaar_taxes"]) {
                    let bazaar_tax = 0.0125 - 0.00125 * setup_data["bazaar_flipper"];
                    if (setup_data["mayor"] === "Derpy") {
                        bazaar_tax *= 4;
                    };
                    if (setup_data["mayor"] === "Aura") {
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

    get_speed_boosts(minion, minion_fuel_id, upgrade_ids, afk_toggle, clock_override, setup_data) {
        let speed_boost = 0;
        speed_boost += md.itemList[minion_fuel_id]["speed_boost"];
        speed_boost += md.itemList[upgrade_ids[0]]["speed_boost"] + md.itemList[upgrade_ids[1]]["speed_boost"];
        speed_boost += md.itemList[setup_data["beacon"]]["speed_boost"] + md.itemList["MITHRIL_INFUSION"]["speed_boost"] * setup_data["infusion"];
        speed_boost += md.itemList["FREE_WILL"]["speed_boost"] * setup_data["free_will"] + md.itemList["POSTCARD"]["speed_boost"] * setup_data["postcard"];
        if (setup_data["potato_accessory"] !== "NONE" && (afk_toggle || clock_override) && (md.itemList[setup_data["potato_accessory"]]["affected_minions"].includes(minion))) {
            speed_boost += md.itemList[setup_data["potato_accessory"]]["speed_boost"];
        };
        if (setup_data["crystal"] !== "NONE") {
            if (md.itemList[setup_data["crystal"]]["affected_minions"].includes(minion)) {
                speed_boost += md.itemList[setup_data["crystal"]]["speed_boost"];
            };
        };
        if (setup_data["beacon"] !== "NONE" && setup_data["scorched"]) {
            speed_boost += md.itemList["SCORCHED_POWER_CRYSTAL"]["speed_boost"];
        };
        if (minion == "Inferno") {
            if (setup_data["rising_celsius_override"]) {
                speed_boost += 180;
            } else {
                speed_boost += 18 * Math.min(10, setup_data["amount"]);
            };
        };
        if (setup_data["mayor"] === "Cole" && (afk_toggle || clock_override) && md.affected_by_cole.includes(minion)) {
            speed_boost += 25;
        };
        if (minion_fuel_id === "EVERBURNING_FLAME" && md.itemList[minion_fuel_id]["upgrade_special"]["affected_minions"].includes(minion)) {
            speed_boost += md.itemList[minion_fuel_id]["upgrade_special"]["amount"];
        };
        const afkpet = setup_data["afkpet"];
        const afkpet_rarity = setup_data["afkpet_rarity"];
        const afkpet_lvl = setup_data["afkpet_lvl"];
        if ((afk_toggle || clock_override) && md.boost_pets[afkpet]["affects"].includes(minion) && afkpet_rarity in md.boost_pets[afkpet]) {
            speed_boost += md.boost_pets[afkpet][afkpet_rarity][0] + afkpet_lvl * md.boost_pets[afkpet][afkpet_rarity][1];
        };
        return speed_boost;
    };

    
    get_drop_multiplier(minion, minion_fuel_id, upgrade_ids, afk_toggle, setup_data) {
        let drop_multiplier = 1;
        if (afk_toggle && setup_data["player_harvests"] && !(["Fishing", "Pumpkin", "Melon"].includes(minion))) {
            if (["Zombie", "Revenant", "Voidling", "Inferno", "Vampire", "Skeleton", "Creeper", "Spider", "Tarantula", "Cave Spider", "Blaze", "Magma Cube", "Enderman", "Ghast", "Slime", "Cow", "Pig", "Chicken", "Sheep", "Rabbit"].includes(minion)) {
                drop_multiplier *= 1 + 15 * setup_data["player_looting"] / 100;
            };
            return drop_multiplier;
        };
        drop_multiplier *= md.itemList[minion_fuel_id]["drop_multiplier"];
        drop_multiplier *= md.itemList[upgrade_ids[0]]["drop_multiplier"];
        if (afk_toggle && drop_multiplier > 1) {
            // drop multiplier greater than 1 is rounded down while online
            drop_multiplier = int(drop_multiplier);
        };
        drop_multiplier *= md.itemList[upgrade_ids[1]]["drop_multiplier"];
        if (afk_toggle && drop_multiplier > 1) {
            drop_multiplier = int(drop_multiplier);
        };
        if (setup_data["mayor"] == "Derpy") {
            drop_multiplier *= 2;
        };
        return drop_multiplier;
    };
    
    get_actions_per_harvest(minion, upgrade_ids, afk_toggle, setup_data, setup_notes) {
        let actions_per_harvest = 2;
        if (minion === "Fishing") {
            // only has harvests actions
            actions_per_harvest = 1;
        };
        if (afk_toggle) {
            if (["Pumpkin", "Melon"].includes(minion)) {
                // pumpkins and melons are forced to regrow for minion to harvest
                actions_per_harvest = 1;
            };
            if (setup_data["player_harvests"]) {
                if (["Fishing", "Pumpkin", "Melon"].includes(minion)) {
                    setup_notes["Player Harvests"] = "Player Harvesting does not work with this minion";
                } else {
                    actions_per_harvest = 1;
                    if (minion === "Gravel") {
                        upgrade_ids.push("FLINT_SHOVEL");
                        setup_notes["Player Tools"] = "Assuming Player is using Flint Shovel";
                    };
                    if (minion === "Ice") {
                        setup_notes["Player Tools"] = "Assuming Player is using Silk Touch";
                    };
                };
            } else if (setup_data["special_layout"]) {
                if (["Cobblestone", "Mycelium", "Ice"].includes(minion)) {
                    // cobblestone generator, regrowing mycelium, freezing water
                    actions_per_harvest = 1;
                };
                if (["Flower", "Sand", "Red Sand", "Gravel"].includes(minion)) {
                    // harvests through natural means: water flushing, gravity
                    actions_per_harvest = 1;
                    // speedBonus -= 10  # only spawning has 10% action speed reduction, not confirmed yet.
                };
            };
        };
        return actions_per_harvest;
    };

    update_loot_table(minion, minion_fuel_id, upgrades, afk_toggle, setup_data) {
        if (['Oak', 'Spruce', 'Birch', 'Dark Oak', 'Acacia', 'Jungle'].includes(minion)) {
            if (afk_toggle) {
                // chopped trees have 4 blocks of wood, unknown why offline gives 3
                md.minionList[minion]["drops"][md.getID[`${minion} Log`]] = 4;
            } else {
                md.minionList[minion]["drops"][md.getID[`${minion} Log`]] = 3;
            };
        } else if (minion == "Gravel") {
            if (afk_toggle) {
                // vanilla minecraft chance for gravel to become flint
                md.minionList[minion]["drops"]["GRAVEL"] = 0.9;
                md.minionList[minion]["drops"]["FLINT"] = 0.1;
            } else {
                md.minionList[minion]["drops"]["GRAVEL"] = 1;
                md.minionList[minion]["drops"]["FLINT"] = 0;
            };
        } else if (minion == "Pumpkin") {
            if (afk_toggle) {
                // it just does this, idk, ask Hypixel
                md.minionList[minion]["drops"]["PUMPKIN"] = 1;
            } else {
                md.minionList[minion]["drops"]["PUMPKIN"] = 3;
            };
        } else if (minion == "Sheep") {
            if (upgrades.includes("ENCHANTED_SHEARS")) {
                md.minionList[minion]["drops"]["WOOL"] = 0;
            } else {
                md.minionList[minion]["drops"]["WOOL"] = 1;
            };
        } else if (minion == "Flower") {
            if (minion_fuel_id == "THORNY_VINES") {
                md.minionList[minion]["drops"] = { "WILD_ROSE": 2 };
            } else if (afk_toggle && setup_data["special_layout"]) {
                // tall flowers blocked by low ceiling
                md.minionList[minion]["drops"] = { "YELLOW_FLOWER": 0.35, "RED_ROSE": 0.15, "RED_ROSE:1": 0.5 / 8, "RED_ROSE:2": 0.5 / 8, "RED_ROSE:3": 0.5 / 8, "RED_ROSE:4": 0.5 / 8, "RED_ROSE:5": 0.5 / 8, "RED_ROSE:6": 0.5 / 8, "RED_ROSE:7": 0.5 / 8, "RED_ROSE:8": 0.5 / 8 };
            } else {
                md.minionList[minion]["drops"] = { "YELLOW_FLOWER": 0.35, "RED_ROSE": 0.15, "RED_ROSE:1": 0.5 / 11, "RED_ROSE:2": 0.5 / 11, "RED_ROSE:3": 0.5 / 11, "RED_ROSE:4": 0.5 / 11, "RED_ROSE:5": 0.5 / 11, "RED_ROSE:6": 0.5 / 11, "RED_ROSE:7": 0.5 / 11, "RED_ROSE:8": 0.5 / 11, "DOUBLE_PLANT:1": 0.5 / 11, "DOUBLE_PLANT:4": 0.5 / 11, "DOUBLE_PLANT:5": 0.5 / 11 };
            };
        } else if (minion == "Sunflower") {
            if (minion_fuel_id == "DAYSWITCH") {
                md.minionList[minion]["drops"] = { "DOUBLE_PLANT": 2 };
            } else if (minion_fuel_id == "NIGHTSWITCH") {
                md.minionList[minion]["drops"] = { "MOONFLOWER": 2 };
            } else {
                md.minionList[minion]["drops"] = { "DOUBLE_PLANT": 1, "MOONFLOWER": 1 };
            };
        };
        return;
    };

    get_seconds_per_action(minion, minion_tier, minion_fuel_id, speed_boost, setup_data) {
        let base_speed = md.minionList[minion]["speed"][minion_tier];
        let secondsPaction = base_speed / (1 + speed_boost / 100);
        if (minion_fuel_id == "INFERNO_FUEL") {
            secondsPaction /= 1 + md.inferno_fuel_data["grades"][setup_data["inferno_grade"]];
        };
        return secondsPaction;
    };

    get_time_constants(seconds_per_action, actions_per_harvest, setup_data) {
        let empty_time_seconds = this.gui.time_number(setup_data["empty_time_unit"], setup_data["empty_time_amount"], seconds_per_action * actions_per_harvest);
        let empty_time_str = `${setup_data["empty_time_amount"]} ${setup_data["empty_time_unit"]}`; 
        let scaled_time_str = `${setup_data["empty_time_amount"]} ${setup_data["empty_time_unit"]}`;
        let timeratio = 1;
        if (setup_data["scale_time"]) {
            let scaled_time_seconds = this.gui.time_number(setup_data["scaled_time_unit"], setup_data["scaled_time_amount"], seconds_per_action * actions_per_harvest);
            scaled_time_str = `${setup_data["scaled_time_amount"]} ${setup_data["scaled_time_unit"]}`;
            timeratio = scaled_time_seconds / empty_time_seconds;
        };
        return [empty_time_seconds, timeratio, empty_time_str, scaled_time_str];
    };

    get_harvests_per_time(empty_time_seconds, actions_per_harvest, seconds_per_action, afk_toggle, drop_multiplier, setup_data) {
        let harvests_per_time;
        if (setup_data["empty_time_unit"] == "Harvests") {
            harvests_per_time = setup_data["empty_time_amount"];
        } else {
            harvests_per_time = empty_time_seconds / (actions_per_harvest * seconds_per_action);
        };
        
        // drop multiplier online/offline mode
        if (!(afk_toggle)) {
            harvests_per_time *= drop_multiplier;
            drop_multiplier = 1;
        };
        return [harvests_per_time, drop_multiplier];
    };

    get_upgrade_info(upgrade_ids, drops_list) {
        let spreading_info = {};
        let replace_info = {};
        for (const upgrade of upgrade_ids) {
            let upgrade_type = md.itemList[upgrade]["upgrade_special"]["type"];
            if (upgrade_type.includes("spreading")) {
                for (let [item, amount] of Object.entries(md.itemList[upgrade]["upgrade_special"]["items"])) {
                    spreading_info[item] = amount;
                    drops_list[item] = 0;
                };
            };
            if (upgrade_type.includes("replace")) {
                Object.assign(replace_info, md.itemList[upgrade]["upgrade_special"]["replacement_list"]);
            };
        };
        return [spreading_info, replace_info];
    };

    add_drops(item, amount, drops_list, spreading_info=null, replace_info=null) {
        if (replace_info !== null && item in replace_info) {
            item = replace_info[item];
        };
        if (!(item in drops_list)) {
            drops_list[item] = 0;
        };
        drops_list[item] += amount;
        if (spreading_info !== null) {
            for (let [spreading_item, spreading_average] of Object.entries(spreading_info)) {
                drops_list[spreading_item] += amount * spreading_average;
            };
        };
        return;
    };

    get_base_drops(drops_list, spreading_info, replace_info, minion, harvests_per_time, drop_multiplier) {
        for (let [item, amount] of Object.entries(md.minionList[minion]["drops"])) {
            this.add_drops(item, harvests_per_time * amount * drop_multiplier, drops_list, spreading_info, replace_info);
        };
        return;
    };

    get_upgrade_drops(drops_list, spreading_info, minion, minion_tier, drop_multiplier, upgrade_ids, harvests_per_time, afk_toggle, empty_time_seconds, seconds_per_action) {
        for (const upgrade of upgrade_ids) {
            let upgrade_type = md.itemList[upgrade]["upgrade_special"]["type"];
            let specific_multiplier = 1;
            let effective_cooldown;
            if (upgrade_type == "add") {
                // adding upgrades are like Corrupt Soils
                if (afk_toggle) {
                    if ("CORRUPT_SOIL" == upgrade) {
                        if ("afkcorrupt" in md.minionList[minion]) {
                            // Certain mob minions get more corrupt drops when afking
                            // It is not a constant multiplier, it is equivalent in chance to the main drops of the minion
                            specific_multiplier = md.minionList[minion]["afkcorrupt"];
                        };
                        if (minion == "Chicken" && !(upgrade_ids.includes("ENCHANTED_EGG"))) {
                            // Online Chicken minion without Enchanted Egg does not make corrupt drops
                            specific_multiplier = 0;
                        };
                    };
                    if ("ENCHANTED_EGG" == upgrade) {
                        // Enchanted Eggs make one laid egg and one egg on kill while AFKing
                        // the egg on spawn is affected by drop multipliers and spreadings
                        this.add_drops("EGG", harvests_per_time * drop_multiplier, drops_list, spreading_info);
                    };
                    for (let [item, amount] of Object.entries(md.itemList[upgrade]["upgrade_special"]["items"])) {
                        this.add_drops(item, harvests_per_time * amount * specific_multiplier, drops_list);
                    };
                } else {
                    for (let [item, amount] of Object.entries(md.itemList[upgrade]["upgrade_special"]["items"])) {
                        this.add_drops(item, harvests_per_time * amount * specific_multiplier, drops_list, spreading_info);
                    };
                };
            } else if (upgrade_type == "cooldown") {
                // cooldown upgrades are like Soulflow Engines
                // formula for effective_cooldown still in research
                if (afk_toggle && upgrade == "LESSER_SOULFLOW_ENGINE" && upgrade_ids.includes("SOULFLOW_ENGINE")) {
                    continue;  // Soulflow Engine overrides Lesser Soulflow Engine while online
                };
                if (afk_toggle) {
                    effective_cooldown = 2 * seconds_per_action * (1 + Math.floor(Math.ceil(md.itemList[upgrade]["upgrade_special"]["cooldown"] / seconds_per_action) / 2));
                } else {
                    effective_cooldown = md.itemList[upgrade]["upgrade_special"]["offline_cooldown"];
                };
                if ("SOULFLOW_ENGINE" == upgrade && minion == "Voidling") {
                    specific_multiplier = 1 + 0.03 * minion_tier;  // correct most likely, needs testing
                };
                for (let [cooldown_item, cooldown_amount] of Object.entries(md.itemList[upgrade]["upgrade_special"]["items"])) {
                    this.add_drops(cooldown_item, specific_multiplier * cooldown_amount * empty_time_seconds / effective_cooldown, drops_list);
                };
            };
        };
        return;
    };

    get_inferno_drops(drops_list, spreading_info, replace_info, minion, minion_tier, minion_fuel, drop_multiplier, harvests_per_time, empty_time_seconds, afk_toggle, setup_data) {
        if (minion_fuel != "INFERNO_FUEL") {
            return;
        };
        // distilate drops
        const distilate = setup_data["inferno_distillate"];
        const distilate_item = md.inferno_fuel_data["distilates"][distilate][0];
        const amount_per = md.inferno_fuel_data["distilates"][distilate][1];
        const distillate_harvests = (harvests_per_time * 4) / 5;
        if (afk_toggle) {
            this.get_base_drops(drops_list, spreading_info, replace_info, minion, - distillate_harvests, drop_multiplier);
        } else {
            this.get_base_drops(drops_list, null, replace_info, minion, - distillate_harvests, drop_multiplier);
        };
        this.add_drops(distilate_item, distillate_harvests * amount_per, drops_list);

        // Hypergolic drops
        if (setup_data["inferno_grade"] == "HYPERGOLIC_GABAGOOL") { // hypergolic fuel stuff
            let multiplier = 1;
            if (setup_data["inferno_eyedrops"] === true) {  // Capsaicin Eyedrops
                multiplier = 1.3;
            };
            for (let [item, chance] of Object.entries(md.inferno_fuel_data["drops"])) {
                if (item == "INFERNO_APEX" && minion_tier >= 10) {  // Apex Minion perk
                    chance *= 2;
                };
                this.add_drops(item, multiplier * chance * harvests_per_time, drops_list);
            };
            this.add_drops("HYPERGOLIC_IONIZED_CERAMICS", empty_time_seconds / md.itemList[minion_fuel]["fuel_duration"], drops_list);
        };
        
        // calculate fuel cost
        let infernofuel_components = {
            "INFERNO_FUEL_BLOCK": 2,  // 2 inferno fuel blocks
            "CAPSAICIN_EYEDROPS_NO_CHARGES": Number(setup_data["inferno_eyedrops"])  // capsaicin eyedrops
        };
        infernofuel_components[distilate] = 6;  // 6 times distilate item
        infernofuel_components[setup_data["inferno_grade"]] = 1;  // 1 gabagool core
        let costPerInfernofuel = 0;
        for (let [component_ID, amount] of Object.entries(infernofuel_components)) {
            costPerInfernofuel += amount * this.get_price(component_ID, setup_data, "buy", "bazaar");
        };
        md.itemList["INFERNO_FUEL"]["prices"]["custom"] = costPerInfernofuel;
        // the fuel cost is put into the item data to be used later in the general fuel cost calculator
        return;
    };

    apply_compactor(drops_list, compacting_list) {
        let compacted_items = [];
        let compactables = Object.keys(drops_list);
        let item, amount, per_compacted, compacted_name, compacted_amount, left_over;
        while (compactables.length) {
            item = compactables.pop();
            if (!(item in compacting_list)) {
                continue;
            };
            amount = drops_list[item];
            per_compacted = compacting_list[item]["per"];
            if (amount < per_compacted) {
                continue;
            };
            compacted_name = compacting_list[item]["makes"];
            compacted_amount = Math.floor(amount / per_compacted);
            if ("amount" in compacting_list[item]) {
                compacted_amount *= compacting_list[item]["amount"];
            };
            left_over = amount % per_compacted;
            drops_list[item] = left_over;
            drops_list[compacted_name] = compacted_amount;
            compacted_items.push({"from": item, ...compacting_list[item]});
            if (compacted_name in compacting_list) {
                compactables.push(compacted_name);
            };
        };
        return compacted_items;
    };

    get_compacted_drops(drops_list, upgrades) {
        let compacted_items = [];
        for (let upgrade of upgrades) {
            if (md.itemList[upgrade]["upgrade_special"]["type"].includes("compact")) {
                compacted_items.push(...this.apply_compactor(drops_list, md.itemList[upgrade]["upgrade_special"]["compacting_list"]));
            };
        };
        return compacted_items;
    }

    get_available_storage(minion, minion_tier, setup_data) {
        let available_storage = md.itemList[setup_data["chest"]]["storage_slots"];
        if ("storage" in md.minionList[minion] && minion_tier in md.minionList[minion]["storage"]) {
            available_storage += md.minionList[minion]["storage"][minion_tier];
        } else {
            available_storage += md.standard_storage[minion_tier];
        };
        return available_storage;
    };

    get_used_storage(drops_list) {
        let used_storage_slots = 0;
        for (let amount of Object.values(drops_list)) {
            used_storage_slots += Math.ceil(amount / 64);  // hypixel does not care about smaller max stack sizes
        };
        return used_storage_slots;
    };

    get_fill_time(minion, available_storage) {
        // WIP
        return;
    };

    get_sell_location(setup_data) {
        let sellto = "NPC";
        let hopper_multiplier = 1;
        let minion_sell_loc = setup_data["sell_loc"];
        if (minion_sell_loc == "Bazaar") {
            sellto = "bazaar";
        } else if (minion_sell_loc == "Best (NPC/Bazaar)") {
            sellto = "best";
        } else if (minion_sell_loc == "Hopper") {
            hopper_multiplier = md.itemList[setup_data["hopper"]]["hopper_selling_rate"];
        };
        return [sellto, hopper_multiplier];
    };

    get_item_profit(sell_location, hopper_multiplier, drops_list, setup_data) {
        let item_profit = 0.0;
        let per_item_profit = {};
        let per_item_sell_location = {};
        let item_prices = {};
        for (let [itemtype, amount] of Object.entries(drops_list)) {
            this.gui.clear_object(item_prices);
            item_prices["NPC"] = this.get_price(itemtype, setup_data, "sell", "npc");
            item_prices["bazaar"] = this.get_price(itemtype, setup_data, "sell", "bazaar");
            // item_prices["custom"] = this.get_price(itemtype, setup_data, "sell", "custom", true)  // might use later
            if (sell_location in item_prices) {
                per_item_sell_location[itemtype] = sell_location;
            } else {
                per_item_sell_location[itemtype] = Object.keys(item_prices).reduce((a, b) => item_prices[a] > item_prices[b] ? a : b);  // https://stackoverflow.com/a/27376421
            };
            let final_price = item_prices[per_item_sell_location[itemtype]];
            per_item_profit[itemtype] = amount * final_price * hopper_multiplier;
            item_profit += amount * final_price;
        };
        item_profit *= hopper_multiplier;
        return [item_profit, per_item_profit, per_item_sell_location];
    };
    
    get_skill_xp(afk_toggle, mayor, drops_list, setup_data) {
        let skill_xp = {};
        for (let [itemtype, amount] of Object.entries(drops_list)) {
            let [xptype, value] = Object.entries(md.itemList[itemtype]["xp"])[0];
            if (value == 0) {
                continue;
            };
            if (!(xptype in skill_xp)) {
                skill_xp[xptype] = 0;
            };
            skill_xp[xptype] += amount * value * (1 + setup_data[xptype + "_wisdom"] / 100);
        };
        if (["Derpy", "Aura"].includes(mayor)) {
            this.gui.deepmultiply(skill_xp, 1.5);
        };
        if (afk_toggle && setup_data["player_harvests"] && "combat" in skill_xp) {
            delete skill_xp["combat"];
        };
        return skill_xp;
    };

    get_over_compacting(sell_location, compacted_items, per_item_sell_location, setup_notes, setup_data) {
        if (!(["best", "bazaar"].includes(sell_location))) {
            return;
        };
        let over_compacting = [];
        for (let item_data of compacted_items) {
            let item = item_data["from"];
            let compact_item = item_data["makes"];
            let per_compact = item_data["per"];
            let compact_amount = 1;
            if ("amount" in item_data) {
                compact_amount = item_data["amount"];
            };
            let cost = this.get_price(item, setup_data, "sell", per_item_sell_location[item]) * per_compact;
            let compact_cost = this.get_price(compact_item, setup_data, "sell", per_item_sell_location[compact_item]) * compact_amount;
            if (cost - compact_cost > this.compact_tolerance.get()) {
                over_compacting.push(md.itemList[item]['display']);
            };
        };
        if (this.gui.get_length(over_compacting) != 0) {
            setup_notes["Over-compacting"] = over_compacting.join(', ');
        };
        return;
    };

    get_pet_xp_boosts(pet, xp_type, setup_data, exp_share=false) {
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
        let petxpbonus = (1 + setup_data["taming"] / 100) * (1 + setup_data["beastmaster"] / 100) * non_matching;
        let pet_item;
        if ([xp_type, "all"].includes(md.itemList[setup_data["petxpboost"]]["exp_boost_type"])) {
            pet_item = 1 + md.itemList[setup_data["petxpboost"]]["exp_boost_amount"] / 100;
        } else {
            pet_item = 1;
        };
        if (setup_data["mayor"] === "Diana") {
            petxpbonus *= 1.35;
        };
        if (["mining", "fishing"].includes(xp_type)) {
            petxpbonus *= 1.5;
        };
        if (pet === "Reindeer") {
            petxpbonus *= 2;
        };
        if (xp_type === "combat" && setup_data["falcon_attribute"] !== 0) {
            petxpbonus *= (1 + setup_data["falcon_attribute"] / 100);
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

    get_pet_profit(skill_xp, mayor, setup_data) {
        let pet_profit = 0.0;
        let main_pet = setup_data["levelingpet"];
        if (main_pet == "None") {
            return [0, {}, {}];
        };
        let setup_pets = { "levelingpet": { "pet": main_pet, "pet_xp": {}, "levelled_pets": 0.0 } };
        for (const var_key of ["expsharepet", "expsharepetslot2", "expsharepetslot3"]) {
            if (setup_data[var_key] == "None" || (mayor != "Diana" && ["expsharepetslot2", "expsharepetslot3"].includes(var_key))) {
                continue;
            };
            setup_pets[var_key] = { "pet": setup_data[var_key], "pet_xp": { "exp_share": 0.0 }, "levelled_pets": 0.0 };
        };
        let pet_prices = {};
        let main_pet_xp = setup_pets["levelingpet"]["pet_xp"];
        let pet_xp_boost, xp_boost_pet_item, left_over_pet_xp, exp_share_pet, equiv_pet_xp_boost, equiv_xp_boost_pet_item, non_matching, dragon_xp_outputs;
        if (md.all_pets[main_pet]["rarity"].includes("Dragon")) {
            left_over_pet_xp = 0.0;
            for (let [skill, amount] of Object.entries(skill_xp)) {
                [pet_xp_boost, xp_boost_pet_item] = this.get_pet_xp_boosts(main_pet, skill, setup_data);
                dragon_xp_outputs = this.dragon_xp(amount, left_over_pet_xp, pet_xp_boost, xp_boost_pet_item);
                main_pet_xp[skill] = dragon_xp_outputs[0];
                left_over_pet_xp = dragon_xp_outputs[1];
            };
        } else {
            for (let [skill, amount] of Object.entries(skill_xp)) {
                [pet_xp_boost, xp_boost_pet_item] = this.get_pet_xp_boosts(main_pet, skill, setup_data);
                main_pet_xp[skill] = amount * pet_xp_boost * xp_boost_pet_item;
            };
        };
        let exp_share_boost = 0.2 * setup_data["taming"] + 10 * (mayor == "Diana") + setup_data["toucan_attribute"];
        let exp_share_item = 15 * setup_data["expshareitem"];
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            if (pet_slot == "levelingpet") {
                continue;
            };
            exp_share_pet = pet_info["pet"];
            if (md.all_pets[main_pet]["rarity"].includes("Dragon")) {
                if (exp_share_boost == 0) {
                    continue;
                };
                left_over_pet_xp = 0.0;
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
                    pet_info["pet_xp"]["exp_share"] += amount * ((exp_share_boost + exp_share_item) / 100) * non_matching;
                };
            };
        };
        let super_scrubber_price = this.get_price("SUPER_SCRUBBER", setup_data, "buy", "custom", true);
        let pets_levelled;
        for (let [pet_slot, pet_info] of Object.entries(setup_pets)) {
            pets_levelled = Object.values(pet_info["pet_xp"]).reduce((partialSum, a) => partialSum + a, 0) / md.max_lvl_pet_xp_amounts[md.all_pets[pet_info["pet"]]["rarity"]];
            setup_pets[pet_slot]["levelled_pets"] = pets_levelled;
            if (!(pet_info["pet"] in this.pet_costs)) {
                if (!(pet_info["pet"] in pet_prices)) {
                    pet_prices[pet_info["pet"]] = `Price for ${pet_info['pet']} not found`;
                };
            } else {
                pet_profit += pets_levelled * (this.pet_costs[pet_info["pet"]]["max"] - this.pet_costs[pet_info["pet"]]["min"]);
                if (!(pet_info["pet"] in pet_prices)) {
                    pet_prices[pet_info["pet"]] = `${this.gui.reduced_number(this.pet_costs[pet_info["pet"]]["min"])} - ${this.gui.reduced_number(this.pet_costs[pet_info["pet"]]["max"])}`;
                };
            };
            if (pet_slot == "levelingpet" && setup_data["petxpboost"] != "NONE") {
                pet_profit -= pets_levelled * (md.pet_item_scrub_cost[md.itemList[setup_data["petxpboost"]]["rarity"]] + super_scrubber_price);
            };
            if (pet_slot != "levelingpet" && setup_data["expshareitem"]) {
                pet_profit -= pets_levelled * (md.pet_item_scrub_cost[md.itemList["PET_ITEM_EXP_SHARE"]["rarity"]] + super_scrubber_price);
            };
        };
        return [pet_profit, setup_pets, pet_prices];
    };

    get_finite_fuel_cost(minion_amount, minion_fuel, empty_time_seconds, setup_data) {
        let fuel_cost = 0.0;
        let needed_fuel = 0.0;
        let beacon_fuel_ID;
        if (setup_data["beacon"] != "NONE") {
            if (setup_data["scorched"]) {
                beacon_fuel_ID = "SCORCHED_POWER_CRYSTAL";
            } else {
                beacon_fuel_ID = "POWER_CRYSTAL";
            };
            let cost_per_crystal = this.get_price(beacon_fuel_ID, setup_data, "buy", "bazaar");
            fuel_cost += empty_time_seconds * cost_per_crystal / md.itemList[beacon_fuel_ID]["fuel_duration"] * Number(!(setup_data["B_constant"]));
        };
        if (md.itemList[minion_fuel]["fuel_duration"] != -1) {
            let cost_per_fuel = this.get_price(minion_fuel, setup_data, "buy", "bazaar");
            needed_fuel = minion_amount * empty_time_seconds / md.itemList[minion_fuel]["fuel_duration"];
            fuel_cost += needed_fuel * cost_per_fuel;
        };
        return [fuel_cost, needed_fuel];
    };

    get_setup_cost(minion_type, minion_tier, minion_amount, minion_fuel, upgrades, setup_pets, setup_notes, setup_data) {
        let cost_per_part = {};
        let extra_cost = "";

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
                    if (this.gui.get_length(md.extraMinionCosts[minion_type][tier]) > 1 || !("COINS" in md.extraMinionCosts[minion_type][tier])) {
                        if (!(tier in tiered_extra_cost)) {
                            tiered_extra_cost[tier] = {};
                        };
                        for (const [cost_type, amount] of Object.entries(md.extraMinionCosts[minion_type][tier])) {
                            if (cost_type === "COINS") {
                                continue;
                            };
                            tiered_extra_cost[tier][this.gui.toTitleCase(cost_type.replace(/_/g, ' '))] = amount;
                        };
                    };
                };
            };
            for (let [item, amount] of Object.entries(md.minionCosts[minion_type][tier])) {
                if (!(item in cost_cache)) {
                    cost_cache[item] = this.get_price(item, setup_data, "buy", "bazaar");
                };
                tiered_coin_cost[tier] += amount * cost_cache[item];
            };
            if (tier != 1) {
                tiered_coin_cost[tier] += tiered_coin_cost[tier - 1];
            };
            if (tier - 1 in tiered_extra_cost) {
                if (!(tier in tiered_extra_cost)) {
                    tiered_extra_cost[tier] = {};
                };
                for (let [material, amount] of Object.entries(tiered_extra_cost[tier - 1])) {
                    if (!(material in tiered_extra_cost[tier])) {
                        tiered_extra_cost[tier][material] = 0;
                    };
                    tiered_extra_cost[tier][material] += amount;
                };
            };
        };
        if (this.gui.get_length(tiered_extra_cost) != 0) {
            setup_notes["Extra cost"] = Array.from(Object.keys(tiered_extra_cost[minion_tier]), material => `${tiered_extra_cost[minion_tier][material]} ${material}`).join(", ") + " per minion";
            extra_cost = Array.from(Object.keys(tiered_extra_cost[minion_tier]), material => `${tiered_extra_cost[minion_tier][material] * minion_amount} ${material}`).join(", ");
        };
        cost_per_part["minion"] = tiered_coin_cost[minion_tier];

        // Infinite fuel cost
        if (minion_fuel != "NONE" && md.itemList[minion_fuel]["fuel_duration"] == -1) {
            cost_per_part["fuel"] = this.get_price(minion_fuel, setup_data, "buy", "bazaar");
        };

        // Hopper cost
        if (setup_data["hopper"] != "NONE") {
            cost_per_part["hopper"] = this.get_price(setup_data["hopper"], setup_data, "buy", "bazaar");
        };

        // Internal minion upgrades cost
        for (let [i, upgrade] of Object.entries(upgrades)) {
            if (upgrade != "NONE") {
                cost_per_part[`upgrade${i + 1}`] = this.get_price(upgrade, setup_data, "buy", "bazaar");
            };
        };

        // Infusion cost
        if (setup_data["infusion"]) {
            cost_per_part["infusion"] = this.get_price("MITHRIL_INFUSION", setup_data, "buy", "bazaar");
        };

        // Free Will costs
        let free_will_price = this.get_price("FREE_WILL", setup_data, "buy", "bazaar");
        let postcard_price = this.get_price("POSTCARD", setup_data, "buy", "custom", true);
        let final_postcard_cost;
        if (postcard_price == 0) {
            // If no price found, use the free will price
            final_postcard_cost = free_will_price;
        } else {
            final_postcard_cost = postcard_price;
        };
        if (setup_data["free_will"]) {
            let tiered_free_will = {};
            for (const tier of tier_loop) {
                let free_wills_needed = 1 / (0.5 + 0.04 * (tier - 1));
                // for each failed Free Will we need another minion and we get a postcard
                // the last Free Will will not give a post card
                let free_wills_failed = free_wills_needed - 1;
                tiered_free_will[tier] = free_wills_failed * (tiered_coin_cost[tier] - final_postcard_cost) + free_wills_needed * free_will_price;
            };
            let optimal = Number(Object.keys(tiered_free_will).reduce((a, b) => tiered_free_will[a] < tiered_free_will[b] ? a : b));
            this.optimal_tier_free_will.set(optimal);
            setup_notes["Free Will"] = `per minion, apply ${this.gui.round_number(1 / (0.5 + 0.04 * (optimal - 1)))} Free Wills on Tier ${optimal}`;
            cost_per_part["free_will"] = tiered_free_will[optimal];
            this.freewillcost.set(cost_per_part["free_will"]);
        };

        // Storage Chest cost
        if (setup_data["chest"] != "NONE") {
            cost_per_part["chest"] = this.get_price(setup_data["chest"], setup_data, "buy", "bazaar");
        };
        
        // multiply by minion amount
        this.gui.deepmultiply(cost_per_part, minion_amount);

        // Beacon cost
        if (setup_data["beacon"] != "NONE" && !(setup_data["B_acquired"])) {
            cost_per_part["beacon"] = this.get_price(setup_data["beacon"], setup_data, "buy", "bazaar");
        };

        // Floating Crystal cost
        if (setup_data["crystal"] != "NONE") {
            cost_per_part["crystal"] = this.get_price(setup_data["crystal"], setup_data, "buy", "bazaar");
        };

        // Postcard cost
        if (setup_data["postcard"]) {
            cost_per_part["postcard"] = final_postcard_cost;
        };

        // Potato Talisman cost
        if (setup_data["potato_accessory"] != "NONE") {
            cost_per_part["potato_accessory"] = this.get_price(setup_data["potato_accessory"], setup_data, "buy", "custom", true);
        };

        // Pet Item costs
        for (let pet_slot of Object.keys(setup_pets)) {
            if (pet_slot == "levelingpet") {
                cost_per_part["petxpboost"] = this.get_price(setup_data["petxpboost"], setup_data, "buy", "custom", true);
            } else if (setup_data["expshareitem"]) {
                if (!("expshareitem" in cost_per_part)) {
                    cost_per_part["expshareitem"] = 0;
                };
                cost_per_part["expshareitem"] += this.get_price("PET_ITEM_EXP_SHARE", setup_data, "buy", "bazaar");
            };
        };

        // Attribute costs
        if (setup_data["toucan_attribute"] != 0) {
            cost_per_part["toucan_attribute"] = md.attribute_shards["Epic"][setup_data["toucan_attribute"]] * this.get_price("SHARD_TOUCAN", setup_data, "buy", "bazaar");
        };
        if (setup_data["falcon_attribute"] != 0) {
            cost_per_part["falcon_attribute"] = md.attribute_shards["Rare"][setup_data["falcon_attribute"]] * this.get_price("SHARD_FALCON", setup_data, "buy", "bazaar");
        };


        let total_cost = Object.values(cost_per_part).reduce((partialSum, a) => partialSum + a, 0);
        return [total_cost, extra_cost, cost_per_part];
    };

    async calculate(inGUI=false, setup_data=null, return_outputs=false) {
        if (inGUI === true) {
            this.statusC.style.background = "yellow";

            // auto update bazaar
            if (this.bazaar_auto_update.get()) {
                await this.update_prices(false);
            };
        };

        if (setup_data === null) {
            setup_data = this.get_from_GUI(this.ID_order);
        };

        // extracting often used minion constants
        let minion_type = setup_data["minion"];
        let minion_tier = setup_data["miniontier"];
        let minion_amount = setup_data["amount"];
        let minion_fuel = setup_data["fuel"];
        let mayor = setup_data["mayor"];
        let afk_toggle = setup_data["afk"];

        // create shared lists
        let setup_notes = {};
        let drops_list = {};

        // Enchanted Clock uses offline calculations, but you can be on the island when using it to apply boosts that require a loaded island.
        // This clock_override replaces afk_toggle for these boosts
        let clock_override = false;
        if (setup_data["enchanted_clock"] && afk_toggle) {
            afk_toggle = false;
            clock_override = true;
        };

        // list upgrades types
        let upgrades = [setup_data["upgrade1"], setup_data["upgrade2"]];

        // adding up minion speed bonus
        let speed_boost = this.get_speed_boosts(minion_type, minion_fuel, upgrades, afk_toggle, clock_override, setup_data);

        // multiply up minion drop bonus
        let drop_multiplier = this.get_drop_multiplier(minion_type, minion_fuel, upgrades, afk_toggle, setup_data);

        // AFKing, Special Layouts and Player Harvests influences
        let actions_per_harvest = this.get_actions_per_harvest(minion_type, upgrades, afk_toggle, setup_data, setup_notes);

        // AFK loot table changes
        this.update_loot_table(minion_type, minion_fuel, upgrades, afk_toggle, setup_data);

        // calculate final minion speed
        let seconds_per_action = this.get_seconds_per_action(minion_type, minion_tier, minion_fuel, speed_boost, setup_data);

        // time calculations
        let [empty_time_seconds, timeratio, empty_time_str, scaled_time_str] = this.get_time_constants(seconds_per_action, actions_per_harvest, setup_data);

        // harvests per time
        let harvests_per_time;
        [harvests_per_time, drop_multiplier] = this.get_harvests_per_time(empty_time_seconds, actions_per_harvest, seconds_per_action, afk_toggle, drop_multiplier, setup_data);

        // initialise drops list and get upgrade info
        let [spreading_info, replace_info] = this.get_upgrade_info(upgrades, drops_list);

        // base drops
        this.get_base_drops(drops_list, spreading_info, replace_info, minion_type, harvests_per_time, drop_multiplier);

        // upgrade drops
        this.get_upgrade_drops(drops_list, spreading_info, minion_type, minion_tier, drop_multiplier, upgrades, harvests_per_time, afk_toggle, empty_time_seconds, seconds_per_action);

        // Inferno minion fuel drops
        this.get_inferno_drops(drops_list, spreading_info, replace_info, minion_type, minion_tier, minion_fuel, drop_multiplier, harvests_per_time, empty_time_seconds, afk_toggle, setup_data);

        // Apply compactors
        let compacted_items = this.get_compacted_drops(drops_list, upgrades);

        // storage calculations
        let available_storage = this.get_available_storage(minion_type, minion_tier, setup_data);
        let used_storage = this.get_used_storage(drops_list);
        let fill_time = this.get_fill_time(minion_type, available_storage);
        
        // multiply drops by minion amount
        // all processes as calculated above should be linear with minion amount
        this.gui.deepmultiply(drops_list, minion_amount);

        // convert items into coins and xp
        // while keeping track where items get sold
        // it makes a list of all prices and takes the one that matches the choice of sellLoc
        let [sell_location, hopper_multiplier] = this.get_sell_location(setup_data);
        // Coins
        let [item_profit, per_item_profit, per_item_sell_location] = this.get_item_profit(sell_location, hopper_multiplier, drops_list, setup_data);
        // XP
        let skill_xp = this.get_skill_xp(afk_toggle, mayor, drops_list, setup_data);

        // Check for over-compacting
        this.get_over_compacting(sell_location, compacted_items, per_item_sell_location, setup_notes, setup_data);

        // Pet leveling calculations
        let [pet_profit, setup_pets, pet_prices] = this.get_pet_profit(skill_xp, mayor, setup_data);

        // calculating beacon and limited fuel cost
        let [fuel_cost, needed_fuel] = this.get_finite_fuel_cost(minion_amount, minion_fuel, empty_time_seconds, setup_data);

        // total profit
        let total_profit = item_profit + pet_profit - fuel_cost;

        // Setup cost
        let [total_cost, extra_cost, cost_per_part] = this.get_setup_cost(minion_type, minion_tier, minion_amount, minion_fuel, upgrades, setup_pets, setup_notes, setup_data);

        // Construct ID
        let setup_ID = this.construct_id(setup_data);

        // Get minion notes
        if ("notes" in md.minionList[minion_type]) {
            Object.assign(setup_notes, md.minionList[minion_type]["notes"]);
        };

        // collect outputs
        let outputs = {
            "pet_profit": pet_profit,
            "harvests": minion_amount * harvests_per_time,
            "itemtype_profit": per_item_profit,
            "items": drops_list,
            "item_profit": item_profit,
            "xp": skill_xp,
            "fuelcost": fuel_cost,
            "total_profit": total_profit,
            "fuelamount": needed_fuel,
            "pets_levelled": {}
        };
        for (let pet_slot of Object.keys(setup_pets)) {
            outputs["pets_levelled"][pet_slot] = setup_pets[pet_slot]["levelled_pets"];
        };

        this.gui.deepmultiply(outputs, timeratio);
        outputs["fuelamount"] = Math.ceil(outputs["fuelamount"] / minion_amount) * minion_amount;
        Object.assign(outputs, {
            "available_storage": available_storage,
            "item_sell_loc": per_item_sell_location,
            "ID_container": [setup_ID],
            "ID": setup_ID,
            "extracost": extra_cost,
            "setupcost": total_cost,
            "filltime": fill_time,
            "used_storage": used_storage,
            "empty_time": empty_time_str,
            "scaled_time": scaled_time_str,
            "actiontime": seconds_per_action,
            "notes": setup_notes,
            "used_pet_prices": pet_prices,
        });

        // Update GUI
        if (inGUI === true) {
            this.send_to_GUI(outputs);
            this.gui.clear_object(this.addons_output_container.list);
            for (let addon_name of Object.keys(this.addons_list)) {
                if (this.gui.get_value(`${addon_name}_auto_run`)) {
                    this.addons_list[addon_name].bind(add_ons)(this);
                };
            };
            this.update_listboxes();
            this.statusC.style.background = "green";
        };
        if (return_outputs) {
            return outputs;
        };
        return;
    };

    async init_prices() {
        let raw_bazaar_data = await this.gui.call_API("https://api.hypixel.net/v2/skyblock/bazaar", "Hypixel Bazaar API");
        if (!("success" in raw_bazaar_data) || raw_bazaar_data["success"] === false) {
            console.log("ERROR: Hypixel Bazaar API call was unsuccessful");
            return;
        };

        let raw_item_data = await this.gui.call_API("https://api.hypixel.net/resources/skyblock/items", "Hypixel Item API");
        if (!("success" in raw_bazaar_data) || raw_bazaar_data["success"] === false) {
            console.log("ERROR: Hypixel Item API call was unsuccessful");
            return;
        };
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
            if (item_id in raw_bazaar_data["products"]) {
                this.bazaar_items.push(item_id);
            } else if ("recipe" in md.itemList[item_id]) {
                this.recipe_items.push(item_id);
            } else if ("AH" in md.itemList[item_id] && md.itemList[item_id]["AH"]) {
                this.AH_items.push(item_id);
            };
        };
        await this.update_prices(false);
    };

    async call_bazaar() {
        let raw_bazaar_data = await this.gui.call_API("https://api.hypixel.net/v2/skyblock/bazaar", "Hypixel Bazaar API");
        if (!("success" in raw_bazaar_data) || raw_bazaar_data["success"] === false) {
            console.log("ERROR: Hypixel Bazaar API call was unsuccessful");
            return;
        };
        this.API_timer = raw_bazaar_data["lastUpdated"];
        this.bazaar_update_txt.set(this.gui.format_date(this.API_timer));
        // document.getElementById("bazaar_update_txt").innerHTML = this.variables["bazaar_update_txt"]["var"];
        let top_percent = 0.1;
        for (const item_id of this.bazaar_items) {
            if (!(item_id in raw_bazaar_data["products"])) {
                continue;
            };
            for (let action of ["buy", "sell"]) {
                let top_amount = top_percent * raw_bazaar_data["products"][item_id][`${action}_summary`].map(x => x["amount"]).reduce((partialSum, a) => partialSum + a, 0);
                if (top_amount === 0) {
                    md.itemList[item_id]["prices"][`${action}Price`] = 0;
                    if (!("npc" in md.itemList[item_id]["prices"])) {
                        console.log(`BAZAAR: no ${action} supply for ${item_id}`);
                    };
                    continue;
                };
                let counter = top_amount;
                let top_sum = 0;
                for (let order of raw_bazaar_data["products"][item_id][`${action}_summary`]) {
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
                let top_price = raw_bazaar_data["products"][item_id][`${action}_summary`][0]["pricePerUnit"];
                if (top_price / top_percent_avg_price >= 2.5) {
                    md.itemList[item_id]["prices"][`${action}Price`] = top_price;
                    console.log(`BAZAAR: bottom heavy ${action} supply for ${item_id}, taking top order price`);
                } else {
                    md.itemList[item_id]["prices"][`${action}Price`] = top_percent_avg_price;
                };
            };
        };
    };

    async call_auction_house(item_id) {
        let raw_auction_data = await this.gui.call_API("https://sky.coflnet.com/api/item/price/" + item_id + "/bin", "SkyCofl AH API")
        return (raw_auction_data["lowest"] + raw_auction_data["secondLowest"]) / 2;
    };

    update_recipe_price(item_id) {
        if (!(item_id in md.itemList)) {
            console.log(`ERROR: ${item_id} not in md.itemList`);
            return;
        };
        if (!("recipe" in md.itemList[item_id])) {
            console.log(`ERROR: ${item_id} is not a recipe item`);
            return;
        };
        md.itemList[item_id]["prices"]["buyPrice"] = 0;
        md.itemList[item_id]["prices"]["sellPrice"] = 0;
        for (let [material_id, amount] of Object.entries(md.itemList[item_id]["recipe"])) {
            if ("AH" in md.itemList[material_id]) {
                md.itemList[item_id]["prices"]["buyPrice"] += amount * md.itemList[material_id]["prices"]["custom"];
                md.itemList[item_id]["prices"]["sellPrice"] += amount * md.itemList[material_id]["prices"]["custom"];
                continue;
            };
            md.itemList[item_id]["prices"]["buyPrice"] += amount * md.itemList[material_id]["prices"]["buyPrice"];
            md.itemList[item_id]["prices"]["sellPrice"] += amount * md.itemList[material_id]["prices"]["sellPrice"];
        };
        return;
    };

    async update_prices(cooldown_warning=true) {
        if (Date.now() - this.API_timer < this.API_cooldown.get() * 1000 && this.API_timer !== 0) {
            if (cooldown_warning) {
                console.log("API: API is on cooldown");
            };
            return;
        };
        console.log("API: Updating Bazaar prices");
        await this.call_bazaar();
        console.log("API: Updating Auction House prices");
        for (const item_id of this.AH_items) {
            md.itemList[item_id]["prices"]["custom"] = await this.call_auction_house(item_id);
        };
        console.log("API: Updating Recipe prices");
        for (const item_id of this.recipe_items) {
            this.update_recipe_price(item_id);
        };
        return;
    };

    update_listboxes() {
        for (const var_key of Object.keys(this.var_dict)) {
            if (this.var_dict[var_key].dtype === "object") {
                if (var_key == "wisdom") {
                    continue;
                };
                if (var_key == "pets_levelled") {
                    this.pets_levelled.update_listbox(x => this.var_dict[x].get());
                    continue;
                };
                let format_function = x => x;
                if (this.var_dict[var_key].has_tag("item_ID_to_display")) {
                    format_function = x => md.itemList[x]["display"];
                };
                this.var_dict[var_key].update_listbox(format_function);
            };
        };
    };

    collect_addon_output(output_name, output_str) {
        this.addons_output_container.list[output_name] = output_str;
        this.addons_output_container.update_listbox();
        return;
    };

    edit_pet_price_redirect() {
        this.edit_pet_price_pet = this.edit_vars_output["edit_pet_price_pet"];
        if (!(this.edit_pet_price_pet in this.pet_costs)) {
            this.pet_costs[this.edit_pet_price_pet] = {"min": 0, "max": 0};
        };
        let initial_max = this.pet_costs[this.edit_pet_price_pet]["max"];
        let initial_min = this.pet_costs[this.edit_pet_price_pet]["min"];
        GUI.edit_vars.bind(this)(this.edit_pet_price_store.bind(this), {"min_price": {"dtype": "number", "display": "Level 1 price", "initial": initial_min, "options": null}, "max_price": {"dtype": "number", "display": "Max level price", "initial": initial_max, "options": null}}, false);
    };

    edit_pet_price_store() {
        this.pet_costs[this.edit_pet_price_pet]["max"] = this.edit_vars_output["max_price"];
        this.pet_costs[this.edit_pet_price_pet]["min"] = this.edit_vars_output["min_price"];
    };

};
