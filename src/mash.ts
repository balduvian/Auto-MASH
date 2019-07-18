
/*
 * ===========================
 *   define snake case types
 * ===========================
 */

type HTML_Div_Element = HTMLDivElement;
type HTML_Par_Element = HTMLParagraphElement;
type HTML_Element = HTMLElement;
type HTML_Inp_Element = HTMLInputElement;

/*
 * ====================
 *   color theme time
 * ====================
 */

namespace Theme
{
	interface Color_Theme
	{
		layer0: string;
		layer1: string;
		layer2: string;
		layer3: string;
		placeh: string;
	}

	const LIGHT_THEME: Color_Theme =
	{
		layer0: '#FFFFFF',
		layer1: '#F8F8F8',
		layer2: '#292929',
		layer3: '#00A0EF',
		placeh: '#5a5a5a',
	};

	const ALT_THEME: Color_Theme =
	{
		layer0: '#264653',
		layer1: '#2a9d8f',
		layer2: '#e9c46a',
		layer3: '#f07422',
		placeh: '#5c5954',
	};

	const DARK_THEME: Color_Theme =
	{
		layer0: '#000000',
		layer1: '#202020',
		layer2: '#ffffff',
		layer3: '#E23A3C',
		placeh: '#c7c7c7',
	};

	const OLD_THEME: Color_Theme =
	{
		layer0: '#28403E',
		layer1: '#8D1E35',
		layer2: '#BF4C54',
		layer3: '#FBBB84',
		placeh: '#233c40',
	};

	export const THEME_LIST: Color_Theme[] =
	[
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
	export function apply_theme(ti?: number)
	{
		if(!ti)
			ti = current_theme;

		let theme = THEME_LIST[ti];

		let style = document.documentElement.style;

		style.setProperty('--layer0', theme.layer0);
		style.setProperty('--layer1', theme.layer1);
		style.setProperty('--layer2', theme.layer2);
		style.setProperty('--layer3', theme.layer3);

		current_theme = ti;

		window.localStorage.setItem('color_theme', ti + '');
	}

	/**
	 * @param size - optional, will default to current_size
	 */
	export function apply_size(size?: number)
	{
		if(!size)
			size = current_size;

		let style = document.documentElement.style;

		style.setProperty('--medium', size + 'px');

		current_size = size;

		window.localStorage.setItem('size_theme', size + '');
	}

	/* 
	 * ===============================================
	 *   use these to interact with the theme safely
	 * ===============================================
	 */

	/**
	 * will wrap around the theme list
	 */
	export function increment_theme()
	{
		++current_theme;
		current_theme %= num_themes;
	}

	export function deincrement_theme()
	{
		--current_theme;
		current_theme %= num_themes;
	}

	/**
	 * will return false if it can't go any higher
	 */
	export function increment_size(): boolean
	{
		if(current_size >= MAX_SIZE)
			return false;

		current_size += INC_BY;

		return true;
	}

	/**
	 * will return false if it can't go any lower
	 */
	export function deincrement_size(): boolean
	{
		if(current_size <= MIN_SIZE)
			return false;
			
		current_size -= INC_BY;

		return true;
	}

	const num_themes = THEME_LIST.length;
	const MAX_SIZE = 50;
	const MIN_SIZE = 10;
	const INC_BY = 5;

	export let current_theme = 0;
	export let current_size = 30;
}

/*
 * ==============================================
 *   types and util for mash interface elements
 * ==============================================
 */

 /**
 * a subset of a section
 */
interface Option
{
	index: number;
	value: string;
	checked: boolean;

	dom: HTML_Div_Element;
}

/**
 *  one section of the mash, contains options
 */
interface Section
{
	index: number;

	options: Option[];

	selection: number;

	value: string;

