// useEffect: persistent state
// 💯 custom hook
// http://localhost:3000/isolated/final/02.extra-3.tsx

import * as React from 'react'

function useLocalStorageState(key: string, defaultValue: string = '') {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || defaultValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, state)
  }, [key, state])

  return [state, setState] as const
}

function Greeting({initialName = ''}: {initialName?: string}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event: React.SyntheticEvent<HTMLInputElement>) {
    setName(event.currentTarget.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export {App}
