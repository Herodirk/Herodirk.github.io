class converter {
    constructor() {
        GUI.main = this;
        this.var_dict = {};
        this.huim = GUI;
        this.frames = {
            "inputs_grid": document.getElementById("inputs_grid"),
            "outputs_grid": document.getElementById("outputs_grid"),
        };

        this.version_options = [
            "1.2.0",
            "1.2.1"
        ];
        this.load_id = new Hvar({"huim": this.huim, "key": "load_id", "vtype": "input", "dtype": "string", "frame": "inputs_grid", "display": "Initial ID", "initial": ""});
        this.output_version = new Hvar({"huim": this.huim, "key": "output_version", "vtype": "input", "dtype": "string", "display": "Convert to", "frame": "inputs_grid", "initial": "1.2.1", "options": this.version_options});
        this.converted_id = new Hvar({"huim": this.huim, "key": "converted_id", "vtype": "output", "dtype": "string", "display": "Converted ID", "frame": "outputs_grid", "initial": ""});
        this.id_container = new Hvar({"huim": this.huim, "key": "id_container", "vtype": "output", "dtype": "object", "display": "ID", "frame": "outputs_grid", "widget_width": 35, "widget_height": 1, "initial": []});
        this.id_differences = new Hvar({"huim": this.huim, "key": "id_differences", "vtype": "output", "dtype": "object", "display": "Differences", "frame": "outputs_grid", "widget_width": 35, "widget_height": 10, "initial": {}})
        this.loaded_version_data = {}  // "version number": {"id_order": [...], "input_options": {...}}

        let convertB = this.huim.create_button("Convert", () => this.convert.bind(this)(true), false);
        let copyB = this.huim.create_button("Copy", () => this.copy_id.bind(this)(true), false);
        
        let inputLB = this.huim.genLabel("inputLB", "Inputs");
        let outputLB = this.huim.genLabel("outputLB", "Outputs");

        this.grids = {
            "inputs_grid": {
                "input_label": [null, inputLB],
                "load_id": null,
                "output_version": null,
                "convert_button": [null, convertB]
            },
            "outputs_grid": {
                "output_label": [null, outputLB],
                "converted_id": [this.converted_id.widget[0], this.id_container.widget[1]],
                "copy_button": [null, copyB],
                "id_differences": null
            }
        };
        for (let grid_key of Object.keys(this.grids)) {
            this.huim.fill_grid(this.huim.create_grid(this.grids[grid_key]), this.frames[grid_key]);
        };

        for (const var_key of Object.keys(this.var_dict)) {
            if (this.var_dict[var_key].initial !== null) {
                this.var_dict[var_key].set(this.var_dict[var_key].initial);
            };
        };
        return;
    };

    get_var_options(var_key, input_options) {
        let var_options = null;
        if (var_key in input_options) {
            if (input_options[var_key] instanceof Array) {
                var_options = input_options[var_key];
            } else if (typeof input_options[var_key] === "string") {
                var_options = Object.keys(input_options[input_options[var_key]]);
            } else {
                var_options = Object.keys(input_options[var_key]);
            };
        };
        return var_options;
    };

    async convert() {
        let input_data = this.huim.get_from_GUI(["load_id", "output_version"])
        let initial_id = input_data["load_id"];
        let [initial_version, template] = await this.decode_id(initial_id);
        if (initial_version === "ERROR") {
            this.huim.send_to_GUI({"id_container": [template]});
            this.update_listboxes();
            return;
        }
        let new_version = input_data["output_version"];
        let new_version_data = await this.load_version_data(new_version);
        let var_options;
        let differences = {};
        for (const var_key of new_version_data["id_order"]) {
            var_options = this.get_var_options(var_key, new_version_data["input_options"]);
            if (!(var_key in template)) {
                differences[var_key] = "missing";
                if (var_options === null) {
                    template[var_key] = 0;
                } else {
                    template[var_key] = var_options[0];
                };
            } else {
                if (var_options !== null && !(var_options.includes(template[var_key]))) {
                    differences[var_key] = "unavailable option"
                    template[var_key] = var_options[0];
                };
            };
        };
        let new_setup_id = this.construct_id(template, new_version, new_version_data);
        let output_data = {
            "converted_id": new_setup_id,
            "id_container": [new_setup_id],
            "id_differences": differences
        };
        this.huim.send_to_GUI(output_data);
        this.update_listboxes();
        return;
    };

    copy_id() {
        try {
            navigator.clipboard.writeText(this.converted_id.get());
        } catch(error) {
            if (error.name === "NotAllowedError") {
                console.log("Not allowed to write to clipboard, outputting output here instead:");
            } else {
                console.log("Unknown Error", error);
            };
            console.log(crafted_string);
        };
        return;
    };

    async load_version_data(version) {
        if (version in this.loaded_version_data) {
            return this.loaded_version_data[version];
        };
        let id_order = await this.huim.call_API(`https://herodirk.github.io/minion/calculator/setup_id_converter/calculator_version_data/v${version}/id_order.json`, "Herodirk Github ID Order");
        let input_options = await this.huim.call_API(`https://herodirk.github.io/minion/calculator/setup_id_converter/calculator_version_data/v${version}/input_options.json`, "Herodirk Github Input Options");
        this.loaded_version_data[version] = {};
        this.loaded_version_data[version]["id_order"] = id_order;
        this.loaded_version_data[version]["input_options"] = input_options;
        return this.loaded_version_data[version];
    };

    construct_id(setup_data, version, version_data) {
        let val;
        let index;
        let ID_order = version_data["id_order"];
        let input_options = version_data["input_options"];
        let setup_id = version + "!";
        for (const var_key of ID_order) {
            val = setup_data[var_key];
            let var_options = this.get_var_options(var_key, input_options);
            if (var_options === null) {
                if (parseInt(val) === val) {
                    val = parseInt(val);
                };
                setup_id += "!" + String(val) + "!";
            } else if (this.huim.get_length(var_options) > 79) {
                index = var_options.indexOf(val);
                setup_id += "!" + String(index) + "!";
            } else {
                index = var_options.indexOf(val);
                setup_id += String.fromCharCode(48 + index);
            };
        };
        return setup_id;
    };

    async decode_id(setup_id) {
        if (!(setup_id instanceof String)) {
            setup_id = String(setup_id);
        };
        let setup_data = {};
        let end_ver = setup_id.indexOf("!");
        let ID_version;
        let end_val;
        if (end_ver === -1) {
            return ["ERROR", "Invalid setup ID, could not find version number"];
        };
        try {
            ID_version = setup_id.slice(0, end_ver);
        } catch(Exception) {
            return ["ERROR", "Invalid setup ID, could not find version number"];
        };
        let ID_index = end_ver + 1;
        let version_data = await this.load_version_data(ID_version);
        let ID_order = version_data["id_order"];
        let input_options = version_data["input_options"];
        try {
            for (const var_key of ID_order) {
                let var_options = this.get_var_options(var_key, input_options);
                if (var_options === null) {
                    if (setup_id[ID_index] !== "!") {
                        return ["ERROR", `Invalid setup ID, did not find ${var_key}`];
                    };
                    end_val = setup_id.indexOf("!", ID_index + 1);
                    setup_data[var_key] = setup_id.slice(ID_index + 1, end_val);
                    ID_index = end_val + 1;
                } else if (this.huim.get_length(var_options) > 79) {
                    if (setup_id[ID_index] !== "!") {
                        return ["ERROR", `Invalid setup ID, did not find ${var_key}`];
                    };
                    end_val = setup_id.indexOf("!", ID_index + 1);
                    setup_data[var_key] = var_options[Number(setup_id.slice(ID_index + 1, end_val))];
                    ID_index = end_val + 1;
                } else {
                    setup_data[var_key] = var_options[setup_id.charCodeAt(ID_index) - 48];
                    ID_index += 1;
                };
            };
        } catch(error) {
            console.log(error)
            return ["ERROR", "Invalid setup ID, ID incomplete"];
        };
        return [ID_version, setup_data];
    };

    update_listboxes() {
        this.id_container.update_listbox();
        this.id_differences.update_listbox();
        return;
    };
};