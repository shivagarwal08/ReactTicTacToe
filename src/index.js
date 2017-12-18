import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

const rowColMap = {
  0: {row: 1, col: 1},
  1: {row: 1, col: 2},
  2: {row: 1, col: 3},
  3: {row: 2, col: 1},
  4: {row: 2, col: 2},
  5: {row: 2, col: 3},
  6: {row: 3, col: 1},
  7: {row: 3, col: 2},
  8: {row: 3, col: 3}
};


class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }
  render() {
      return (
        <button className="square"
          onClick={ () => this.props.onClick()}
          title=  { 'Row:' + rowColMap[this.props.position]['row'] + ', Col:' +rowColMap[this.props.position]['col']} >
          <span className="coordinates">{rowColMap[this.props.position]['row'] + ',' +rowColMap[this.props.position]['col']}</span>
          { this.props.value }
        </button>
      );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        position={i}
        value={this.props.squares[i]}
        onClick={ () => this.props.onClick(i) }
      />
    );
  }
  render() {
    return(
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)}
      ],
      moveHistory: [
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

     console.log('this.state.moveHistory', JSON.stringify(this.state.moveHistory));

    const nextMove = Object.assign({}, rowColMap[i], {remove: false, isX: this.state.xIsNext} );
    console.log('this.state.stepNumber:', this.state.stepNumber);
    console.log('nextMove', JSON.stringify(nextMove));
    const moves = this.state.moveHistory[this.stepNumber];
    console.log('moves', JSON.stringify(moves));
    let nextMoves = [];
    if(moves){
       nextMoves = [...moves, nextMove];
    }else {
      nextMoves = nextMove;
    }
    console.log('nextMoves', JSON.stringify(nextMoves));
    const moveHistory = this.state.moveHistory;
    moveHistory[this.state.stepNumber] = nextMoves;


    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moveHistory: moveHistory
    });

    
     console.log('this.state.moveHistory', JSON.stringify(this.state.moveHistory));     
     console.log('------------------');
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render (){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game state';
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
    });

    // const moveHistory2 = this.state.moveHistory;

    // for(let i=0; i<moveHistory2.length; i++){
    //   if(i<this.state.stepNumber){
    //     moveHistory2[i].remove = false;
    //   }else{
    //     moveHistory2[i].remove = true;
    //   }
    // }

    // this.setState({
    //   moveHistory: moveHistory2
    // });
    // const moveHistoryStyle = {
    //   textDecoration: 'line-through'
    // };

    const moveHistory = this.state.moveHistory.map( (move, index) => {
        return (
          <p key={index}>Move #{index+1} {move.isX ? 'X' : 'O' }- row:{move.row} Col:{move.col}</p>
        );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={ (i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="steps">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div className="history">
              <div className="move-history">Move history</div>
              <ol>{moveHistory}</ol>
          </div>
        </div>
      </div>
    );
  }
}
// =================================

ReactDom.render(
  <Game />,
   document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i=0; i<lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}