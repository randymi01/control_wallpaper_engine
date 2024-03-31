var lastResponse = false;
var successful_request = true;

// offset for Ann Arbor
var unix_time_zone_offset = -14400;

var last_city = "";

function updateTime(unix_time_zone_offset_f) {
	var currentDate = new Date();
	var utcDate = new Date(Date.UTC(currentDate.getUTCFullYear(), 
                   currentDate.getUTCMonth(), 
                   currentDate.getUTCDate(), 
                   currentDate.getUTCHours(), 
                   currentDate.getUTCMinutes(), 
                   currentDate.getUTCSeconds(), 
                   currentDate.getUTCMilliseconds()));

	// weather offset			   
	var timeZoneOffset = unix_time_zone_offset_f;

	// user browser offset 	
	var user_browser_offset = new Date().getTimezoneOffset()/-60 * 3600;

	var unix_time = utcDate.getTime() + timeZoneOffset * 1000 - user_browser_offset * 1000;
	var d = new Date(unix_time);
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();

	var ampm = config.HOUR_24 ? "" : (h < 12 ? " AM" : " PM");

	if (h > 12 && !config.HOUR_24) {
		h = h - 12;
	}

	if (h == 0 && !config.HOUR_24) {
		h = 12;
	}

	if (m < 10) {
		m = "0"+m;
	}

	if (s < 10) {
		s = "0"+s;
	}

	var month = d.getMonth();
	var day = d.getDate();
	var year = d.getFullYear();
	var weekday = d.getDay();

	var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
	var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

	var output = ""+days[weekday]+"  &nbsp; / &nbsp;  "+months[month] + " "+day+" &nbsp; / &nbsp; "+year+"";

	$('#time-title').html(h + ":" + m + ":" + s + ampm);
	$('#time-subtitle').html(output);
}

function updateWeather(lastResponse, request_status) {
	if (request_status) {
		var main = lastResponse.weather[0].description;
		var temp = lastResponse.main.temp;
		var low = lastResponse.main.temp_min;
		var high = lastResponse.main.temp_max;
		unix_time_zone_offset = lastResponse.timezone;

		var tchar = "";
		if (config.UNITS == "imperial") {
			tchar = "F";
		}
		else{
			tchar = "C";
		}

		main = main.substr(0,1).toUpperCase() + main.substr(1);
    	

		$('#wtext').html(main.toUpperCase() + " &nbsp; / &nbsp; " + temp + "&deg;" + tchar + " &nbsp; / &nbsp; " + low + "&deg;" + tchar + " - " + high + "&deg;" + tchar);
		$('#wtext').css("color", "#32CD32");
		$('#city-input').css("color", "#32CD32");
		setTimeout(function(){ 
			$('#wtext').css("color", "#FFFFFF");
			$('#city-input').css("color", "#FFFFFF");
		}, 300);

		document.getElementById("city-input").innerHTML = last_city.toUpperCase();


	}
	else{
		console.log("bad request");

		
		setTimeout(function(){ 
			$('#wtext').css("color", "#FFFFFF");
			$('#city-input').css("color", "FFFFFF");
		}, 300);

		$('#wtext').css("color", "FF0000");
		$('#city-input').css("color", "FF0000");

	}
}

function getWeather(city, country, units, api) {
	last_city = city;
	req = $.getJSON('https://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&units=' +units +'&appid=' + api,
	function(resp) {
		lastResponse = resp;
		successful_request = true;
		updateWeather(lastResponse, successful_request);
	})
	.fail(function() { 
		successful_request = false;
		console.log("failed request in get_weather");
		updateWeather(lastResponse, successful_request);
	});
}

$(document).ready(function() {
	
	getWeather(config.CITY, config.COUNTRY, config.UNITS, config.APIKEY);

	$('input[name="city"]').attr("placeholder",config.CITY.toUpperCase());

	particlesJS('particles-js', {
		"particles": {
			"number": {
				"value": 40,
				"density": {
					"enable": false,
					"value_area": 800
				}
			},
			"color": {
				"value": "#FFFFFF"
			},
			"shape": {
				"type": "circle",
				"stroke": {
					"width": 0,
					"color": "#000000"
				},
				"polygon": {
					"nb_sides": 5
				}
			},
			"opacity": {
				"value": 1,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 1,
					"opacity_min": 0.1,
					"sync": false
				}
			},
			"size": {
				"value": 5,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 10,
					"size_min": 0.1,
					"sync": false
				}
			},
			"line_linked": {
				"enable": true,
				"distance": 150,
				"color": "#ffffff",
				"opacity": 0.4,
				"width": 1
			},
			"move": {
				"enable": true,
				"speed": 0.5,
				"direction": "top",
				"random": false,
				"straight": false,
				"out_modehour": "out",
				"attract": {
					"enable": false,
					"rotateX": 600,
					"rotateY": 1200
				}
			}
		},
		"interactivity": {
			"detect_on": "window",
			"events": {
				"onhover": {
					"enable": false,
					"modehour": "repulse"
				},
				"onclick": {
					"enable": false,
					"modehour": "push"
				},
				"resize": true
			},
			"modehours": {
				"grab": {
					"distance": 400,
					"line_linked": {
						"opacity": 1
					}
				},
				"bubble": {
					"distance": 400,
					"size": 40,
					"duration": 2,
					"opacity": 8,
					"speed": 3
				},
				"repulse": {
					"distance": 200
				},
				"push": {
					"particles_nb": 4
				},
				"remove": {
					"particles_nb": 2
				}
			}
		},
		"retina_detect": true,
		"config_demo": {
			"hide_card": false,
			"background_color": "#b61924",
			"background_image": "",
			"background_position": "50% 50%",
			"background_repeat": "no-repeat",
			"background_size": "cover"
		}
	});



	setInterval(function() {
		updateTime(unix_time_zone_offset);
	}, 1000);

	setInterval(function() {
		getWeather(config.CITY, config.COUNTRY, config.UNITS, config.APIKEY);
	}, (1000 * 60 * 5));
	
});



