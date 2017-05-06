/**
 * Created by rafael on 16/03/17.
 */

app.service('HotkeyService', function($rootScope) {
    // Callbacks for keys
    this.keys = {
        spacebar: function(pressed, key) {console.error('NotImplementedException for key:', key)},
        escape: function(pressed, key) {console.error('NotImplementedException for key:', key)},
        return: function(pressed, key) {console.error('NotImplementedException for key:', key)}
    };

    // States for keys
    this.spacebar = false;

    this.keyDown = function(e) {

        if (e.keyCode == "32"){
            this.keys.spacebar(true, e.key);

            this.spacebar = true;
        }

        if (e.keyCode == "13") {
            this.keys.return(true, e.key);
        }

        if (e.keyCode == "27") {
            this.keys.escape(true, e.key);
        }

    };

    this.keyUp = function(e) {

        if (e.keyCode == "32") {
            this.keys.spacebar(false);

            this.spacebar = false;
        }

    };
});