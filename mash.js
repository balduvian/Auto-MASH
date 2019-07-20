"use strict";
/*
 * ===========================
 *   define snake case types
 * ===========================
 */
/*
 * ====================
 *   color theme time
 * ====================
 */
var Theme;
(function (Theme) {
    const LIGHT_THEME = {
        layer0: '#FFFFFF',
        layer1: '#F8F8F8',
        layer2: '#292929',
        layer3: '#00A0EF',
        placeh: '#5a5a5a',
        screen: '#00000077'
    };
    const ALT_THEME = {
        layer0: '#264653',
        layer1: '#2a9d8f',
        layer2: '#e9c46a',
        layer3: '#f07422',
        placeh: '#5c5954',
        screen: '#00000077'
    };
    const DARK_THEME = {
        layer0: '#000000',
        layer1: '#202020',
        layer2: '#ffffff',
        layer3: '#E23A3C',
        placeh: '#c7c7c7',
        screen: '#77777777'
    };
    const OLD_THEME = {
        layer0: '#28403E',
        layer1: '#8D1E35',
        layer2: '#BF4C54',
        layer3: '#FBBB84',
        placeh: '#233c40',
        screen: '#00000077'
    };
    Theme.THEME_LIST = [
        LIGHT_THEME,
        ALT_THEME,
        DARK_THEME,
        OLD_THEME
    ];
    /**
     * without specifying which theme to use, it picks
     * the theme indexed by current_theme instead
     *
     * @param ti - an optional index for which color theme to apply
     *
     * saves it to browser local storage!
     */
    function apply_theme(ti) {
        if (!ti)
            ti = Theme.current_theme;
        let theme = Theme.THEME_LIST[ti];
        let style = document.documentElement.style;
        style.setProperty('--layer0', theme.layer0);
        style.setProperty('--layer1', theme.layer1);
        style.setProperty('--layer2', theme.layer2);
        style.setProperty('--layer3', theme.layer3);
        style.setProperty('--placeholder', theme.placeh);
        style.setProperty('--screen', theme.screen);
        Theme.current_theme = ti;
        window.localStorage.setItem('color_theme', ti + '');
    }
    Theme.apply_theme = apply_theme;
    /**
     * @param size - optional, will default to current_size
     */
    function apply_size(size) {
        if (!size)
            size = Theme.current_size;
        let style = document.documentElement.style;
        style.setProperty('--medium', size + 'px');
        Theme.current_size = size;
        window.localStorage.setItem('size_theme', size + '');
    }
    Theme.apply_size = apply_size;
    /*
     * ===============================================
     *   use these to interact with the theme safely
     * ===============================================
     */
    /**
     * will wrap around the theme list
     */
    function increment_theme() {
        ++Theme.current_theme;
        Theme.current_theme %= num_themes;
    }
    Theme.increment_theme = increment_theme;
    function deincrement_theme() {
        --Theme.current_theme;
        Theme.current_theme %= num_themes;
    }
    Theme.deincrement_theme = deincrement_theme;
    /**
     * will return false if it can't go any higher
     */
    function increment_size() {
        if (Theme.current_size >= MAX_SIZE)
            return false;
        Theme.current_size += INC_BY;
        return true;
    }
    Theme.increment_size = increment_size;
    /**
     * will return false if it can't go any lower
     */
    function deincrement_size() {
        if (Theme.current_size <= MIN_SIZE)
            return false;
        Theme.current_size -= INC_BY;
        return true;
    }
    Theme.deincrement_size = deincrement_size;
    const num_themes = Theme.THEME_LIST.length;
    const MAX_SIZE = 50;
    const MIN_SIZE = 10;
    const INC_BY = 5;
    Theme.current_theme = 0;
    Theme.current_size = 30;
})(Theme || (Theme = {}));
/**
 * removes an element by index from either the options or sections array
 * also deletes the dom element that represents it
 *
 * @param el - the option, which we gather the index from
 * @param arr - the array that contains the option or section
 */
