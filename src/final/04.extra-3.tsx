// useState: tic tac toe
// 💯 add game history feature
// http://localhost:3000/isolated/final/04.extra-3.tsx

import * as React from 'react'
import {useLocalStorageState} from '../utils'
import {
  calculateStatus,
  calculateNextValue,
  calculateWinner,
} from '../tic-tac-toe-utils'
import type {Squares} from '../tic-tac-toe-utils'

function Board({
  squares,
  onClick,
}: {
  squares: Squares
  onClick: (index: number) => void
}) {
  function renderSquare(i: number) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function App() {
  const [history, setHistory] = useLocalStorageState<Array<Squares>>(
    'tic-tac-toe:history',
    [Array(9).fill(null)],
  )
  const [currentStep, setCurrentStep] = useLocalStorageState<number>(
    'tic-tac-toe:step',
    0,
  )

  const currentSquares = history[currentStep]
  const winner = calculateWinner(currentSquares)
  const nextValue = calculateNextValue(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(index: number) {
    if (winner || currentSquares[index]) {
      return
    }

    const newHistory = history.slice(0, currentStep + 1)
    const squares = [...currentSquares]

    squares[index] = nextValue
    setHistory([...newHistory, squares])
    setCurrentStep(newHistory.length)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  const moves = history.map((stepSquares, step) => {
    const desc = step ? `Go to move #${step}` : 'Go to game start'
    const isCurrentStep = step === currentStep
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

export {App}
