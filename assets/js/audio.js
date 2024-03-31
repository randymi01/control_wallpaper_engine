var WE_visualizer = (function($, createjs) {

    // Scope defintion to empty object
    var _ = {};

    var transitionAudioData = [];
    var newAudioData = [];
    
    _.setCanvasSize = function() {
        // Set canvas width and height attributes to screen resolution
        var width = $(document).width();
        var height = $(document).height();
        $("#canvas").attr({
            width: width,
            height: height
        });
    
        console.log("Canvas Width: " + width + ", Canvas Height: " + height);

    }

    // Initializer function
    var init = function() {
        _.setCanvasSize();
        // Create stage for the canvas with ID '#canvas'
        stage = new createjs.Stage("canvas");
    
        // Performance
        stage.snapToPixel = true;
        stage.snapToPixelEnabled = true;
    
        _.bind();
    
        // Every 'tick' is the is a 'Frame per Second'
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", _.draw);
    }
    
    // Bind events to the visualizer
    _.bind = function() {
        if (window.wallpaperRegisterAudioListener) {
    
            window.wallpaperRegisterAudioListener(function(data) {
                // data is an array with 128 floats
                newAudioData = data;
    
                if (transitionAudioData.length == newAudioData.length) {
                    // Transition fadedSoundData to 
                    createjs.Tween.get(transitionAudioData, {
                        override: true
                    }).to(newAudioData, 50);
                } else {
                    transitionAudioData = newAudioData;
                }
            });
        } else {
            setInterval(function() {
                transitionAudioData = [];
                for (x = 0; x < 128; x++) {
                    transitionAudioData.push(Math.random());
                }
            }, 75);
        }
    }

    function sumArraySlice(arr, start, end) {
        // inclusive start and end indices
        // Check if the start and end indices are valid
        if (start < 0 || end >= arr.length || start > end) {
            return 0.0;
        }
    
        // Initialize sum to 0
        var sum = 0.0;
    
        // Iterate over the specified range and accumulate the values
        for (var i = start; i <= end; i++) {
            sum += arr[i];
        }
    
        return sum;
    }

    // reshapes audiodata to length l
    function audio_reshape(audioData, l){
        if (l == audioData.length){
            return audioData;
        }

        var factor = audioData.length / (l + 0.0);

        var reshaped = [];

        var curr_idx, next_idx, next_rem, curr_rem, middle_sum, rem_sum;

        for (var i = 0; i < audioData.length; i += factor){
            curr_idx = Math.floor(i);
            curr_rem = curr_idx + 1 - i;
            
            next_idx = Math.floor(i + factor);
            next_rem = i + factor - next_idx;

            if (curr_idx == next_idx){
                reshaped.push(audioData[curr_idx]);
                continue;
            }

            middle_sum = sumArraySlice(audioData, curr_idx + 1, next_idx - 1);
            rem_sum = audioData[curr_idx] * curr_rem + audioData[next_idx] * next_rem;
            
            reshaped.push((middle_sum + rem_sum) / factor);
        }
        
        return reshaped;

    }

    // Draw to canvas
    _.draw = function() {

        // Clear Stage
        stage.removeAllChildren();

        if (config.AUDIO_EQ){
            // set line properties
            var number_of_lines = 120;
            var spacing = 12; // spacing between lines in pixels
            var lineHeightMultiplier = stage.canvas.height * 0.95; // maximum height
            var color = "white"; // color string ( rgba(255,0,0,1), #FF0000, red )

            var reshaped_audio = audio_reshape(transitionAudioData, number_of_lines);
            var lineWidth = Math.ceil((stage.canvas.width - ((number_of_lines - 1) * spacing)) / number_of_lines); // width of lines in pixels

            var middle_y = stage.canvas.height / 2;
        
            // We will loop through all values of the transition audio data and create a line for it
            for (var x = 0; x < reshaped_audio.length; x++) {
        
                // Get audio value from the data set for current position
                var audioValue = reshaped_audio[x];
        
                // Multiply the value in the audio data set with the height multiplier. 
                var lineHeight = audioValue * lineHeightMultiplier;
        
                // Create a new line-shape object
                var line = new createjs.Shape();
        
                // Set the width of the line, and the caps to 'square'
                line.graphics.setStrokeStyle(lineWidth, "square");
        
                // Set the color of the line to color
                line.graphics.beginStroke(color);
        
                // Draw the line from {x,y}, to {x,y}
                line.graphics.moveTo(x * (spacing + lineWidth), -lineHeight + middle_y);
                line.graphics.lineTo(x * (spacing + lineWidth), lineHeight + middle_y);
        
                // Add the line to the stage
                stage.addChild(line);
            }

            // Draw a line in the middle of the equalizer
            /*
            var line = new createjs.Shape();
            line.graphics.setStrokeStyle(10, "rounded");
            line.graphics.beginStroke(color);
            line.graphics.moveTo(0, middle_y);
            line.graphics.lineTo(stage.canvas.width, middle_y);
            stage.addChild(line);
            */
        
            // Update the stage ( this is the actual drawing method )
        }
        stage.update();

    }
        
        
    $(document).ready(function() {
        // Initializer WE Visualizer
        init();
    });

})(jQuery, createjs);



