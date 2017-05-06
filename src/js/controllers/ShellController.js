/**
 * Created by rafael on 15/03/17.
 */

app.controller('ShellController', function(HotkeyService, PanZoomService) {

    this.selectedTool = 'pointer';

    // Bind events to hotkeyservice
    this.keyboard = HotkeyService;

    this.keyboard.keys.spacebar = function(pressed) {
        PanZoomService.enablePan(pressed);
    };

    this.selectTool = function(tool) {
        this.selectedTool = tool;
    }
});