	dom: HTML_Div_Element;
}

/**
 * removes an element by index from either the options or sections array
 * also deletes the dom element that represents it
 * 
 * @param el - the option, which we gather the index from
 * @param arr - the array that contains the option or section
 */
function remove_from(el: Option | Section, arr: (Option | Section)[]): (Option | Section)[]
{
	let slice = el.index;
	
	arr = arr.filter((v, i) =>
	{
		if(i === slice)
			return false;

		if(i > slice)
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
namespace Dom
{
	/**
	 * use this to modify the create functions
	 */
	interface Create_Options
	{
		class_name?: string;
		id?: string;
		text?: string;
		parent?: HTML_Element;
		type?: string;
		value?: string;
	}
	
	/**
	 * creates and returns an html element
	 * used by the more specialized functions
	 */
	export function create(type_name: string, options: Create_Options): HTML_Element
	{
		let el = document.createElement(type_name);

		if(options.class_name)
			el.className = options.class_name;

		if(options.id)
			el.id = options.id;

		if(options.text)
			el.textContent = options.text;

		if(options.parent)
			options.parent.appendChild(el);

		if(options.type)
			(<HTML_Inp_Element>el).type = options.type;

		if(options.value)
			(<HTML_Inp_Element>el).value = options.value;

		return el;
	}

	/**
	 * calls create, but specifies div
	 */
	export function create_div(options: Create_Options): HTML_Div_Element
	{
		return <HTML_Div_Element>create('div', options);
	}

	/**
	 * calls create, but specifies paragraph
	 */
	export function create_par(options: Create_Options): HTML_Par_Element
	{
		return <HTML_Par_Element>create('p', options);
	}

	/**
	 * calls create, but specifies input
	 * NOTE: use type and value properties inside options
	 */
	export function create_inp(options: Create_Options): HTML_Inp_Element
	{
		return <HTML_Inp_Element>create('input', options);
	}
}

/**
 * contains all functionality and storage of mash
 */
namespace MASH
{
	/**
	 * information for a section that is imported
	 */
	export interface Section_Template
	{
		name: string;
		options: string[];
	}

	/**
	 * creates and adds a section to the sections list
	 * in DOM and in internal mash arrays
	 */
	export function create_section(template?: Section_Template): void
	{
		/// create the main dom of the section
		let sec_div = Dom.create_div({class_name: 'section', parent: dom_sections});

		/// title value is only filled out if we send in a template
		let sec_tit = Dom.create_inp({class_name: 'title', parent: sec_div, type: 'text',
			value: template ? template.name : ''
		});

		sec_tit.required = true;
		sec_tit.placeholder = 'enter a name';

		let sec_but = Dom.create_div({class_name: 'button', parent: sec_div, text: '+'});
		let rem_but = Dom.create_div({class_name: 'button section_remove', parent: sec_div, text: '-'});

		/// ok now finally init the section data object
		let section: Section =
		{
			index: sections.length,
			options: [],
			selection: -1,
			value: sec_tit.value,
			dom: sec_div
		};

		/// appends an option to this section
		/// used internally
		let add_option = (template?: string) =>
		{
			let op_div = Dom.create_div({parent: section.dom, class_name: 'option'});

			let op_tit = Dom.create_inp({parent: op_div, class_name: 'title', type: 'text',
				value: template ? template : ''
			});
			op_tit.required = true;
			op_tit.placeholder = 'enter an option';

			let op_but = Dom.create_div({parent: op_div, class_name: 'button', text: '-'});

			let option: Option =
			{
				index: section.options.length,
				value: op_tit.value,
				checked: false,
				dom: op_div	
			};

			/// this deletes the option
			op_but.onclick = () =>
			{
				section.options = <Option[]>remove_from(option, section.options);
			};

			/// update internal value when we type, just like the section
			op_tit.onchange = () =>
			{
				option.value = op_tit.value;
			};

			/// actually add the option to the section
			section.options.push(option);
		};

		/// when we type into title, update internal value
		sec_tit.onchange = () =>
		{
			section.value = sec_tit.value;
		};

		/// section button is what creates options for the section
		/// pass in no template, this is user input
		sec_but.onclick = () =>
		{
			add_option();
		};

		/// floats to the left, will remove the section
		rem_but.onclick = () =>
		{
			sections = <Section[]>remove_from(section, sections);
		};

		/// if it was created through json now we fill in options
		if(template)
		{
			template.options.forEach((op) =>
			{
				add_option(op);
			});
		}

		sections.push(section);
	}

	/**
	 * makes all section buttons clickable
	 * and all titles editable
	 */
	export function enable_all(): void
	{
		sections.forEach(sec =>
		{
			/// make section title editable
			(<HTML_Inp_Element>sec.dom.firstChild).disabled = false;
			/// make buttons visible
			sec.dom.children[1].classList.remove('hidden');
			sec.dom.children[2].classList.remove('hidden');

			sec.options.forEach(op =>
			{
				/// make option title editable
				(<HTML_Inp_Element>op.dom.firstChild).disabled = false;
				/// make button visible
				op.dom.lastElementChild.classList.remove('hidden');
			});
		});
	}

	/**
	 * makes all section buttons invisible
	 * and all titles locked down
	 */
	export function disable_all(): void
	{
		sections.forEach(sec =>
		{
			/// make section title editable
			(<HTML_Inp_Element>sec.dom.firstChild).disabled = true;
			/// make button visible
			sec.dom.children[1].classList.add('hidden');
			sec.dom.children[2].classList.add('hidden');

			sec.options.forEach(op =>
			{
				/// make option title editable
				(<HTML_Inp_Element>op.dom.firstChild).disabled = true;
				/// make button visible
				op.dom.lastElementChild.classList.add('hidden');
			});
		});
	}

	/**
	 * completely resets the MASH
	 */
	export function clear_sections(): void
	{
		while (dom_sections.firstChild)
		{
    		dom_sections.removeChild(dom_sections.firstChild);
		}

		sections = [];
	}

	/**
	 * the internal list of all sections
	 */
	export let sections: Section[] = [];

	/**
	 * we store the div with class sections that contains
	 * all of the section divs
	 */
	export let dom_sections: HTML_Div_Element;
}

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
function load_json(json: any): boolean
{
	let sections: MASH.Section_Template[] = json.sections;

	/// guard against no sections 
	if(!sections)
		return false;

	/// do an advanced guard inside our array
	sections.forEach(sec =>
	{
		if(!sec.name)
			return false;

		if(!sec.options)
			return false;

		if(!(sec.options instanceof Array))
			return false;
		
		if(!sec.options.every(v => typeof v === 'string'))
			return false;
	});

	/// now that we're ready we can clear
	/// and re add
	MASH.clear_sections();
	sections.forEach(sec => MASH.create_section(sec));

	return true;
}

/**
 * makes you download a created json file from the
 * sections given
 */
function save_json(sections: Section[])
{
	let data:MASH.Section_Template[] = sections.map(sec =>
	{
		return {
			name: sec.value,
			options: sec.options.map(op => op.value)
		};
	});

	console.log(data);

	let file = new Blob([JSON.stringify(data)], {type: 'text'});

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

namespace Spiral
{
	interface Spiral
	{
		las_x: number;
		las_y: number;
		las_length: number;
		las_angle: number;

		set_length: number;
		set_x: number;
		set_y: number;
		set_angle: number;

		speed: number;

		clip_line: string;
		line: Element;
	}

	/*
	* ===========
	*   globals
	* ===========
	*/

	let screen: HTML_Div_Element;
	let spiral: Spiral;
	let spiral_button: HTML_Div_Element;

	/**
	 * goal tells us when we will create the next spiral line
	 */
	let goal = 0;

	export let popup_active: boolean;
	export let spiraling: boolean;

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
	export function check_spiral_ready(): void
	{
		/// no sections = no go
		if(MASH.sections.length === 0) throw 'There are no Sections!';

		/// check for each section to have a name
		if(!MASH.sections.every(sec =>
		{
			return sec.value !== '';
		})) throw 'Not all sections are named!';

		/// check for each section to have two options or more
		if(!MASH.sections.every(sec =>
		{
			return sec.options.length > 1;
		})) throw 'Not all sections have at least two options';

		/// check for option names
		if(!MASH.sections.every(sec =>
		{
			return sec.options.every(op =>
			{
				/// every option must be named
				return op.value !== '';
			});
		})) throw 'Not all options are named!';
	}

	/**
	 * the first function to call to start the MASH
	 */
	export function create_spiral_popup(): void
	{
		Run_Button.run_button.textContent = '🟔';

		/// init our state booleans
		popup_active = true;
		spiraling = false;

		screen = Dom.create_div({class_name: 'screen', parent: document.body});
		let popup = Dom.create_div({class_name: 'popup', parent: screen});

		let spiral_housing = Dom.create_div({class_name: 'spiral_housing', parent: popup});
		spiral_button = Dom.create_div({class_name: 'spiral_button', parent: popup, text: 'Start Spiral'});

		/// create spiral svg
		let ns = 'http://www.w3.org/2000/svg';
		let svg = document.createElementNS(ns, 'svg');
		svg.classList.add('spiral');
		svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
		//svg.setAttributeNS(null, 'width', '100');
		//svg.setAttributeNS(null, 'height', '100');
		spiral_housing.appendChild(svg);
		///
		let line = document.createElementNS(ns, 'polyline');
		line.setAttributeNS(null, 'points', '');
		svg.appendChild(line);

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
			line: line
		};

		spiral_button.onclick = () =>
		{
			if(spiraling)
			{
				stop_spiral();
			}
			else
			{
				spiraling = true;
				spiral_button.textContent = 'Stop Spiral';
			}
		};

		///now let's start the gameloop
		goal = performance.now();
		game_loop(goal);
	}

	function stop_spiral()
	{
		spiraling = false;

		/// destroy button functionality
		spiral_button.onclick = () => {};

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

		/// close the popup after a second
		/// then start the MASH selection
		window.setTimeout(() =>
		{
			hide_spiral_popup();
			
			Elimination.begin(score);
		}, 1000);
	}

	function create_spiral_line()
	{
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
		if(x < 10 || x > 90 || y < 10 || y > 90)
			stop_spiral();
	}

	/**
	 * dynamic spiral loop, based on a requestAnimationFrame callback loop
	 * 
	 * @param time_stamp - auto filled by the animationFrame
	 */
	function game_loop(time_stamp: number)
	{
		/// have we reached our time goal yet
		if(time_stamp >= goal)
		{
			/// advancing the spiral
			if(spiraling)
				create_spiral_line();

			/// set the new goal
			goal += spiral.speed;
		}

		/// when popup goes away cancel gameloop
		if(popup_active)
			window.requestAnimationFrame(game_loop);
	}

	/**
	 * closes the popup, for quitting or for actually starting
	 */
	export function hide_spiral_popup(): void
	{
		popup_active = false;

		while(screen.firstChild)
		{
			screen.removeChild(screen.firstChild);
		}

		screen.remove();

		Run_Button.set_fast();
	}
}

/*
 * ==========================
 *   NOW THE MASH CAN BEGIN
 * ==========================
 */

/**
 * all supports and functions for the MASH
 * process of elimination
 */
namespace Elimination
{
	export let going: boolean = false;

	let section_pointer: number;
	let option_pointer: number;

	let mash_number: number;
	let step_count: number;

	let cur_section: Section;
	let cur_option: Option;

	let progress: number;
	let progress_goal: number;

	let internal_sections: Section[];

	export let fast: boolean;

	export function begin(num: number)
	{
		going = true;
		fast = false;

		/// re order our internal sections
		internal_sections = [];
		let len = MASH.sections.length;
		for(let i = 0; i < len; i += 2)
		{
			internal_sections.push(MASH.sections[i]);
		}
		for(let i = 1; i < len; i += 2)
		{
			internal_sections.push(MASH.sections[i]);
		}

		mash_number = num;
		progress = 0;
		progress_goal = 0;
		/// find the total amount of options
		internal_sections.forEach(sec =>
		{
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

	function reset_steps()
	{
		step_count = mash_number;
	}

	function increment()
	{
		/// remove the selection from the previous option
		cur_option.dom.classList.remove('selected');	

		/// advance pointers forward
		do
		{
			++option_pointer;

			if(option_pointer === cur_section.options.length)
			{
				do 
				{
					++section_pointer;

					if(section_pointer === internal_sections.length)
						section_pointer = 0;

					cur_section = internal_sections[section_pointer];
				}
				while(cur_section.selection > -1);

				option_pointer = 0;
			}	

			cur_option = cur_section.options[option_pointer];
		}
		while(cur_option.checked);

		/// add selection to the current option
		if(!fast)
			cur_option.dom.classList.add('selected');

		/// advance our step count
		--step_count;

		/// if this one is the one, select
		/// else keep going
		if(step_count === 0)
		{
			reset_steps();
			
			/// check it
			cur_option.checked = true;
			cur_option.dom.classList.add('checked');

			/// has everything else been selected?
			let amount_checked = 0;
			let unchecked: Option = null;
			cur_section.options.forEach(op =>
			{
				if(op.checked)
				{
					++amount_checked;	
				}
				else
				{
					unchecked = op;
				}
			});

			/// make the unchecked one the chosen one
			if(amount_checked === cur_section.options.length - 1)
			{
				cur_section.selection = option_pointer;
				unchecked.dom.classList.add('chosen');

				/// place our pointer at the end of this section
				option_pointer = cur_section.options.length - 1;
			}

			/// se if we're done
			++progress;
			if(progress === progress_goal)
			{
				/// we don't want to leave this on here
				cur_option.dom.classList.remove('selected');

				end();
			}
			else
			{
				if(fast)
				{
					increment();
				}
				else
				{
					window.setTimeout(increment, 2000);
				}
			}
		}
		else
		{
			if(fast)
			{
				increment();
			}
			else
			{
				window.setTimeout(increment, timing_function(200, 100, mash_number, step_count));
			}
		}
	}

	/**
	 * a function of a nice looking parabola
	 * 
	 * @param max - the highest points (on the edges)
	 * @param min - the lowest point (in the middle)
	 * @param len - how wide from point to point (will be deincremented)
	 * @param val - where along the parabola
	 */
	function timing_function(max: number, min: number, len: number, val: number): number
	{
		let piece = ((2 * val) / (len - 1) - 1);
		return (piece * piece) * (max - min) + min;
	}

	/**
	 * removes all selections
	 * and internal values
	 * so that mash can be ran again
	 */
	export function reset_all()
	{
		going = false;

		MASH.sections.forEach(sec =>
		{
			sec.selection = -1;

			sec.options.forEach(op =>
			{
				op.checked = false;
				op.dom.classList.remove('checked');
				op.dom.classList.remove('chosen');
			});
		});
	}	

	function end()
	{
		Run_Button.set_restart();
	}
}

/*
 * =====================================
 *   varying states of the run button 
 * =====================================
 */

namespace Run_Button
{
	export let run_button: HTML_Div_Element;

	function run_run()
	{
		try
		{
			Spiral.check_spiral_ready();

			MASH.disable_all();

			Spiral.create_spiral_popup();
		}
		catch(ex)
		{
			alert(ex);
		}
	}

	function run_fast()
	{
		Elimination.fast = true;
	}

	function run_restart()
	{
		Elimination.reset_all();

		MASH.enable_all();

		set_run();
	}

	function run_button_change(icon: string, callback: () => void)
	{
		run_button.textContent = icon;
		run_button.onclick = callback;
	}

	export function set_run() { run_button_change('▶', run_run); }
	export function set_fast() { run_button_change('⯮', run_fast); }
	export function set_restart() { run_button_change('⭮', run_restart); }
}

/*
 * =====================================
 *   now we start actually doing stuff 
 * =====================================
 */

/**
 * generates the base page dom
 * also inits MASH
 */
function start(): void
{
	/// check storage for stored color theme
	let ct_store = window.localStorage.getItem('color_theme');
	if(ct_store)
	{
		Theme.apply_theme(Number.parseInt(ct_store));
	}
	else
	{
		Theme.apply_theme();
	}

	/// check storage for stored size
	let sz_store = window.localStorage.getItem('size_theme');
	if(sz_store)
	{
		Theme.apply_size(Number.parseInt(sz_store));
	}
	else
	{
		Theme.apply_size();
	}

	let container = Dom.create_div({parent: document.body, class_name: 'container'});
	let header = Dom.create_div({parent: container, class_name: 'header'});
	let title = Dom.create_par({parent: header, class_name: 'title', text: 'MASH'});
	MASH.dom_sections = Dom.create_div({parent: container, class_name: 'sections'});

	/// create our buttons 
	let button_holder = Dom.create_div({parent: header, class_name: 'button_holder'});
	
	let save_button = Dom.create_div({parent: button_holder, class_name: 'button', text: '🡼'});

	/// create a file opener for our json
	let json_button = Dom.create_div({parent: button_holder, class_name: 'button', text: '䷥'});
	let json_file_open = Dom.create_inp({parent: document.body, class_name: 'hidden', type: 'file'});
	json_file_open.accept = '.json';

	let dec_size_button = Dom.create_div({parent: button_holder, class_name: 'button', text: '❰'});
	let inc_size_button = Dom.create_div({parent: button_holder, class_name: 'button', text: '❱'});
	Run_Button.run_button = Dom.create_div({parent: button_holder, class_name: 'button', text: '▶'});
	let color_button = Dom.create_div({parent: button_holder, class_name: 'button color_wheel', text: '☀'});
	let sec_button = Dom.create_div({parent: button_holder, class_name: 'button', text: '+'});

	/// button functionality
	sec_button.onclick = () =>
	{
		MASH.create_section();
	};

	color_button.onclick = () =>
	{
		Theme.increment_theme();
		Theme.apply_theme();
	};

	dec_size_button.onclick = () =>
	{
		Theme.deincrement_size();
		Theme.apply_size();
	};

	inc_size_button.onclick = () =>
	{
		Theme.increment_size();
		Theme.apply_size();
	};

	json_button.onclick = async () =>
	{
		json_file_open.click();
	};

	json_file_open.onchange = () =>
	{
		let file = json_file_open.files[0];

		let fr = new FileReader();

		fr.onloadend = () =>
		{
			try
			{
				if(!load_json(JSON.parse(<string>fr.result)))
					alert('Incorrect JSON!');
			}
			catch(ex)
			{
				alert('Not a JSON File!');
			}
		};

		try
		{
			fr.readAsText(file);
		}
		catch(ex)
		{
			alert('Not a JSON File!');
		}
	};

	save_button.onclick = () =>
	{
		save_json(MASH.sections);
	};

	Run_Button.set_run();
}

start();