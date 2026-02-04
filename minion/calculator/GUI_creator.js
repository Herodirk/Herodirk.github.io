class GUI_creator {
    constructor() {
        this.switches = {};
        this.reduced_amounts = {0: "", 1: "k", 2: "M", 3: "B", 4: "T", 5: "Qd"}
        this.reduced_amounts_length = 6
        this.current_color_palette = "dark_red"
        this.color_palettes = {
            "dark": {
                "background": "#000000",
                "frame_background": "#313338",
                "controls_frame": "#7C7C7C",
                "widget_background": "#383A40",
                "widget_border": "#2E3035",
                "active_background": "#2E3035",
                "text": "#FFFFFF",
                "selected_text": "#000000",
                "selection": "#DBDBDB",
            },
            "dark_red": {
                "background": "#000000",
                "frame_background": "#100808",
                "controls_frame": "#662626",
                "widget_background": "#441313",
                "widget_border": "#2C0C0C",
                "active_background": "#2C0C0C",
                "text": "#FFFFFF",
                "selected_text": "#000000",
                "selection": "#DBDBDB",
            },
            "light": {
                "background": "#000000",
                "frame_background": "#FFFFFF",
                "controls_frame": "#FFCF4B",
                "widget_background": "#FFCA8E",
                "widget_border": "#FF9E4F",
                "active_background": "#FF9E4F",
                "text": "#000000",
                "selected_text": "#000000",
                "selection": "#DBDBDB",
            },
            "gray_text": {
                "background": "#000000",
                "frame_background": "#200808",
                "controls_frame": "#662626",
                "widget_background": "#541313",
                "widget_border": "#3C0C0C",
                "active_background": "#3C0C0C",
                "text": "#CACACA",
                "selected_text": "#000000",
                "selection": "#DBDBDB",
            },
        };
        this.palette_names = {"Dark": "dark", "Dark Red": "dark_red", "Light": "light", "Gray Text": "gray_text"}
    };


    // Color Palette

    update_color_palette() {
        let new_color_palette = this.palette_names[this.main.variables["color_palette"]["var"]];
        if (new_color_palette === this.current_color_palette) {
            return;
        };
        let css_root = document.querySelector(':root');
        for (let [setting, value] of Object.entries(this.color_palettes[new_color_palette])) {
            css_root.style.setProperty(`--${setting}`, value);
        };
        this.current_color_palette = new_color_palette;
    };


    // Variable and Widget creation

    genLabel(id, text, html=false) {
        let span_elem = document.createElement("span");
        if (id !== null) {
            span_elem.id = id;
        }
        if (html) {
            span_elem.innerHTML = text;
        } else {
            span_elem.innerText = text;
        }
        span_elem.className = "label";
        if (text === "\n") {
            span_elem.style.width = "0"
        } else if (text === "") {
            span_elem.style.width = "0"
            span_elem.style.height = "0"
        }
        return span_elem;
    };

    def_input_var(id, dtype, L_text=null, initial=null, options=null, cmd=null) {
        let input_elem;
        if (dtype !== "boolean") {
            if (options !== null) {
                input_elem = this.create_dropdownMenu(options);
            } else {
                input_elem = document.createElement("input");
                input_elem.type = "text";
            };
            if (initial !== null){
                input_elem.value = initial;
            };
        } else {
            input_elem = document.createElement("input");
            input_elem.type = "checkbox";
            input_elem.className = "check";
            if (initial !== null){
                input_elem.checked = initial;
            };
        };
        if (typeof cmd == "function") {
            input_elem.addEventListener('change', cmd);
        };
        input_elem.id = id;
        if (L_text !== null) {
            let label_elem = this.genLabel(id + "_label", L_text);
            return [label_elem, input_elem];
        } else {
            return input_elem;
        };
    };
    
    create_dropdownMenu(options) {
        let select_elem = document.createElement("select");
        let option_elem;
        let options_list;
        if (options instanceof Array) {
            options_list = options;
        } else {
            options_list = Object.keys(options);
        };
        select_elem.style.width = (2.5 + 0.5 * Math.max(...(options_list.map(el => String(el).length)))) + "em";
        for (let option of options_list) {
            option_elem = document.createElement("option");
            option_elem.text = option;
            select_elem.add(option_elem);
        };
        return select_elem;
    };
    
    // Controls
    create_button(text, command, control=false) {
        let button_elem = document.createElement("button");
        button_elem.type = "button";
        button_elem.innerHTML = text;
        button_elem.onclick = command;
        if (control) {
            button_elem.className = "control_button";
        } else {
            button_elem.className = "button";
        };
        return button_elem;
    };
    
    // Outputs
    def_output_var(id, dtype=null, L_text=null, initial=null, w=null, h=null) {
        let output_elem = document.createElement("span");
        if (dtype === "object") {
            let list_elem = document.createElement("UL");
            list_elem.className = "output_list";
            list_elem.style = `width:${w * 0.5}em; height:${h}em`;
            list_elem.id = id;
            output_elem.id = id + "_list_box"
            output_elem.appendChild(list_elem);
        } else {
            output_elem.id = id;
            if (initial !== null){
                output_elem.innerText = initial;
            };
        };
        if (L_text !== null) {
            let label_elem = this.genLabel(id + "_label", L_text);
            return [label_elem, output_elem];
        } else {
            return output_elem;
        };
    };


    // Placing Elements
    fill_list_box(id, lines=[]) {
        let output_elem = document.getElementById(id);
        output_elem.innerHTML = "";
        for (const line of lines) {
            let list_elem = document.createElement("li");
            list_elem.appendChild(document.createTextNode(line));
            output_elem.appendChild(list_elem);
        };
    };
    
    create_grid(grid_dict) {
        let grid_arr = [];
        for (let [key, val] of grid_dict) {
            if (val === null) {
                grid_arr.push([key, this.main.var_dict[key].widget]);
            } else {
                grid_arr.push([key, val]);
            };
        };
        return grid_arr
    };
    
    fill_grid(grid_rows, frame) {
        let filler_column_counter;
        for (let [row_key, row] of grid_rows) {
            filler_column_counter = 1;
            while (row.length < 3) {
                row.push(this.genLabel(row_key + "_filler_" + String(filler_column_counter), "\n"));
                filler_column_counter += 1;
            };
            for (let column of row) {
                if (column === null) {
                    column = this.genLabel(null, "\n");
                };
                frame.appendChild(column);
            };
        };
    };
    
    fill_arr(objs, frame) {
        for (let obj of objs) {
            frame.appendChild(obj);
        };
        return;
    };


    // Switch management

    def_switch(ID, obj, control=null, negate=false, initial=true) {
        this.switches[ID] = {"state": initial, "obj": obj, "control": control, "negate": negate};
        let objs;
        if (initial === false) {
            if (obj instanceof Array) {
                objs = obj;
            } else {
                objs = [obj];
            };
            for (let widget of objs) {
                document.getElementById(widget).hidden = true;
                for (let suffix of ["_label", "_output_switch", "_list_box", "_filler_1", "_filler_2"]) {
                    if (document.getElementById(widget + suffix) !== null) {
                        document.getElementById(widget + suffix).hidden = true;
                    };
                };
            };
        };
    };
    
    toggle_switch(ID, control=null) {
        let state = this.switches[ID]["state"];
        let objs
        if (control !== null) {
            if (this.switches[ID]["negate"]) {
                if (state !== (control === this.switches[ID]["control"])) {
                    return;
                };
            } else {
                if (state === (control === this.switches[ID]["control"])) {
                    return;
                };
            };
        };
        if (this.switches[ID]["obj"] instanceof Array) {
            objs = this.switches[ID]["obj"];
        } else {
            objs = [this.switches[ID]["obj"]];
        };
        if (state === true) {
            for (let obj of objs) {
                document.getElementById(obj).hidden = true;
                for (let suffix of ["_label", "_output_switch", "_list_box", "_filler_1", "_filler_2"]) {
                    if (document.getElementById(obj + suffix) !== null) {
                        document.getElementById(obj + suffix).hidden = true;
                    };
                };
            };
            this.switches[ID]["state"] = false;
        } else {
            for (let obj of objs) {
                document.getElementById(obj).hidden = false;
                for (let suffix of ["_label", "_output_switch", "_list_box", "_filler_1", "_filler_2"]) {
                    if (document.getElementById(obj + suffix) !== null) {
                        document.getElementById(obj + suffix).hidden = false;
                    };
                };
            };
            this.switches[ID]["state"] = true;
        };
    };
    
    create_switch_call(ID, controlvar=null) {
        if (controlvar === null) {
            return () => this.toggle_switch(ID, null);
        } else {
            return () => this.toggle_switch(ID, this.get_value(controlvar));
        };
    };

    create_show_hide_toggle(ID) {
        let button;
        if (typeof ID === "string") {
            button = this.create_button("Toggle extra options", this.create_switch_call(ID).bind(this));
        } else if (typeof ID === "function") {
            button = this.create_button("Toggle extra options", ID);
        };
        button.style.width = "10em";
        return button;
    };


    // Data requests

    async call_API(api_url, api_name="API"){
        try {
            const f = await fetch(api_url);
            var raw_data = await f.json();
        } catch(error) {
            console.log(`ERROR: Could not finish ${api_name} call`);
            console.log(error);
            return;
        };
        return raw_data;
    };


    // Data management
    deepmultiply(obj, multiplier) {
        let keys = Object.keys(obj);
        for (const key of keys) {
            if (typeof(obj[key]) === "object") {
                this.deepmultiply(obj[key], multiplier);
            } else if (typeof(obj[key]) === "string") {
                continue;
            } else {
                obj[key] *= multiplier;
            };
        };
        return;
    };

    time_number(time_unit, time_amount, custom_time_unit_seconds=1.0) {
        if (time_unit === "Years") {
            return 31536000 * time_amount;
        } else if (time_unit === "Weeks") {
            return 604800 * time_amount;
        } else if (time_unit === "Days") {
            return 86400 * time_amount;
        } else if (time_unit === "Hours") {
            return 3600 * time_amount;
        } else if (time_unit === "Minutes") {
            return 60 * time_amount;
        } else if (time_unit === "Seconds") {
            return 1 * time_amount;
        } else {
            return custom_time_unit_seconds * time_amount;
        };
    };

    get_value(id) {
        let value;
        if (!(["input", "select"].includes(document.getElementById(id).tagName.toLowerCase()))) {
            return null;
        };
        if (document.getElementById(id).type === "checkbox") {
            value = document.getElementById(id).checked;
        } else {
            value = document.getElementById(id).value;
        };
        if (typeof value === "string") {
            if (!isNaN(value) && !isNaN(parseFloat(value))) {
                return Number(value);
            };
        };
        return value;
    };

    set_value(id, value) {
        if (!(["input", "select"].includes(document.getElementById(id).tagName.toLowerCase()))) {
            return;
        };
        if (document.getElementById(id).type === "checkbox") {
            document.getElementById(id).checked = value;
        } else {
            document.getElementById(id).value = value;
        };
        return;
    };

    clear_object(obj) {
        if (obj instanceof Array) {
            obj.splice(0, obj.length);
        } else {
            Object.keys(obj).forEach(prop => delete obj[prop]);
        };
    };

    get_length(obj) {
        if (obj instanceof Array || obj instanceof String) {
            return obj.length;
        } else {
            return Object.keys(obj).length;
        };
    };

    round_number(number, decimal=2) {
        number *= Math.pow(10, decimal);
        number = Math.round(number);
        number /= Math.pow(10, decimal);
        return number;
    };

    reduced_number(number, decimal=2) {
        if (number === 0.0) {
            return "0";
        } else if (Math.abs(number) < 1) {
            return String(this.round_number(number, decimal - 1 + Math.trunc(Math.abs(Math.floor(Math.log10(Math.abs(number)))))));
        };
        let highest_reduction = Math.min(Math.trunc(Math.floor(Math.log10(Math.abs(number))) / 3), this.reduced_amounts_length - 1);
        let reduced = this.round_number((number / (Math.pow(10, 3 * highest_reduction))), decimal);
        let output_string = `${reduced}${this.reduced_amounts[highest_reduction]}`;
        return output_string;
    };

    toTitleCase(str) {
        // source: https://stackoverflow.com/a/196991
        return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
    };

    edit_vars(exit_function, variables=[], existing_variables=true) {
        // Called as the calculator class
        let dialog_elem = document.getElementById("edit_vars_dialog");
        if (dialog_elem.hasAttribute("open")) {
            return;
        }
        let confirm_button = document.getElementById("edit_confirm_button");
        let grid_frame = document.getElementById("edit_vars_grid");
        grid_frame.innerHTML = "";
        let elements = {}
        if (existing_variables) {
            for (let var_key of variables) {
                elements[var_key] = this.gui.def_input_var(`${var_key}_edit`, this.var_dict[var_key].dtype, `${this.var_dict[var_key].get_display()}:`, this.var_dict[var_key].get(false), this.var_dict[var_key].options, null);
            };
        } else {
            for (let [var_key, var_data] of Object.entries(variables)) {
                elements[var_key] = this.gui.def_input_var(`${var_key}_edit`, var_data["dtype"], `${var_data["display"]}:`, var_data["initial"], var_data["options"], null);
            };
        };
        this.gui.fill_grid(Object.entries(elements), grid_frame);
        
        if (confirm_button === null) {
            confirm_button = this.gui.create_button("Close", null, true);
            confirm_button.id = "edit_confirm_button";
            document.getElementById("edit_vars_controls").appendChild(confirm_button);
        };
        confirm_button.onclick = () => this.gui.edit_confirm.bind(this)(exit_function, variables, existing_variables);
        dialog_elem.show();
    };
    
    edit_confirm(exit_function, variables=[], existing_variables=true) {
        // Called as the calculator class
        let dialog_elem = document.getElementById("edit_vars_dialog");
        let inputted_value;
        if (existing_variables) {
            for (let var_key of variables) {
                inputted_value = this.gui.get_value(`${var_key}_edit`)
                this.var_dict[var_key].set(inputted_value);
            };
        } else {
            this.gui.clear_object(this.edit_vars_output);
            for (let var_key of Object.keys(variables)) {
                inputted_value = this.gui.get_value(`${var_key}_edit`)
                this.edit_vars_output[var_key] = inputted_value;
            };
        };
        
        dialog_elem.close()
        if (exit_function !== null) {
            exit_function();
        };
        return;
    };
};


