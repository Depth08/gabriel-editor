/**
 * Created by Rafael on 6/04/2017.
 */

app.controller('SvgController', function($scope, PanZoomService, HotkeyService) {

    var buildings = [];

    var selectedBuilding = -1;

    var gridSize = 50;

    var snapping = true;

    this.getBuildings = function() {
        return buildings;
    };

    this.getGridSize = function() {
        return gridSize;
    };

    var zoomLevel = PanZoomService.zoomLevel;
    var controller = this;

    this.increaseGrid = function() {
        if (gridSize < 400) gridSize *= 2;
    };

    this.decreaseGrid = function() {
        if (gridSize > 12.5) gridSize /= 2;
    };

    // Checks if two 2D point objects are equal
    var pointsEqual = function (point1, point2) {
        if (point1 != undefined && point2 != undefined && point1.hasOwnProperty('x') && point1.hasOwnProperty('y') && point2.hasOwnProperty('x') && point2.hasOwnProperty('y')) {
            return point1.x == point2.x && point1.y == point2.y;
        }

        return false;
    };

    // Convert a global coordinate to local by an origin point
    var convertToLocal = function(globalPoint, origin) {
        return {
            x: globalPoint.x - origin.x,
            y: globalPoint.y - origin.y
        }
    };

    // Convert a local coordinate to global by its origin point
    var convertToGlobal = function(localPoint, origin) {
        return {
            x: localPoint.x + origin.x,
            y: localPoint.y + origin.y
        }
    };

    // Get points, snapped or not (observes whether snapping is on or not)
    var getCoordinates = function(e) {
        if (snapping) {
            return snapToGrid(e);
        }
        else {
            return getRawCoordinates(e);
        }
    };

    // Snaps a given point to grid
    var snapToGrid = function(e) {
        var point = getRawCoordinates(e);

        // Decimate precision by rounding
        var gridX = Math.round(point.x / gridSize) * gridSize;
        var gridY = Math.round(point.y / gridSize) * gridSize;

        return {
            x: gridX,
            y: gridY
        };
    };

    // Get proper coordinates within editor space according to bounds
    var getRawCoordinates = function(e) {
        var bounds = $('.svg-pan-zoom_viewport')[0].getBoundingClientRect();

        return {
            x: Math.round((e.clientX - bounds.left) / PanZoomService.zoomLevel()),
            y: Math.round((e.clientY - bounds.top) / PanZoomService.zoomLevel())
        }
    };

    var removeWallGhostsForBuilding = function(buildingId) {
        buildings[buildingId].walls.forEach(function(wall) {
            if (wall.corners.last().ghost) wall.corners.pop();
        });
    };

    var removeGhostForBuilding = function(buildingId) {
        if (buildings[buildingId].buildingOutline.last().ghost) buildings[buildingId].buildingOutline.pop();
    };

    var selectBuilding = function(id) {
        // Deselects all other buildings and pops ghosts
        buildings.forEach(function(building, index) {
            removeWallGhostsForBuilding(index);

            building.selected = false;
        });

        if (id >=0) buildings[id].selected = true;
    };

    var getActiveBuildingId = function() {
        var id = -1;

        buildings.forEach(function(building, index) {
            if (building.selected) {
                id = index;
            }
        });

        return id;
    };

    var completeLastWallInBuilding = function(id) {
        // Remove ghosting
        removeWallGhostsForBuilding(id);

        buildings[id].walls.last().finished = true;
    };

    var completeLastBuilding = function() {
        removeGhostForBuilding(buildings.length - 1);

        buildings.last().finished = true;
    };

    this.hoverVoid = function(tool, $event) {
        if (tool == 'building' && buildings.length > 0 && !buildings.last().finished && !HotkeyService.spacebar) {
            if (buildings.last().buildingOutline.last().ghost) {
                buildings.last().buildingOutline.pop();
            }

            // Where did you click, get those coordinates (snapping or not)
            var globalPoint = getCoordinates($event);

            // Convert those coordinates to a local scheme by origin
            var localPoint = convertToLocal(globalPoint, buildings.last().origin);

            // Add that to the outline of the building temporarily
            buildings.last().buildingOutline.push({
                x: localPoint.x,
                y: localPoint.y,
                ghost: true
            });
        }
    };

    this.hoverBuilding = function(tool, $event, buildingId) {
        if (tool == 'wall' && buildings[buildingId].selected && buildings[buildingId].walls.length > 0 && !buildings[buildingId].walls.last().finished && !HotkeyService.spacebar) {
            if (buildings[buildingId].walls.last().corners.last().ghost) {
                buildings[buildingId].walls.last().corners.pop();
            }

            // Where did you click, get those coordinates (snapping or not)
            var globalPoint = getCoordinates($event);

            // Convert those coordinates to a local scheme by origin
            var localPoint = convertToLocal(globalPoint, buildings[buildingId].origin);

            // Add that to the outline of the building temporarily
            buildings[buildingId].walls.last().corners.push({
                x: localPoint.x,
                y: localPoint.y,
                ghost: true
            });
        }
    };

    this.clickVoid = function(tool, $event) {
        if (tool == 'pointer') {
            // Same as deselect
            selectBuilding(-1);
        }
    };

    this.clickBuilding = function(tool, $event, buildingId) {
        if (tool == 'pointer' && !HotkeyService.spacebar) {
            selectBuilding(buildingId);
        }

        // If the tool is a wall tool
        if (tool == 'wall' && !HotkeyService.spacebar) {
            if (getActiveBuildingId() != buildingId) {
                // Select building if it was different from before
                selectBuilding(buildingId);

                // Do absolutely nothing yet to prevent making walls
                return
            }

            if (!buildings[buildingId].walls.length || buildings[buildingId].walls.last().finished) {
                // Create a new wall if there isn't one unfinished
                buildings[buildingId].walls.push({
                    finished: false,
                    corners: []
                });
            }

            // Where did you click, get those coordinates (snapping or not)
            var globalPoint = getCoordinates($event);

            // Convert those coordinates to a local scheme by origin
            var localPoint = convertToLocal(globalPoint, buildings[buildingId].origin);

            // Add that to wall array
            buildings[buildingId].walls.last().corners.push({
                x: localPoint.x,
                y: localPoint.y
            });
        }
    };

    // TODO: Spread onClicks across multiple shapes
    // Whenever viewport is being clicked
    this.clickEditor = function(tool, $event) {
        // If the tool is a building tool
        if (tool == 'building' && !HotkeyService.spacebar) {
            // Is this your first time here sir?
            if (!buildings.length || buildings.last().finished) {
                // Create a new empty building
                buildings.push({
                    id: buildings.length,
                    selected: false,
                    finished: false,
                    origin: getCoordinates($event),
                    buildingOutline: [],
                    walls: []
                });
            }

            // So either we have created an unfinished building, or we continue working on an unfinished building...

            // Where did you click, get those coordinates (snapping or not)
            var globalPoint = getCoordinates($event);

            // Convert those coordinates to a local scheme by origin
            var localPoint = convertToLocal(globalPoint, buildings.last().origin);

            // Check for duplicate ghost point
            if (buildings.last().buildingOutline.length > 0 && buildings.last().buildingOutline.last().ghost) buildings.last().buildingOutline.pop();

            // Now if you click on the point where you started, you finish the shape
            if (pointsEqual(localPoint, buildings.last().buildingOutline[0])) {
                buildings.last().finished = true;
                selectBuilding(buildings.indexOf(buildings.last()));
                return
            }

            // Add that to the outline of the building
            buildings.last().buildingOutline.push({
                x: localPoint.x,
                y: localPoint.y
            });
        }
    };

    // TODO: This shit is not working very well. When you move fast, it's destination FUCKED
        // Whenever room is clicked
        this.startRoomMove = function(room, tool) {
            if (tool == 'pointer') {
                room.moving = true;
            }
        };

        // Whenever room is unclicked
        this.stopRoomMove = function(room) {
            room.moving = false;
        };

        // While room is moused down
        this.updateRoomMove = function($event, room, tool) {
            if (room.moving && tool == 'pointer') {
                room.origin.x = getParams($event).gridX;
                room.origin.y = getParams($event).gridY;
            }
        };

    // TODO: inconsistency detected with last() usage
    // Handle autocomplete
    HotkeyService.keys.return = function(pressed) {
        // Autocomplete a building if not finished
        if (buildings.length > 0 && !buildings.last().finished) {
            completeLastBuilding();
        }

        // Autocomplete a wall
        if (getActiveBuildingId() != -1) {
            completeLastWallInBuilding(getActiveBuildingId());
        }
    };

    // Gives you the points in format for an SVG path/polygon
    this.toSvgPoints = function(points, origin) {
        return toSvgPoints(points, origin);
    };
    
    // Makes a neat SVG points string for the polygon elements
    var toSvgPoints = function(points, origin) {
        if (points === undefined) {
            return '';
        }

        var result = '';

        for (var i = 0; i < points.length; i++) {
            // Get the current point (which is relative)
            var point = points[i];

            // Convert to global coordinates according to origin
            var globalPoint = convertToGlobal(point, origin);

            result += (globalPoint.x);
            result += ',';
            result += (globalPoint.y);
            result += ' ';
        }

        return result;
    };

    PanZoomService.reload();
});