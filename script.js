var is_debug = false;
var enable_blur = false;

// This module loading function is here because modules aren't offically supported by browsers yet :(
function load_module(url)
{    
    var body = $("body")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
	script.src = url;
    body.insertBefore(script, body.childNodes[0]);
}

load_module("./modules/window.js");
load_module("./modules/utils.js");

function menu_hide() {
	if(enable_blur)
	{
		var blur_backdrop = document.getElementById("blur-menu");
		if(blur_backdrop)
		{
			blur_backdrop.remove();
		}
	}
	$("#menu").css("display", "none");
}

function menu_show() {
	if(enable_blur)
	{

		var blur_backdrop = document.createElement("div");
		blur_backdrop.setAttribute("class", "menu")

		blur_backdrop.setAttribute("id", "blur-menu");
		document.getElementById("desktop").appendChild(blur_backdrop);

		$("#blur-menu").css("display", "block");
		$("#blur-menu").css("backdrop-filter", "blur(9px)");
		$("#blur-menu").css("z-index", "1900");
	}
	$("#menu").css("display", "flex");
}

var update_clock = setInterval(function () {
	var now = new Date();
	var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	$("#time").text(time);
}, 1000);

$("#features-menu-item").click(function () {
	menu_hide();
	window_create_from_url("desktop", "features", "information", "dialogue", "Overview", "720px", "530px", undefined, undefined, "views/overview.html");
});

$("#releases-menu-item").click(function () {
	menu_hide();
	var onload = function (app) {
		load_releases(`${app.name + app.identifier}`);
	};
	window_create_from_url("desktop", "releases", "tag", "dialogue", "", "720px", "530px", undefined, undefined, "views/releases.html", onload);
});

register_link("src-code-menu-item", "https://github.com/skiftOS/skift");

$("#applications_btn").click(function () {
	menu_show();
});

if (!is_debug) {
	// Extra spice
	$(window).contextmenu(function () {
		return false;
	});
	$("body").css("overflow", "hidden");
}

if(enable_blur)
{
	$("#menu").css("opacity", "0.8");
	$("#panel").css("opacity", "0.8");

	var blur_backdrop = document.createElement("div");
	blur_backdrop.setAttribute("class", "panel")

	blur_backdrop.setAttribute("id", "blur-panel");
	document.getElementById("desktop").appendChild(blur_backdrop);

	$("#blur-panel").css("display", "block");
	$("#blur-panel").css("height", "37px");
	$("#blur-panel").css("border-width", "0px");
	$("#blur-panel").css("backdrop-filter", "blur(9px)");
	$("#blur-panel").css("z-index", "900");
}

$(window).click(function () {
	menu_hide();
});

$('#applications_btn').click(function (event) {
	event.stopPropagation();
});

$('#menu').click(function (event) {
	event.stopPropagation();
});

function register_link(id, url, is_dynamic=false)
{

	if(!is_dynamic)
	{
		$("#" + id).click(function () {
			menu_hide();
			$(location).attr("href", url);
		});
	} else {
		$("body").on("click", "#" + id, function () {
			menu_hide();
			$(location).attr("href", url);
		});
	}

	if(!is_dynamic)
	{
		$("#" + id).hover(function () {
			$("#status-bar").text(url);
			$("#status-bar").css("display", "block");
		}, function() {
			$("#status-bar").text("");
			$("#status-bar").css("display", "none");
		});
	} else {
		$("body").on("mouseenter", "#" + id, function () {
			$("#status-bar").text(url);
			$("#status-bar").css("display", "block");
		});
		$("body").on("mouseleave", "#" + id, function () {
			$("#status-bar").text("");
			$("#status-bar").css("display", "none");
		});
	}
}
