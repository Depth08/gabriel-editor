/**
 * Created by Rafael on 6/04/2017.
 */

app.service('PanZoomService', function($timeout) {
    var panZoomMap = {};
    var zoomLevel = 1;

    return {
        zoomLevel: function() {
            return zoomLevel;
        },
        get: function() {
            return panZoomMap;
        },
        reload: function() {
            $timeout(function() {
                panZoomMap = svgPanZoom('#svgMap', {
                    fit: false,
                    center: true,
                    panEnabled: false,
                    zoomScaleSensitivity: 0.5,
                    minZoom: 0.05,
                    dblClickZoomEnabled: false,
                    onZoom: function(newZoomLevel) {
                        zoomLevel = newZoomLevel;
                    }
                });
            }, 0);
        },
        enablePan: function(yesOrNo) {
            if(yesOrNo) {
                panZoomMap.enablePan();
            } else {
                panZoomMap.disablePan();
            }
        }
    }
});