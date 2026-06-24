class GUI_creator {
    constructor() {
        this.switches = {};
        this.reduced_amounts = {0: "", 1: "k", 2: "M", 3: "B", 4: "T", 5: "Qd"};
        this.reduced_amounts_length = 6;
        this.current_color_palette = "dark_red";
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
        this.edit_vars_requests = {};
    };


    // Color Palette

    update_color_palette() {
        let new_color_palette = this.palette_names[this.main.color_palette.get()];
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
        select_elem.style.width = "fit-content";
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
        let output_elem;
        if (typeof id === "string") {
            output_elem = document.getElementById(id);
        } else {
            output_elem = id;
        };
        output_elem.innerHTML = "";
        for (const line of lines) {
            let list_elem = document.createElement("li");
            list_elem.appendChild(document.createTextNode(line));
            output_elem.appendChild(list_elem);
        };
    };
    
    create_grid(grid_dict) {
        let grid_arr = [];
        for (let [key, val] of Object.entries(grid_dict)) {
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

    def_switch(switch_id, obj, control=null, negate=false, initial=true) {
        this.switches[switch_id] = {"state": initial, "obj": obj, "control": control, "negate": negate};
        let objs;
        if (initial === false) {
            if (obj instanceof Array) {
                objs = obj;
            } else {
                objs = [obj];
            };
            for (let widget of objs) {
                document.getElementById(widget).style.display = "none";
                for (let suffix of ["_label", "_output_switch", "_list_box", "_filler_1", "_filler_2"]) {
                    if (document.getElementById(widget + suffix) !== null) {
                        document.getElementById(widget + suffix).style.display = "none";
                    };
                };
            };
        };
    };
    
    toggle_switch(switch_id, control=null) {
        let state = this.switches[switch_id]["state"];
        let objs
        if (control !== null) {
            if (this.switches[switch_id]["negate"]) {
                if (state !== (control === this.switches[switch_id]["control"])) {
                    return;
                };
            } else {
                if (state === (control === this.switches[switch_id]["control"])) {
                    return;
                };
            };
        };
        if (this.switches[switch_id]["obj"] instanceof Array) {
            objs = this.switches[switch_id]["obj"];
        } else {
            objs = [this.switches[switch_id]["obj"]];
        };
        if (state === true) {
            for (let obj of objs) {
                document.getElementById(obj).style.display = "none";
                for (let suffix of ["_label", "_output_switch", "_list_box", "_filler_1", "_filler_2"]) {
                    if (document.getElementById(obj + suffix) !== null) {
                        document.getElementById(obj + suffix).style.display = "none";
                    };
                };
            };
            this.switches[switch_id]["state"] = false;
        } else {
            for (let obj of objs) {
                document.getElementById(obj).style.display = "";
                for (let suffix of ["_label", "_output_switch", "_list_box", "_filler_1", "_filler_2"]) {
                    if (document.getElementById(obj + suffix) !== null) {
                        document.getElementById(obj + suffix).style.display = "";
                    };
                };
            };
            this.switches[switch_id]["state"] = true;
        };
    };
    
    create_switch_call(switch_id, controlvar=null) {
        if (controlvar === null) {
            return () => this.toggle_switch(switch_id, null);
        } else {
            return () => this.toggle_switch(switch_id, this.get_value(controlvar));
        };
    };

    create_show_hide_toggle(switch_id, button_text="Toggle extra options") {
        let button;
        if (typeof switch_id === "string") {
            button = this.create_button(button_text, this.create_switch_call(switch_id).bind(this));
        } else if (typeof switch_id === "function") {
            button = this.create_button(button_text, switch_id);
        };
        button.style.width = "fit-content";
        button.style.whiteSpace = "nowrap";
        return button;
    };


    // Data logistics

    async call_API(api_url, api_name="API") {
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

    get_from_GUI(var_keys, translate=true) {
        let var_values = {};
        for (const var_key of var_keys) {
            if (!(var_key in this.main.var_dict)) {
                console.log(`WARNING: ${var_key} key not in this.var_dict`);
                continue;
            };
            if (this.main.var_dict[var_key].dtype === "object") {
                var_values[var_key] = JSON.parse(JSON.stringify(this.main.var_dict[var_key].list));
            } else {
                var_values[var_key] = this.main.var_dict[var_key].get(translate);
            };
        };
        return var_values;
    };

    send_to_GUI(outputs) {
        for (const var_key of Object.keys(outputs)) {
            if (!(var_key in this.main.var_dict)) {
                console.log(`WARNING: Output ${var_key} not found in this.var_dict`);
                continue;
            };
            if (this.main.var_dict[var_key].dtype === "object") {
                this.clear_object(this.main.var_dict[var_key].list);
                if (this.main.var_dict[var_key].list instanceof Array) {
                    this.main.var_dict[var_key].list.push(...outputs[var_key]);
                } else {
                    Object.assign(this.main.var_dict[var_key].list, outputs[var_key]);
                };
            } else {
                this.main.var_dict[var_key].set(outputs[var_key]);
            };
        };
        return;
    };


    // Data editing

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
        let html_element = document.getElementById(id);
        let value;
        if (html_element === null) {
            console.log(`ERROR: Could not find HTML element with id ${id}`)
            return;
        };
        if (html_element.type === "checkbox") {
            value = html_element.checked;
        } else if (html_element.tagName === "SPAN") {
            value = html_element.innerText;
        } else {
            value = html_element.value;
        };
        if (typeof value === "string") {
            if (!isNaN(value) && !isNaN(parseFloat(value))) {
                return Number(value);
            };
        };
        return value;
    };

    set_value(id, value) {
        let html_element = document.getElementById(id);
        if (html_element === null) {
            console.log(`ERROR: Could not find HTML element with id ${id}`)
            return;
        };
        if (html_element.type === "checkbox") {
            html_element.checked = value;
        } else if (html_element.tagName === "SPAN") {
            html_element.innerText = value;
        } else {
            html_element.value = value;
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
        if (number === Infinity) {
            return "Infinite";
        };
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

    edit_vars(request_id) {
        let dialog_elem = document.getElementById("edit_vars_dialog");
        if (dialog_elem.hasAttribute("open")) {
            return;
        };
        if (!(request_id in this.edit_vars_requests)) {
            return;
        };
        dialog_elem.show();
        this.toggle_switch(`edit_vars_${request_id}`);
        return;
    };

    edit_confirm(request_id) {
        let results = {};
        for (let [var_key, dict] of Object.entries(this.edit_vars_requests[request_id]["variables"])) {
            if (dict === null) {
                results[var_key] = this.get_value(request_id + "_" + var_key);
            } else if (dict === true) {
                results[var_key] = this.get_value(request_id + "_" + var_key);
                this.main.var_dict[var_key].set(this.get_value(request_id + "_" + var_key))
            } else {
                results[var_key] = dict;
            };
        };
        this.toggle_switch(`edit_vars_${request_id}`);
        document.getElementById("edit_vars_dialog").close();
        if (this.edit_vars_requests[request_id]["exit_func"] !== null) {
            this.edit_vars_requests[request_id]["exit_func"](results);
        };
    };

    new_edit_vars(request_id, variables, exit_function, relwidth=0.2, relheight=0.3) {
        // variables : {
        //   var_key : {
        //       dtype : data type,
        //       display : str,
        //       initial : value of dtype,
        //       options : list
        //   },
        //   dict_key : {
        //       dtype := dict,
        //       display : str,
        //       initial : dict
        //   },
        // }
        this.edit_vars_requests[request_id] = {};
        this.edit_vars_requests[request_id]["variables"] = {};
        // frame : main frame
        // exit_func : exit function
        // variables : {
        //   edit_var_key : null if element ID is var_key, else string with element ID
        //   edit_dict_key : dict
        // }
        this.edit_vars_requests[request_id]["exit_func"] = exit_function;
        let dialog_elem = document.getElementById("edit_vars_dialog");
        let new_edit_vars_frame = document.createElement("div");
        new_edit_vars_frame.id = `edit_vars_${request_id}`;
        new_edit_vars_frame.className = "small_frame";
        new_edit_vars_frame.style.cssText = (`min-width: ${relwidth * 100}vw; min-height: ${relheight * 100}vh;`)
        let new_edit_vars_grid = document.createElement("div");
        new_edit_vars_grid.id = `edit_vars_grid_${request_id}`;
        new_edit_vars_grid.className = "edit_grid_frame";
        dialog_elem.appendChild(new_edit_vars_frame);
        new_edit_vars_frame.appendChild(new_edit_vars_grid);
        this.def_switch(`edit_vars_${request_id}`, [`edit_vars_${request_id}`], null, false, false);

        let widgets_dict = {};
        let var_widget_id;
        for (let [var_key, var_data] of Object.entries(variables)) {
            var_widget_id = request_id + "_" + var_key;
            this.edit_vars_requests[request_id]["variables"][var_key] = null;
            if (var_data === null) {
                this.edit_vars_requests[request_id]["variables"][var_key] = true;
                widgets_dict[var_key] = this.def_input_var(var_widget_id, this.main.var_dict[var_key].dtype, `${this.main.var_dict[var_key].get_display()}:`, this.main.var_dict[var_key].get(false), this.main.var_dict[var_key].options, null);
            } else if (var_data["dtype"] === "object") {
                widgets_dict[var_key] = this.def_output_var(var_widget_id, "object", `${var_data['display']}:`, var_data["initial"], 35, 10);
                this.fill_list_box(widgets_dict[var_key][1].childNodes[0], Array.from(Object.entries(var_data["initial"]), (entry) => `${entry[0]}: ${entry[1]}`));
                widgets_dict[var_key + "_edit_key"] = this.def_input_var(var_widget_id + "_edit_key", "string", "Key:");
                widgets_dict[var_key + "_edit_val"] = this.def_input_var(var_widget_id + "_edit_val", "string", "Value:");
                widgets_dict[var_key + "_submit"] = [null, this.create_button("Submit", () => this.edit_dict_submit(request_id, var_key))];
                this.edit_vars_requests[request_id]["variables"][var_key] = var_data["initial"];
            } else {
                widgets_dict[var_key] = this.def_input_var(var_widget_id, var_data["dtype"], `${var_data['display']}:`, var_data["initial"], var_data["options"], null);
            };
        };
        
        this.fill_grid(this.create_grid(widgets_dict), new_edit_vars_grid);

        let close_button = this.create_button("Close", () => this.edit_confirm.bind(this)(request_id), true);
        close_button.style.cssText = ("position: absolute; bottom: 0;")
        new_edit_vars_grid.appendChild(close_button);
        this.edit_vars_requests[request_id]["frame"] = new_edit_vars_frame;
        return;
    };

    edit_dict_submit(request_id, edit_dict_key) {
        let dict_to_edit = this.edit_vars_requests[request_id]["variables"][edit_dict_key];
        let edit_key = this.get_value(request_id + "_" + edit_dict_key + "_edit_key");
        let edit_val = this.get_value(request_id + "_" + edit_dict_key + "_edit_val");
        if (edit_key === "") {
            return;
        };
        if (edit_val === "") {
            delete dict_to_edit[edit_key];
        } else {
            if (!(Number.isNaN(Number(edit_val)))) {
                edit_val = Number(edit_val);
            };
            dict_to_edit[edit_key] = edit_val;
        };
        this.fill_list_box(request_id + "_" + edit_dict_key, Array.from(Object.entries(dict_to_edit), (entry) => `${entry[0]}: ${entry[1]}`));
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
        this.reverse_translation = null;
        if (this.options !== null && !(this.options instanceof Array)) {
            this.translation = this.options;
            this.options = Object.keys(this.options);
            this.reverse_translation = {};
            for (let [untranslated, translated] of Object.entries(this.translation)) {
                this.reverse_translation[translated] = untranslated;
            };
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
        if (this.vtype === "storage" || document.getElementById(this.key) === null) {
            val = this.var;
        } else {
            val = this.huim.get_value(this.key);
        };
        if ((this.translation === null) || (translate === false)) {
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

    set(value, translated=false) {
        if ((this.translation !== null) && (translated === true)) {
            value = this.reverse_translation[value];
        };
        if (this.vtype === "storage" || document.getElementById(this.key) === null) {
            this.var = value;
        } else {
            this.huim.set_value(this.key, value);
        };
        return;
    };

    update_listbox(key_format_function= x => x, value_format_function= x => x, filter= (key, val) => true) {
        if (this.dtype !== "object" || this.vtype !== "output") {
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

    update_option_list(new_list, translated=false) {
        if (this.dtype === "boolean") {
            return;
        };
        if (this.options === null) {
            return;
        };
        if (translated) {
            let translated_list = [];
            for (let list_item of new_list) {
                translated_list.push(this.reverse_translation[list_item]);
            };
            new_list = translated_list;
        };
        if (!(new_list.every((list_item) => this.options.includes(list_item)))) {
            return;
        };
        let old_value = this.get(false);
        this.widget[1].innerHTML = "";
        let option_elem;
        for (let list_item of new_list) {
            option_elem = document.createElement("option");
            option_elem.text = list_item;
            this.widget[1].add(option_elem);
        };
        if (!(new_list.includes(old_value))) {
            this.set(new_list[new_list.length - 1]);
        } else {
            this.set(old_value);
        };
        return;
    };
};