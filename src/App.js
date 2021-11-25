import { useState } from "react";

const EXAMPLE_1 = `
##########
#   #    #
#   #    #
## #### ##
#        #
#        #
#  #######
#  #  #  #
#        #
##########
`;

const EXAMPLE_2 = `
##########
#   #    #
#   #    #
## #### ##
#        #
#        #
##########
`;

const makeLines = (input) => {
  return input.split("\n");
};

const isDoor = (inputLines, i, j) => {
  if (
    (i - 1 < 0 || inputLines[i - 1][j] === "#") &&
    (i + 1 >= inputLines.length || inputLines[i + 1][j] === "#")
  )
    return true;

  if (
    (j - 1 < 0 || inputLines[i][j - 1] === "#") &&
    (j + 1 >= inputLines[i].length || inputLines[i][j + 1] === "#")
  )
    return true;

  return false;
};

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

const findEmptySpaceInLine = (inputLines, i) => {
  const line = inputLines[i];
  for (let j = 0; j < line.length; j++) {
    const cell = line[j];

    if (cell !== "#" && cell === " " && !isDoor(inputLines, i, j)) {
      return j;
    }
  }

  return -1;
};

const findEmptySpace = (inputLines) => {
  for (let i = 0; i < inputLines.length; i++) {
    let line = inputLines[i];
    for (let j = 0; j < line.length; j++) {
      const cell = line[j];

      if (cell !== "#" && cell === " " && !isDoor(inputLines, i, j)) {
        return [i, j];
      }
    }
  }

  return [-1, -1];
};

const fillLine = (inputLines, startI, startJ, i, roomNum) => {
  const firstSpace = findEmptySpaceInLine(inputLines, i);

  if (firstSpace === -1) {
    return -1;
  }
  let wallCountOfLine = 0;
  for (
    let j = i === startI ? startJ : firstSpace;
    j < inputLines[i].length;
    j++
  ) {
    const cell = inputLines[i][j];
    if (cell === "#" || cell !== " " || isDoor(inputLines, i, j)) {
      wallCountOfLine++;
      return wallCountOfLine;
    }

    inputLines[i] = setCharAt(inputLines[i], j, roomNum);
  }
  return wallCountOfLine;
};

const fillRooms = (inputLines, roomNum) => {
  const [startI, startJ] = findEmptySpace(inputLines);
  if (startI === -1) {
    return;
  }

  for (let i = startI; i < inputLines.length; i++) {
    const wallCountOfLine = fillLine(inputLines, startI, startJ, i, roomNum);
    if (
      wallCountOfLine === -1 ||
      wallCountOfLine + (i === startI ? startJ : 0) === inputLines[i].length
    ) {
      return;
    }
  }
};

const makeColorizedApp = (input) => {
  const inputLines = makeLines(input);

  let [startI, startJ] = findEmptySpace(inputLines);
  let roomNum = 1;
  while (startI !== -1) {
    fillRooms(inputLines, roomNum++);
    [startI, startJ] = findEmptySpace(inputLines);
  }

  return inputLines;
};

const makeColor = (cell) => {
  if (cell % 3 === 0) return `rgb(${255 - cell * 15},0,0)`;
  else if (cell % 3 === 1) return `rgb(0,${255 - cell * 15},0)`;
  return `rgb(0,0,${255 - cell * 15})`;
};

const paintRooms = (input) => {
  return input.map((line) => {
    let res = [];
    for (let i = 0; i < line.length; i++) {
      let cell = line[i];
      if (cell === " ") cell = "D";
      res.push(
        <span
          key={i}
          style={{
            minWidth: "20px",
            height: "20px",
            backgroundColor: cell === "#" ? "white" : makeColor(cell),
          }}
        >
          {cell}
        </span>
      );
    }
    res.push(<br></br>);
    return res;
  });
};

function App() {
  const [example, setExample] = useState(1);
  const res = makeColorizedApp(example % 2 === 0 ? EXAMPLE_1 : EXAMPLE_2);
  const painted = paintRooms(res);

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={() => setExample(example + 1)}>Change Example</button>
      {painted}
    </div>
  );
}

export default App;
