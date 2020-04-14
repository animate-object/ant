# Notes

- how to maintain the state of a grid ?

* flat string (store dimensions and navigate using some x/y math)
* 2d array

# cells

each cell has a color

# ant

treat ant like a 'cursor'

Cell {
color: #000000
}

Ant {
position: { x, y }
}

RuleSet {
color: #000000
direction: "right" | "left"
}

GameState {
grid: cell[][],
ant: Ant,
ruleSet: Rule[]
}

# Todo List

1. draw a grid
2. put the ant on the grid
3. write core update cycle
   - inspect the state of game (where is ant, what is the state of the grid)
   - process updates
   - redraw
   - hard coded rules are okay (we might want to make them configurable later)
