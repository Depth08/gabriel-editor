# Gabriel Editor

> Map creation tool for the Gabriel Project B-AIM 2017. This is an in-development demo and not a final product.

## Install

Make sure you have *bower* and *npm* installed globally on your system.

`npm install`
`bower install`

## Usage

### Three tools have been implemented:

* The selection tool
* The building placement tool
* The wall placement tool

### The following flow is adhered to:

1. Create a building with the building placement tool. Adjust the grid to your preference.
2. Using either pointer or wall placement tools, click inside the new building, which should highlight it.
3. You may now place walls anywhere within this building.

### Tips:

* Using the return key auto-completes a shape.

### Points to consider:

* Walls in angles require a certain algorithm for snapping. This is definitely a TODO.
* Click events are tied to their respective buildings, making it not very friendly to click where you want a corner to be.
* Dashed lines for in-progress walls should scale to the grid size.

## Future work

* Snapping
* Polar coordinates and wall placement in user defined angles
* Objects like doors and important decoration
* Layers
* Decorative shapes
* Areas with labels
* Save and Load