function remove_from(el, arr) {
    let slice = el.index;
    arr = arr.filter((v, i) => {
        if (i === slice)
            return false;
        if (i > slice)
            --v.index;
        return true;
    });
    el.dom.remove();
    return arr;
}
/*
 * ===========================================
 *   namespaces for functions that deal with
 *      functionality and with interface
 * ===========================================
 */
/**
 * ebet's dom wrapper
 */
var Dom;
(function (Dom) {
    const ns = 'http://www.w3.org/2000/svg';
    /**
     * creates an svg
     *
     * @param box - sets the viewBox attribute of the svg
     */
    function create_svg(options, box, aspect) {
        let svg = document.createElementNS(ns, 'svg');
        svg.classList.add(options.class_name);
        if (box)
            svg.setAttributeNS(null, 'viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
        if (aspect)
            svg.setAttributeNS(null, 'preserveAspectRatio', aspect);
        if (options.parent)
            options.parent.appendChild(svg);
        return svg;
    }
    Dom.create_svg = create_svg;
    /**
     * adds a polyline element to an svg
     * @param svg - the svg to add a line to
     */
    function add_svg_line(svg) {
        let line = document.createElementNS(ns, 'polyline');
        line.setAttributeNS(null, 'points', '');
        svg.appendChild(line);
        return line;
    }
    Dom.add_svg_line = add_svg_line;
    /**
     * creates and returns an html element
     * used by the more specialized functions
     */
    function create(type_name, options) {
        let el = document.createElement(type_name);
        if (options.class_name)
            el.className = options.class_name;
        if (options.id)
            el.id = options.id;
        if (options.text)
            el.textContent = options.text;
        if (options.parent)
            options.parent.appendChild(el);
        if (options.type)
            el.type = options.type;
        if (options.value)
            el.value = options.value;
        return el;
    }
    Dom.create = create;
    /**
     * calls create, but specifies div
     */
    function create_div(options) {
        return create('div', options);
    }
    Dom.create_div = create_div;
    /**
     * calls create, but specifies paragraph
     */
    function create_par(options) {
        return create('p', options);
    }
    Dom.create_par = create_par;
    /**
     * calls create, but specifies input
     * NOTE: use type and value properties inside options
     */
    function create_inp(options) {
        return create('input', options);
    }
    Dom.create_inp = create_inp;
})(Dom || (Dom = {}));
/**
 * contains all functionality and storage of mash
 */
var MASH;
(function (MASH) {
    /**
     * creates and adds a section to the sections list
     * in DOM and in internal mash arrays
     */
    function create_section(template) {
        /// create the main dom of the section
        let sec_div = Dom.create_div({ class_name: 'section', parent: MASH.dom_sections });
        /// title value is only filled out if we send in a template
        let sec_tit = Dom.create_inp({ class_name: 'title', parent: sec_div, type: 'text',
            value: template ? template.name : ''
        });
        sec_tit.required = true;
        sec_tit.placeholder = 'enter a name';
        let sec_but = Dom.create_div({ class_name: 'button', parent: sec_div, text: '+' });
        let rem_but = Dom.create_div({ class_name: 'button section_remove', parent: sec_div, text: '-' });
        /// ok now finally init the section data object
        let section = {
            index: MASH.sections.length,
            options: [],
            selection: -1,
            value: sec_tit.value,
            dom: sec_div
        };
        /// appends an option to this section
        /// used internally
        let add_option = (template) => {
            let op_div = Dom.create_div({ parent: section.dom, class_name: 'option' });
            let op_tit = Dom.create_inp({ parent: op_div, class_name: 'title', type: 'text',
                value: template ? template : ''
            });
            op_tit.required = true;
            op_tit.placeholder = 'enter an option';
            let op_but = Dom.create_div({ parent: op_div, class_name: 'button', text: '-' });
            let option = {
                index: section.options.length,
                value: op_tit.value,
                checked: false,
                dom: op_div
            };
            /// this deletes the option
            op_but.onclick = () => {
                section.options = remove_from(option, section.options);
            };
            /// update internal value when we type, just like the section
            op_tit.onchange = () => {
                option.value = op_tit.value;
            };
            /// actually add the option to the section
            section.options.push(option);
        };
        /// when we type into title, update internal value
        sec_tit.onchange = () => {
            section.value = sec_tit.value;
        };
        /// section button is what creates options for the section
        /// pass in no template, this is user input
        sec_but.onclick = () => {
            add_option();
        };
        /// floats to the left, will remove the section
        rem_but.onclick = () => {
            MASH.sections = remove_from(section, MASH.sections);
        };
        /// if it was created through json now we fill in options
        if (template) {
            template.options.forEach((op) => {
                add_option(op);
            });
        }
        MASH.sections.push(section);
    }
    MASH.create_section = create_section;
    /**
     * makes all section buttons clickable
     * and all titles editable
     */
    function enable_all() {
        MASH.sections.forEach(sec => {
            /// make section title editable
            sec.dom.firstChild.disabled = false;
            /// make buttons visible
            sec.dom.children[1].classList.remove('hidden');
            sec.dom.children[2].classList.remove('hidden');
            sec.options.forEach(op => {
                /// make option title editable
                op.dom.firstChild.disabled = false;
                /// make button visible
                op.dom.lastElementChild.classList.remove('hidden');
            });
        });
    }
    MASH.enable_all = enable_all;
    /**
     * makes all section buttons invisible
     * and all titles locked down
     */
    function disable_all() {
        MASH.sections.forEach(sec => {
            /// make section title editable
            sec.dom.firstChild.disabled = true;
            /// make button visible
            sec.dom.children[1].classList.add('hidden');
            sec.dom.children[2].classList.add('hidden');
            sec.options.forEach(op => {
                /// make option title editable
                op.dom.firstChild.disabled = true;
                /// make button visible
                op.dom.lastElementChild.classList.add('hidden');
            });
        });
    }
    MASH.disable_all = disable_all;
    /**
     * completely resets the MASH
     */
    function clear_sections() {
        while (MASH.dom_sections.firstChild) {
            MASH.dom_sections.removeChild(MASH.dom_sections.firstChild);
        }
        MASH.sections = [];
    }
    MASH.clear_sections = clear_sections;
    /**
     * the internal list of all sections
     */
    MASH.sections = [];
})(MASH || (MASH = {}));
/*
 * ===========================
 *   JSON saving and loading
 * ===========================
 */
/**
 * creates a MASH from a json file
 *
 * will return false if json is incorrect
 */
function load_json(json) {
    let sections = json.sections;
    /// guard against no sections 
    if (!sections)
        return false;
    /// do an advanced guard inside our array
    sections.forEach(sec => {
        if (!sec.name)
            return false;
        if (!sec.options)
            return false;
        if (!(sec.options instanceof Array))
            return false;
        if (!sec.options.every(v => typeof v === 'string'))
            return false;
    });
    /// now that we're ready we can clear
    /// and re add
    MASH.clear_sections();
    sections.forEach(sec => MASH.create_section(sec));
    return true;
}
/**
 * see if we should really be able to save
 * throws an exception if not
 *
 * otherwise does nothing
 * @param secs - sections to check
 */
function check_save_ready(secs) {
    if (secs.length === 0)
        throw 'There are no sections to save!';
    /// only if there is not a section with options
    if (secs.every(sec => {
        return sec.options.length === 0;
    }))
        throw 'There are no options to save!';
    /// if nothing is named
    if (secs.every(sec => {
        return ((sec.value === '')
            && (sec.options.every(op => op.value === '')));
    }))
        throw 'Nothing is named to save';
}
/**
 * makes you download a created json file from the
 * sections given
 */
function save_json(secs) {
    let data = secs.map(sec => {
        return {
            name: sec.value,
            options: sec.options.map(op => op.value)
        };
    });
    console.log(data);
    let file = new Blob([JSON.stringify({ sections: data })], { type: 'text' });
    console.log(file);
    ///create a fake link to the file
    let download = document.createElement('a');
    let url = download.href = URL.createObjectURL(file);
    download.download = 'mash.json';
    download.style.display = 'none';
    document.body.appendChild(download);
    /// execute download
    download.click();
    /// remove fake link and url
    download.remove();
    window.URL.revokeObjectURL(url);
}
/*
 * ==============================
 *   THE GREAT SPIRAL and popup
 * ==============================
 */
var Spiral;
(function (Spiral) {
    /*
    * ===========
    *   globals
    * ===========
    */
    let screen;
    let spiral;
    let spiral_button;
    /**
     * goal tells us when we will create the next spiral line
     */
    let goal = 0;
    /*
     * =============
     *   functions
     * =============
     */
    /**
     * should we even be able to start this??
     *
     * throws an exception if we can't
     * otherwise just does nothing
     */
    function check_spiral_ready() {
        /// no sections = no go
        if (MASH.sections.length === 0)
            throw 'There are no Sections!';
        /// check for each section to have a name
        if (!MASH.sections.every(sec => {
            return sec.value !== '';
        }))
            throw 'Not all sections are named!';
        /// check for each section to have two options or more
        if (!MASH.sections.every(sec => {
            return sec.options.length > 1;
        }))
            throw 'Not all sections have at least two options';
        /// check for option names
        if (!MASH.sections.every(sec => {
            return sec.options.every(op => {
                /// every option must be named
                return op.value !== '';
            });
        }))
            throw 'Not all options are named!';
    }
    Spiral.check_spiral_ready = check_spiral_ready;
    /**
     * the first function to call to start the MASH
     */
    function create_spiral_popup() {
        Run_Button.run_button.textContent = '🟔';
        /// init our state booleans
        Spiral.popup_active = true;
        Spiral.spiraling = false;
        screen = Dom.create_div({ class_name: 'screen', parent: document.body });
        let popup = Dom.create_div({ class_name: 'popup', parent: screen });
        let spiral_housing = Dom.create_div({ class_name: 'spiral_housing', parent: popup });
        spiral_button = Dom.create_div({ class_name: 'spiral_button', parent: popup, text: 'Start Spiral' });
        let svg = Dom.create_svg({ class_name: 'spiral', parent: spiral_housing }, { x: 0, y: 0, width: 100, height: 100 });
        ///reset spiral
        spiral = {
            las_x: 50,
            las_y: 50,
            las_length: 0,
            las_angle: 0,
            set_length: 0,
            set_x: 50,
            set_y: 50,
            set_angle: 0,
            speed: 60,
            clip_line: '',
            line: Dom.add_svg_line(svg)
        };
        spiral_button.onclick = () => {
            if (Spiral.spiraling) {
                stop_spiral();
            }
            else {
                Spiral.spiraling = true;
                spiral_button.textContent = 'Stop Spiral';
            }
        };
        ///now let's start the gameloop
        goal = performance.now();
        game_loop(goal);
    }
    Spiral.create_spiral_popup = create_spiral_popup;
    function stop_spiral() {
        Spiral.spiraling = false;
        /// destroy button functionality
        spiral_button.onclick = () => { };
        /// we calculate the MASH number
        /// how many times the line intersects
        let score = Math.ceil(spiral.las_angle / Math.PI);
        spiral_button.textContent = `Number: ${score}`;
        /// create the line through the spiral
        /// calculate the line
        /// based off the last line point
        let dx = (50 - spiral.las_x);
        let dy = (50 - spiral.las_y);
        let angle = Math.atan2(dy, dx);
        let dist = 2 * Math.sqrt(dx * dx + dy * dy) + spiral.las_length / 2;
        let final_x = spiral.las_x + Math.cos(angle) * dist;
        let final_y = spiral.las_y + Math.sin(angle) * dist;
        spiral.clip_line += ` ${final_x},${final_y}`;
        spiral.line.setAttributeNS(null, 'points', spiral.clip_line);
        /// close the popup after two seconds
        /// then start the MASH selection
        window.setTimeout(() => {
            hide_spiral_popup();
            Elimination.begin(score);
        }, 2000);
    }
    function create_spiral_line() {
        /// first place the next point in the spiral
        spiral.clip_line += ` ${spiral.set_x},${spiral.set_y}`;
        /// set our internal string to the actual clip path value
        spiral.line.setAttributeNS(null, 'points', spiral.clip_line);
        /// store current x and y
        spiral.las_x = spiral.set_x;
        spiral.las_y = spiral.set_y;
        spiral.las_length = spiral.set_length;
        spiral.las_angle = spiral.set_angle;
        /// advance where the next line will go
        spiral.set_length += 0.1;
        spiral.set_angle += Math.PI / 10;
        spiral.set_x += Math.cos(spiral.set_angle) * spiral.set_length;
        spiral.set_y += Math.sin(spiral.set_angle) * spiral.set_length;
        /// see if we are too far and stop
        let x = spiral.set_x;
        let y = spiral.set_y;
        if (x < 10 || x > 90 || y < 10 || y > 90)
            stop_spiral();
    }
    /**
     * dynamic spiral loop, based on a requestAnimationFrame callback loop
     *
     * @param time_stamp - auto filled by the animationFrame
     */
    function game_loop(time_stamp) {
        /// have we reached our time goal yet
        if (time_stamp >= goal) {
            /// advancing the spiral
            if (Spiral.spiraling)
                create_spiral_line();
            /// set the new goal
            goal += spiral.speed;
        }
        /// when popup goes away cancel gameloop
        if (Spiral.popup_active)
            window.requestAnimationFrame(game_loop);
    }
    /**
     * closes the popup, for quitting or for actually starting
     */
    function hide_spiral_popup() {
        Spiral.popup_active = false;
        while (screen.firstChild) {
            screen.removeChild(screen.firstChild);
        }
        screen.remove();
        Run_Button.set_fast();
    }
    Spiral.hide_spiral_popup = hide_spiral_popup;
})(Spiral || (Spiral = {}));
/*
 * ==========================
 *   NOW THE MASH CAN BEGIN
 * ==========================
 */
/**
 * all supports and functions for the MASH
 * process of elimination
 */
var Elimination;
(function (Elimination) {
    Elimination.going = false;
    let section_pointer;
    let option_pointer;
    let mash_number;
    let step_count;
    let cur_section;
    let cur_option;
    let progress;
    let progress_goal;
    let internal_sections;
    function begin(num) {
        Elimination.going = true;
        Elimination.fast = false;
        /// re order our internal sections
        internal_sections = [];
        let len = MASH.sections.length;
        for (let i = 0; i < len; i += 2) {
            internal_sections.push(MASH.sections[i]);
        }
        for (let i = 1; i < len; i += 2) {
            internal_sections.push(MASH.sections[i]);
        }
        mash_number = num;
        progress = 0;
        progress_goal = 0;
        /// find the total amount of options
        internal_sections.forEach(sec => {
            progress_goal += sec.options.length;
        });
        progress_goal -= len;
        /// put in our initial positions, which are at
        /// the last possible position
        /// to be immediately incremented
        section_pointer = internal_sections.length - 1;
        cur_section = internal_sections[section_pointer];
        option_pointer = cur_section.options.length - 1;
        cur_option = cur_section.options[option_pointer];
        reset_steps();
        increment();
    }
    Elimination.begin = begin;
    function reset_steps() {
        step_count = mash_number;
    }
    function increment() {
        /// remove the selection from the previous option
        cur_option.dom.classList.remove('selected');
        /// advance pointers forward
        do {
            ++option_pointer;
            if (option_pointer === cur_section.options.length) {
                do {
                    ++section_pointer;
                    if (section_pointer === internal_sections.length)
                        section_pointer = 0;
                    cur_section = internal_sections[section_pointer];
                } while (cur_section.selection > -1);
                option_pointer = 0;
            }
            cur_option = cur_section.options[option_pointer];
        } while (cur_option.checked);
        /// add selection to the current option
        if (!Elimination.fast)
            cur_option.dom.classList.add('selected');
        /// advance our step count
        --step_count;
        /// if this one is the one, select
        /// else keep going
        if (step_count === 0) {
            reset_steps();
            /// check it
            cur_option.checked = true;
            cur_option.dom.classList.add('checked');
            create_cross_out(cur_option.dom);
            /// has everything else been selected?
            let amount_checked = 0;
            let unchecked = null;
            cur_section.options.forEach(op => {
                if (op.checked) {
                    ++amount_checked;
                }
                else {
                    unchecked = op;
                }
            });
            /// make the unchecked one the chosen one
            if (amount_checked === cur_section.options.length - 1) {
                cur_section.selection = option_pointer;
                unchecked.dom.classList.add('chosen');
                /// place our pointer at the end of this section
                option_pointer = cur_section.options.length - 1;
            }
            /// se if we're done
            ++progress;
            if (progress === progress_goal) {
                /// we don't want to leave this on here
                cur_option.dom.classList.remove('selected');
                end();
            }
            else {
                if (Elimination.fast) {
                    increment();
                }
                else {
                    window.setTimeout(increment, 2000);
                }
            }
        }
        else {
            if (Elimination.fast) {
                increment();
            }
            else {
                window.setTimeout(increment, timing_function(200, 100, mash_number, step_count));
            }
        }
    }
    /**
     * creates and updates a cross out animation until it's done
     * all async don't worry
     * @param option - the option div to place the cross out in
     */
    function create_cross_out(option) {
        let svg = Dom.create_svg({ class_name: 'cross_out', parent: option }, { x: 0, y: 0, width: 100, height: 100 }, 'none');
        let line = Dom.add_svg_line(svg);
        line.setAttributeNS(null, 'vector-effect', 'non-scaling-stroke');
        let cur_x = 0;
        let up = (Math.random() > 0.5);
        let line_str = '';
        let y_range = () => {
            /// up is between 60 and 90
            /// down is between 10 and 40
            return Math.random() * 30 + (up ? 10 : 60);
        };
        let x_advance = () => {
            /// advance x between 1 and 3
            /// avg of 2 for avg of 50 points
            cur_x += Math.random() * 2 + 1;
        };
        function update() {
            /// our destination is on the opposite half of the line
            up = !up;
            x_advance();
            /// see if we're done
            if (cur_x >= 98)
                return;
            //add new point to line
            line_str += ` ${cur_x} ${y_range()}`;
            /// update line segment
            line.setAttributeNS(null, 'points', line_str);
            /// callback
            window.requestAnimationFrame(update);
        }
        update();
    }
    /**
     * a function of a nice looking parabola
     *
     * @param max - the highest points (on the edges)
     * @param min - the lowest point (in the middle)
     * @param len - how wide from point to point (will be deincremented)
     * @param val - where along the parabola
     */
    function timing_function(max, min, len, val) {
        let piece = ((2 * val) / (len - 1) - 1);
        return (piece * piece) * (max - min) + min;
    }
    /**
     * removes all selections
     * and internal values
     * so that mash can be ran again
     */
    function reset_all() {
        Elimination.going = false;
        MASH.sections.forEach(sec => {
            sec.selection = -1;
            sec.options.forEach(op => {
                op.checked = false;
                op.dom.classList.remove('checked');
                op.dom.classList.remove('chosen');
            });
        });
        /// remove all cross_out's
        let crosses = document.getElementsByClassName('cross_out');
        while (crosses.length !== 0) {
            crosses[0].remove();
        }
    }
    Elimination.reset_all = reset_all;
    function end() {
        Run_Button.set_restart();
    }
})(Elimination || (Elimination = {}));
/*
 * =====================================
 *   varying states of the run button
 * =====================================
 */
var Run_Button;
(function (Run_Button) {
    function run_run() {
        try {
            Spiral.check_spiral_ready();
            MASH.disable_all();
            Spiral.create_spiral_popup();
        }
        catch (ex) {
            alert(ex);
        }
    }
    function run_fast() {
        Elimination.fast = true;
    }
    function run_restart() {
        Elimination.reset_all();
        MASH.enable_all();
        set_run();
    }
    function run_button_change(icon, callback) {
        Run_Button.run_button.textContent = icon;
        Run_Button.run_button.onclick = callback;
    }
    function set_run() { run_button_change('▶', run_run); }
    Run_Button.set_run = set_run;
    function set_fast() { run_button_change('⯮', run_fast); }
    Run_Button.set_fast = set_fast;
    function set_restart() { run_button_change('⭮', run_restart); }
    Run_Button.set_restart = set_restart;
})(Run_Button || (Run_Button = {}));
/*
 * =====================================
 *   now we start actually doing stuff
 * =====================================
 */
function mobile_check() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
/**
 * generates the base page dom
 * also inits MASH
 */
function start() {
    /// check storage for stored color theme
    let ct_store = window.localStorage.getItem('color_theme');
    if (ct_store) {
        Theme.apply_theme(Number.parseInt(ct_store));
    }
    else {
        Theme.apply_theme();
    }
    /// check storage for stored size
    let sz_store = window.localStorage.getItem('size_theme');
    if (sz_store) {
        Theme.apply_size(Number.parseInt(sz_store));
    }
    else {
        Theme.apply_size();
    }
    let container = Dom.create_div({ parent: document.body, class_name: 'container' });
    let header = Dom.create_div({ parent: container, class_name: 'header' });
    let title = Dom.create_par({ parent: header, class_name: 'title', text: 'MASH' });
    MASH.dom_sections = Dom.create_div({ parent: container, class_name: 'sections' });
    /// create our buttons 
    let button_holder = Dom.create_div({ parent: header, class_name: 'button_holder' });
    let save_button = Dom.create_div({ parent: button_holder, class_name: 'button', text: '🡼' });
    /// create a file opener for our json
    let json_button = Dom.create_div({ parent: button_holder, class_name: 'button', text: '䷥' });
    let json_file_open = Dom.create_inp({ parent: document.body, class_name: 'hidden', type: 'file' });
    json_file_open.accept = '.json';
    let dec_size_button = Dom.create_div({ parent: button_holder, class_name: 'button', text: '❰' });
    let inc_size_button = Dom.create_div({ parent: button_holder, class_name: 'button', text: '❱' });
    Run_Button.run_button = Dom.create_div({ parent: button_holder, class_name: 'button', text: '▶' });
    let color_button = Dom.create_div({ parent: button_holder, class_name: 'button color_wheel', text: '☀' });
    let sec_button = Dom.create_div({ parent: button_holder, class_name: 'button', text: '+' });
    /// button functionality
    sec_button.onclick = () => {
        MASH.create_section();
    };
    color_button.onclick = () => {
        Theme.increment_theme();
        Theme.apply_theme();
    };
    dec_size_button.onclick = () => {
        Theme.deincrement_size();
        Theme.apply_size();
    };
    inc_size_button.onclick = () => {
        Theme.increment_size();
        Theme.apply_size();
    };
    json_button.onclick = async () => {
        json_file_open.value = '';
        json_file_open.click();
    };
    json_file_open.onchange = () => {
        let file = json_file_open.files[0];
        let fr = new FileReader();
        fr.onloadend = () => {
            try {
                if (!load_json(JSON.parse(fr.result)))
                    alert('Incorrect JSON!');
            }
            catch (ex) {
                alert('Not a JSON File!');
            }
        };
        try {
            fr.readAsText(file);
        }
        catch (ex) {
            alert('Not a JSON File!');
        }
    };
    save_button.onclick = () => {
        try {
            check_save_ready(MASH.sections);
            save_json(MASH.sections);
        }
        catch (ex) {
            alert(ex);
        }
    };
    Run_Button.set_run();
}
start();
