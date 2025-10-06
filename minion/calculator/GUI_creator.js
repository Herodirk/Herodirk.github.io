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
        let new_color_palette = this.palette_names[this.calc.variables["color_palette"]["var"]];
        if (new_color_palette === this.current_color_palette) {
            return;
        };
        let css_root = document.querySelector(':root');
        for (let [setting, value] of Object.entries(this.color_palettes[new_color_palette])) {
            css_root.style.setProperty(`--${setting}`, value);
        };
        this.current_color_palette = new_color_palette;
    };

    // Label
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


    // Variable editing
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

    // Inputs
    defVarI(id, dtype, L_text=null, initial=null, options=[], cmd=null) {
        let input_elem;
        if (dtype !== "boolean") {
            if (options.length !== 0) {
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
    defVarO(id, L_text=null, initial=null) {
        let output_elem = document.createElement("span");
        output_elem.id = id;
        if (initial !== null){
            output_elem.innerText = initial;
        };
        if (L_text !== null) {
            let label_elem = this.genLabel(id + "_label", L_text);
            return [label_elem, output_elem];
        } else {
            return output_elem;
        };
    };
    
    defListO(id, L_text, h, w){
        let list_box = document.createElement("span");
        let list_elem = document.createElement("UL");
        list_elem.className = "output_list";
        list_elem.style = `width:${w * 0.5}em; height:${h}em`;
        list_elem.id = id;
        list_box.id = id + "_list_box"
        list_box.appendChild(list_elem);
        if (L_text !== null) {
            let label_elem = this.genLabel(id + "_label", L_text);
            return [label_elem, list_box];
        } else {
            return list_box;
        };
    };
    
    // Switches
    defSwitch(ID, obj, control=null, negate=false, initial=true) {
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
    
    toggleSwitch(ID, control=null) {
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
    
    createSwitchCall(ID, controlvar=null) {
        if (controlvar === null) {
            return () => this.toggleSwitch(ID, null);
        } else {
            return () => this.toggleSwitch(ID, this.get_value(controlvar));
        };
    };

    createShowHideToggle(ID) {
        let button;
        if (typeof ID === "string") {
            button = this.create_button("Toggle extra options", this.createSwitchCall(ID).bind(this));
        } else if (typeof ID === "function") {
            button = this.create_button("Toggle extra options", ID);
        };
        button.style.width = "10em";
        return button;
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

    fill_arr(objs, frame) {
        for (let obj of objs) {
            frame.appendChild(obj);
        }
        return
    }

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

    // Getting special inputs
    edit_vars(exit_function, variables=[], this_variables=true) {
        // Called as the calculator class
        let dialog_elem = document.getElementById("edit_vars_dialog");
        if (dialog_elem.hasAttribute("open")) {
            return;
        }
        let confirm_button = document.getElementById("edit_confirm_button");
        let grid_frame = document.getElementById("edit_vars_grid");
        grid_frame.innerHTML = "";
        let elements = {}
        if (this_variables) {
            for (let var_key of variables) {
                elements[var_key] = this.gui.defVarI(`${var_key}_edit`, this.variables[var_key]["dtype"], `${this.variables[var_key]["display"]}:`, this.variables[var_key]["var"], this.variables[var_key]["options"], null);
            };
        } else {
            for (let [var_key, var_data] of Object.entries(variables)) {
                elements[var_key] = this.gui.defVarI(`${var_key}_edit`, var_data["dtype"], `${var_data["display"]}:`, var_data["initial"], var_data["options"], null);
            };
        };
        this.gui.fill_grid(Object.entries(elements), grid_frame);
        
        if (confirm_button === null) {
            confirm_button = this.gui.create_button("Close", null, true);
            confirm_button.id = "edit_confirm_button";
            document.getElementById("edit_vars_controls").appendChild(confirm_button);
        };
        confirm_button.onclick = () => this.gui.edit_confirm.bind(this)(exit_function, variables, this_variables);
        dialog_elem.show();
    };
    
    edit_confirm(exit_function, variables=[], this_variables=true) {
        // Called as the calculator class
        let dialog_elem = document.getElementById("edit_vars_dialog");
        let inputted_value;
        if (this_variables) {
            for (let var_key of variables) {
                inputted_value = this.gui.get_value(`${var_key}_edit`)
                this.variables[var_key]["var"] = inputted_value;
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