function get_id(name) {
	var id = 0;
	for (var i = 0; i < $('*').length; i++) {
		if (document.getElementById(name + i.toString() + "-window")) {
			id++;
		}
	}
	id = id.toString()
	return id;
}

function __make_window(prefix, id) {
	return {
		window_id: prefix + "-window",
		padding: "10px",
		width: "200px",
		height: "200px",
		titlebar: {
			titlebar_id: prefix + "-titlebar",
			icon_id: prefix + "-icon",
			title_id: prefix + "-title",
			minimize_id: prefix + "-minimize",
			maximize_id: prefix + "-maximize",
			close: prefix + "close"
		},
		identifier: id,
	};
}

function __format_string(text, app) {
	// This must be in a seperate function because eval exposes the local scope
	var formated_string = eval("`" + text + "`");
	return formated_string;
}

function window_create(parent, name, icon = "application", type = "standard", title, width, height, x, y, html) {
	// The ID allows multiple instances of a window
	var id = get_id(name);

	let calculated_width = parseInt((($(window).width() / 2) - (parseInt(width, 10) / 2)), 10);
	let calculated_height = parseInt((($(window).height() / 2) - (parseInt(height, 10) / 2)), 10);

	if (x == undefined) { x = calculated_height + "px"; }
	if (y == undefined) { y = calculated_width + "px"; }

	var prefix = name + id;

	var win = __make_window(prefix, id);
	win.width = width;
	win.height = height;
	win.identifier = id;

	var titlebar_html =
		`<i class="mdi mdi-${icon}" id="${prefix}-icon" aria-hidden="true"></i>
<span id="${prefix}-title">${title}</span>`;

	titlebar_html += `<button class="normal-button titlebar-button" id="${prefix}-close" onclick="window_close('${prefix}-window')"><i class="mdi mdi-close-circle" aria-hidden="true"></i></button>`;
	if (type == "standard") {
		titlebar_html += `<button class="normal-button titlebar-button" id="${prefix}-maximize" onclick="window_maximize('${prefix}-window')"><i class="mdi mdi-plus" aria-hidden="true"></i></button>`;
		titlebar_html += `<button class="normal-button titlebar-button" id="${prefix}-minimize"><i class="mdi mdi-minus" aria-hidden="true"></i></button>`;
	}

	var p = document.getElementById(parent);
	var containing_window = document.createElement("div");
	var titlebar = document.createElement("div");

	containing_window.setAttribute("id", prefix + "-window");
	containing_window.setAttribute("class", "window");
	containing_window.setAttribute("style", `width: ${width}; height: ${height};`);
	titlebar.innerHTML = titlebar_html;
	titlebar.setAttribute("class", "titlebar");
	titlebar.setAttribute("id", `${prefix}-titlebar`)

	var root = document.createElement("div");
	root.setAttribute("style", `padding: ${win.padding}; 
	padding-top: 0px; `);
	root.setAttribute("id", prefix + "-window-root");
	root.setAttribute("class", "scrollbar");
	root.innerHTML = html;

	containing_window.style.top = (titlebar.offsetTop + x);
	containing_window.style.left = (titlebar.offsetLeft + y);

	containing_window.appendChild(titlebar);
	containing_window.appendChild(root);
	p.appendChild(containing_window);
	element_allow_dragging(containing_window, prefix + "-titlebar");

	// This is to stop the root expanding outside the width of the window
	var titlebar_height = document.getElementById(win.titlebar.titlebar_id).clientHeight;
	var h = parseInt(height) - titlebar_height;
	$(`#${win.window_id}-root`).height((h - (titlebar_height / 2) - 1));

	return win;
}

function window_create_from_url(parent, name, icon = "application", type = "standard", title, width, height, x, y, url, onload, custom_data = {}) {
	let request = new XMLHttpRequest();
	var formated_string = "";
	var id = get_id(name);
	var prefix = name + id;

	request.onload = function () {
		if (is_debug) {
			console.log(`GET ${url}`);
			console.log(`status: ${request.status}`);
		}
		if (request.status === 200 || request.status === 304 && request.readyState === 4) {
			var app = __make_window(prefix, id);
			app.custom_data = custom_data;
			app.name = name;

			formated_string = __format_string(request.response, app);

			window_create(parent, name, icon, type, title, width, height, x, y, formated_string);
			if (is_debug) {
				console.log("sucessfully made window");
			}
			if(onload)
			{
				onload(app);
			}
		}
		else if (request.status === 404 || request.status === 0) {
			if (is_debug) {
				console.error(`failed to load ${url}.`);
				console.warn("This could be because you are running in file mode. eg. file:///skiftOS-tour/index.html. Consider using a live server")
			}
		}
	}

	request.open("GET", url);
	request.send();

	return __make_window(prefix, id);
}

// Window controls
function window_close(element_id) {
	var element = document.getElementById(element_id);
	element.parentNode.removeChild(element);
}

function window_maximize(element_id) {
	// FIXME: Fixed values like this causes problems with smaller screens
	$("#" + element_id).css("width", "99.4%");
	$("#" + element_id).css("height", "94%");
	$("#" + element_id).offset({ top: 39, left: 0 });
}

// Window dragging
function element_allow_dragging(element, titlebar_id) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(titlebar_id)) {
		document.getElementById(titlebar_id).onmousedown = dragMouseDown;
	} else {
		element.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		element.style.top = (element.offsetTop - pos2) + "px";
		element.style.left = (element.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
