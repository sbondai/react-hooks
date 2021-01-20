// useState: tic tac toe
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/04-classes.tsx

import * as React from 'react'
import {
  calculateStatus,
  calculateNextValue,
  calculateWinner,
} from '../tic-tac-toe-utils'
import type {Squares} from '../tic-tac-toe-utils'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

// 🦉 You've learned all the hooks you need to know to refactor this Board
// component to hooks. So, let's make it happen!

type BoardProps = {}
type BoardState = {squares: Squares}

class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props)

    let squares
    try {
      squares = JSON.parse(window.localStorage.getItem('squares') ?? 'null')
    } catch (error: unknown) {
      // something is wrong in localStorage, so don't use it
    }
    if (!squares) squares = Array(9).fill(null)

    this.state = {squares}
  }

  selectSquare(index: number) {
    const {squares} = this.state
    const nextValue = calculateNextValue(squares)
    if (calculateWinner(squares) || squares[index]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[index] = nextValue
    this.setState({squares: squaresCopy})
  }
  renderSquare = (i: number) => (
    <button className="square" onClick={() => this.selectSquare(i)}>
      {this.state.squares[i]}
    </button>
  )

  restart = () => {
    this.setState({squares: Array(9).fill(null)})
    this.updateLocalStorage()
  }

  componentDidMount() {
    this.updateLocalStorage()
  }

  componentDidUpdate(prevProps: BoardProps, prevState: BoardState) {
    if (prevState.squares !== this.state.squares) {
      this.updateLocalStorage()
    }
  }

  updateLocalStorage() {
    window.localStorage.setItem('squares', JSON.stringify(this.state.squares))
  }

  render() {
    const {squares} = this.state
    const nextValue = calculateNextValue(squares)
    const winner = calculateWinner(squares)
    let status = calculateStatus(winner, squares, nextValue)

    return (
      <div>
        <div className="status">{status}</div>
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
        <button className="restart" onClick={this.restart}>
          restart
        </button>
      </div>
    )
  }
}

function App() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

export {App}
