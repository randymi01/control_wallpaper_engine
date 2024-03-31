// default arguments without wallpaper engine stuff

var config = {
 
    UNITS : 'imperial',
    
    CITY : 'New York',
    
    COUNTRY : 'us',

    APIKEY : '352c52ffaeb3d252f3d76ccab07d7765',
    
    HOUR_24 : false,

    AUDIO_EQ : true
}

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {

        // Read in form values
        if (properties.api_key) {
            api = properties.api_key.value;
        }

        if (properties.country_code) {
            config.COUNTRY = properties.country_code.value;
            getWeather(config.CITY, config.COUNTRY, config.UNITS, config.APIKEY);
        }

        if (properties.city_name) {
            config.CITY = properties.city_name.value;
            getWeather(config.CITY, config.COUNTRY, config.UNITS, config.APIKEY);
        }

        // read in temp and type
        if (properties.units_temp) {
            if (properties.units_temp.value == 2) {
                config.UNITS = 'metric';
            }
            else {
                config.UNITS = 'imperial';
            }
            getWeather(config.CITY, config.COUNTRY, config.UNITS, config.APIKEY);
        }

        if (properties.clock_type) {
            if (properties.clock_type.value == 1) {
                config.HOUR_24 = false;
            }
            else {
                config.HOUR_24 = true;
            }
        }

        if (properties.change_bg){
            ChangeIt();
        }

        if (properties.audio_eq){
            config.AUDIO_EQ = properties.audio_eq.value;
        }
    }
};