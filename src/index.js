import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const rowColMap = {
    0: { row: 1, col: 1 },
    1: { row: 1, col: 2 },
    2: { row: 1, col: 3 },
    3: { row: 2, col: 1 },
    4: { row: 2, col: 2 },
    5: { row: 2, col: 3 },
    6: { row: 3, col: 1 },
    7: { row: 3, col: 2 },
    8: { row: 3, col: 3 }
};
function Square(props) {
  console.log("props", props);
  if (props.highlight) {
    return (
    <button
      className={ (props.lastSelected != 'undefined' && props.lastSelected === props.position) ? 'square  active-square': 'square' }
      style={{color: "red"}} onClick={() => props.onClick()}
      title = { 'Row:' + rowColMap[props.position]['row'] + ', Col:' + rowColMap[props.position]['col'] }>
      <span className = "coordinates" > { rowColMap[props.position]['row'] + ',' + rowColMap[props.position]['col'] } < /span>
      {props.value}
    </button>
    );
  } else {
  return (
    <button
      className={ (props.lastSelected != 'undefined' && props.lastSelected === props.position) ? 'square  active-square': 'square' }
      onClick={() => props.onClick()}
      title = { 'Row:' + rowColMap[props.position]['row'] + ', Col:' + rowColMap[props.position]['col'] }>
    <span className = "coordinates" > { rowColMap[props.position]['row'] + ',' + rowColMap[props.position]['col'] } < /span>
      {props.value}
    </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
     let won = false;
     if (this.props.winningPos && this.props.winningPos.indexOf(i) >= 0) {
      // If there is a winning position and positions exist on board
      won = true;
    }
    return <Square key={i} position={i} lastSelected={this.props.lastSelected} value={this.props.squares[i]} highlight={won} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    var rows = [];
    var cells = [];
    var cellNumber = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        cells.push(this.renderSquare(cellNumber))
        cellNumber++
      }
      rows.push(<div key={i} className="board-row">{ cells }</div>)
      cells = [];
    }
    return (
      <div>
        {rows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      ascending: true,
    };
  }

  jumpTo(step) {
  this.setState({
    stepNumber: step,
    xIsNext: (step % 2) ? false : true,
  });
}
   /*
  * Reverse the moves list
  */
  toggleSort() {
    const ascending = this.state.ascending;
    this.setState({
      ascending: !ascending,
    });
  }
    /*
  * Reverts to initial state
  */
  startOver() {
     this.setState({
      history: [{
        squares: Array(9).fill(null),
        lastSelected: 0
      }],
      xIsNext: true,
      stepNumber: 0,
      ascending: true,
    });
  }

   handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // if there's a winner or the cell is already filled
    if (calculateWin(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{
          squares: squares,
          lastSelected: i
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
   }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWin(current.squares);
    const ascending = this.state.ascending;
    const lastSelected = current.lastSelected;
    console.log('lastSelected', lastSelected);

    let status;
    let winningPos;
    if (win) {
      status = 'Winner: ' + win.winner;
      winningPos = win.winningPos;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move:
      'Got to start game';
    return (
      <li key={move}>
        <a href="#" onClick={() => this.jumpTo(move)}>
          {move === this.state.stepNumber ? <b>{desc}</b> : desc}</a>
      </li>

    );
  });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
                 winningPos={winningPos}
                 lastSelected={lastSelected}
                 onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>
            <button onClick={() => this.toggleSort()}> Order </button>
            <button onClick={() => this.startOver()}> Start Over </button>
            <div>{status}</div>
             {(() => this.state.ascending === true? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>) ()}
          </div>
        </div>
      </div>
    );
  }
}

// ========================================


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

/* Calculates if there is a win
 * and returns the winner and the winningLine
 */

function calculateWin(squares) {
   const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningPos: lines[i]
      }
    }
  }
  return null;
}