// Hero Variable Manager
class Hvar {
    constructor(data_input) {
        // asking for one object as functions arguments so they do not need to be ordered when calling
        let defaults = {"frame": null, "fancy_display": null, "widget_width": null, "widget_height": null, "options": null, "command": null, "switch_initial": null, "checkbox_text": null, "tags": null}
        let inputted_data = {...defaults, ...data_input}
        this.huim = inputted_data["huim"];
        this.key = inputted_data["key"];
        if (this.key in this.huim.main.var_dict) {
            console.log(`${this.key} already exists in variable dictionary, overwriting it`);
        };
        this.huim.main.var_dict[this.key] = this;
        // Mandatory data:
        this.vtype = inputted_data["vtype"];
        this.dtype = inputted_data["dtype"];
        this.name_display = inputted_data["display"];
        this.initial = inputted_data["initial"];

        // Optional data:
        this.frame = inputted_data["frame"];
        this.fancy_name_display = inputted_data["fancy_display"];
        if (this.dtype === "boolean") {
            this.options = [false, true];
        } else {
            this.options = inputted_data["options"];
        };
        this.command = inputted_data["command"];
        this.switch_initial = inputted_data["switch_initial"];
        this.widget_width = inputted_data["widget_width"];
        this.widget_height = inputted_data["widget_height"];
        this.checkbox_text = inputted_data["checkbox_text"];
        this.tags = inputted_data["tags"];

        // Generated data:
        this.var = null;
        this.list = null;
        if (this.dtype === "object") {
            this.list = this.initial;
        };
        this.widget = null;
        this.translation = null;
        if (this.options !== null && !(this.options instanceof Array)) {
            this.translation = this.options;
            this.options = Object.keys(this.options);
        };

        if (this.vtype === "input") {
            this.widget = this.huim.def_input_var(this.key, this.dtype, `${this.name_display}: `, this.initial, this.options, this.command);
        } else if (this.vtype === "output") {
            this.widget = this.huim.def_output_var(this.key, this.dtype, `${this.name_display}: `, this.initial, this.widget_width, this.widget_height);
        } else if (this.vtype === "storage") {
            this.var = this.initial;
        };
        if (this.switch_initial !== null) {
            this.widget.push(this.huim.def_input_var(`${this.key}_output_switch`, "boolean", null, this.switch_initial));
        };
    };

