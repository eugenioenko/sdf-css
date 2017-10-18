# SDF CSS Framework (in progress)
>[Latest demo and examples](https://eugenioenko.github.io/sdf-css/docs/)


## Design Principle
The idea of this framework is to create the minimal set of class names which should style contextually the maximum amount of elements.

## Theme Colors
The framework implements a set of theme color modifiers which regardless of their combination should present all the elements cohesively and clean.

## Grid System
SDF CSS grid is a combination of flexbox and clearfix bock.
By having separated the cell/col width class modifier it's possible to have both grid systems coexist in the same space without adding extra weight to the stylesheet files.

### Flexbox grid
Flexbox grid consiste of two components: sdf-grid and sdf-cell.
The grid component doesn't have to be wrapped in another element.
If the grid component is nested inisde a cell, only then it will have a negative horizontal margin. All the cells will stay aligned and no extra wrapper for grid is required.
It is also possible to have cells which are grids for easier nesting and to avoid using an extra dom element by having both classes in the same element.

#### Gutter
By default the grid has 2rem (32px) gutter between each cell which means that each cell has a horizontal padding of 1rem.
If a grid is nested inside a cell, it will have a negative horizontal margin of 1rem, thus when a cell is added to the nested grid, the alignment stays consistent.
If a cell is also a grid it will have no margin and no padding. This way when cells are added to the cell-grid theirs padding will stay consistent.

#### Possible combinations of grid nesting
* grid > cell
* grid > cell > grid > cell ... etc
* grid > cell-grid > cell

Cells can be only children of grids and other cells with the class grid (cell-grids)
Grids can be children of cells.
Grids can't be children of grids nor cell-grids.
