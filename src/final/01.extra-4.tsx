// Managing UI State
// 💯 Improve error accessibility for screen readers
// http://localhost:3000/isolated/final/01.extra-4.tsx

import * as React from 'react'

function UsernameForm({
  initialUsername = '',
  onSubmitUsername,
}: {
  initialUsername?: string
  onSubmitUsername: (username: string) => void
}) {
  const [username, setUsername] = React.useState(initialUsername)
  const [showError, setShowError] = React.useState(false)

  const usernameIsLowerCase = username === username.toLowerCase()
  const usernameIsLongEnough = username.length >= 3
  const usernameIsShortEnough = username.length <= 10
  const formIsValid =
    usernameIsShortEnough && usernameIsLongEnough && usernameIsLowerCase

  const screenReaderMessage = formIsValid
    ? 'Username form is now valid'
    : 'Username form is now invalid'

  let errorMessage = null
  if (!usernameIsLowerCase) {
    errorMessage = 'Username must be lower case'
  } else if (!usernameIsLongEnough) {
    errorMessage = 'Username must be at least 3 characters long'
  } else if (!usernameIsShortEnough) {
    errorMessage = 'Username must be no longer than 10 characters'
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formIsValid) {
      setShowError(true)
      return
    }

    onSubmitUsername(username)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.currentTarget.value)
  }

  function handleBlur() {
    setShowError(true)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          id="usernameInput"
          type="text"
          value={username}
          onChange={handleChange}
          onBlur={handleBlur}
          pattern="[a-z]{3,10}"
          required
        />
      </div>
      {showError && errorMessage ? (
        <div role="alert" style={{color: 'red'}}>
          {errorMessage}
        </div>
      ) : null}
      <div className="sr-only" aria-live="assertive">
        {screenReaderMessage}
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

function App() {
  const onSubmitUsername = (username: string) =>
    alert(`You entered: ${username}`)
  return (
    <div style={{width: 400}}>
      <UsernameForm onSubmitUsername={onSubmitUsername} />
    </div>
  )
}

export {App}
