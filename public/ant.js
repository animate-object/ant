/**
 * Constants
 */
const WHITE = "#ffffff";
const RED = "#ff0000";
const GREEN = "#00ff00";
const BLUE = "#0000ff";

const RIGHT = "right";
const LEFT = "left";

const NORTH = "north";
const SOUTH = "south";
const WEST = "west";
const EAST = "east";

const TURNS = {
  [LEFT]: {
    [NORTH]: WEST,
    [WEST]: SOUTH,
    [SOUTH]: EAST,
    [EAST]: NORTH,
  },

  [RIGHT]: {
    [NORTH]: EAST,
    [EAST]: SOUTH,
    [SOUTH]: WEST,
    [WEST]: NORTH,
  },
};

const RULES = [
  {
    current: WHITE,
    newColor: RED,
    turn: LEFT,
  },
  {
    current: RED,
    newColor: WHITE,
    turn: RIGHT,
  },
  // { current: GREEN, newColor: BLUE, turn: RIGHT },
  // { current: BLUE, newColor: WHITE, turn: RIGHT },
];

/**
 * Helpers
 */

const area = ({ width, height }) => width * height;

const toPoint = ({ width, _ }, index) => {
  const row = Math.floor(index / width);
  const col = index % width;

  return { y: row, x: col };
};

const toIndex = ({ width, _ }, { x, y }) => y * width + x;

const moveInDirection = ({ x, y }, heading) => {
  switch (heading) {
    case NORTH:
      return { x, y: y - 1 };
    case EAST:
      return { x: x + 1, y };
    case SOUTH:
      return { x, y: y + 1 };
    case WEST:
      return { x: x - 1, y };
  }
};

/**
 * Initializers
 */

const newPoint = (x = 0, y = 0) => ({ x, y });
const newCell = (color = WHITE) => ({ color });
const newGame = ({ width, height }) => {
  const grid = Array(height)
    .fill(undefined)
    .map((row) =>
      Array(width)
        .fill(undefined)
        .map(() => newCell())
    );

  const antPosition = newPoint(Math.floor(width / 2), Math.floor(height / 2));

  const ant = {
    position: antPosition,
    heading: EAST,
  };

  return {
    grid,
    dim: { width, height },
    ant,
    rules: RULES,
    gen: 0,
  };
};

/** LOGIC */

const applyRuleToCell = (rule, cell) => {
  return {
    ...cell,
    color: rule.newColor,
  };
};

const applyRuleToAnt = (rule, ant) => {
  let newHeading = TURNS[rule.turn][ant.heading];

  return { ...ant, heading: newHeading };
};

const tick = (gameState) => {
  const newAntPosition = moveInDirection(
    gameState.ant.position,
    gameState.ant.heading
  );
  const newCell = gameState.grid[newAntPosition.y][newAntPosition.x];

  const { updatedAnt, updatedCell } = gameState.rules.reduce(
    (acc, rule) => {
      if (rule.current === newCell.color) {
        return {
          updatedAnt: applyRuleToAnt(rule, acc.updatedAnt),
          updatedCell: applyRuleToCell(rule, acc.updatedCell),
        };
      } else {
        return acc;
      }
    },
    {
      updatedAnt: { ...gameState.ant, position: newAntPosition },
      updatedCell: newCell,
    }
  );

  gameState.ant = updatedAnt;
  gameState.grid[updatedAnt.position.y][updatedAnt.position.x] = updatedCell;
  gameState.gen = gameState.gen + 1;
};

/** DOM */
const drawGrid = ({ width, height }, size, node) => {
  const table = document.createElement("table");
  for (let row = 0; row < height; row++) {
    const row = document.createElement("tr");
    for (let col = 0; col < width; col++) {
      const col = document.createElement("td");
      col.style.height = `${size}px`;
      col.style.width = `${size}px`;
      row.appendChild(col);
    }
    table.appendChild(row);
  }

  node.appendChild(table);
};

const updateGrid = (gameState, tableRoot) => {
  const cells = tableRoot.getElementsByTagName("td");

  for (let idx = 0; idx < area(gameState.dim); idx++) {
    const { x, y } = toPoint(gameState.dim, idx);
    cells[idx].classList.remove("ant");
    cells[idx].style["background-color"] = gameState.grid[y][x].color;
  }

  cells[toIndex(gameState.dim, gameState.ant.position)].classList.add("ant");
};