    get(translate=true) {
        let val;
        if (this.vtype === "storage") {
            val = this.var;
        } else {
            val = this.huim.get_value(this.key);
        };
        if ((self.translation === null) || (translate === false)) {
            return val;
        } else {
            return this.translation[val];
        };
    };

    get_display(fancy=false) {
        if (fancy === true && this.fancy_name_display !== null) {
            return this.fancy_name_display;
        };
        return this.name_display;
    };

    get_output_switch() {
        if (this.switch_initial === null) {
            return null;
        };
        return this.huim.get_value(`${this.key}_output_switch`);
    };

    has_tag(tag) {
        if (this.tags === null) {
            return false;
        };
        return (this.tags.includes(tag));
    };

    set(value) {
        if (this.vtype === "storage") {
            this.var = value;
        } else {
            this.huim.set_value(this.key, value);
        };
        return;
    };

    update_listbox(key_format_function= x => x, value_format_function= x => x, filter= (key, val) => true) {
        if (this.dtype !== "object") {
            return;
        };
        let listbox_list = [];
        if (this.list instanceof Array) {
            for (const val of this.list) {
                if (!(filter(null, val))) {
                    continue;
                };
                listbox_list.push(key_format_function(val));
            };
        } else {
            for (const [key, val] of Object.entries(this.list)) {
                if (!(filter(key, val))) {
                    continue;
                };
                listbox_list.push(`${key_format_function(key)}: ${value_format_function(val)}`);
            };
        };
        this.huim.fill_list_box(this.key, listbox_list);
        return;
    };
};