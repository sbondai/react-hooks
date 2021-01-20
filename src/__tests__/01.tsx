import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {App} from '../final/01.extra-2'
// import {App} from '../exercise/01'

let alert = jest.spyOn(global, 'alert')
beforeAll(() => {
  alert.mockImplementation(() => {})
})

beforeEach(() => {
  alert.mockClear()
})

test('calls the onSubmitUsername handler when the submit is fired', () => {
  render(<App />)
  const input = screen.getByRole('textbox', {
    name: /username/i,
  }) as HTMLInputElement
  const submit = screen.getByRole('button', {name: /submit/i})

  const username = 'jenny'

  userEvent.type(input, `{selectall}${username}`)
  userEvent.click(submit)

  expect(global.alert).toHaveBeenCalledWith(`You entered: ${username}`)
  expect(global.alert).toHaveBeenCalledTimes(1)
})

// don't do this in regular tests!
const UsernameForm = App().props.children?.type

if (!UsernameForm) {
  alfredTip(
    true,
    `Can't find the UsernameForm from the exported App component. Please make sure to not edit the App component so I can find the UsernameComponent and run some tests on it.`,
  )
}
// if it doesn't have the initialName at all then they're probably not on that part of the extra credit yet.
if (UsernameForm.toString().includes('initialUsername')) {
  test('supports initialUsername', () => {
    render(
      <UsernameForm initialUsername="hannah" onSubmitUsername={() => {}} />,
    )
    expect(
      screen.getByRole('textbox', {
        name: /username/i,
      }),
    ).toHaveValue('hannah')
  })
}

if (/(lower|\.length)/i.test(UsernameForm.toString())) {
  test('validates properly', () => {
    render(<App />)
    const input = screen.getByRole('textbox', {
      name: /username/i,
    }) as HTMLInputElement
    const submit = screen.getByRole('button', {name: /submit/i})

    // For the extra credit where we don't display errors until blur
    // This functionality is covered in a seperate test.
    fireEvent.blur(input)

    alfredTip(() => {
      userEvent.type(input, `{selectall}jo`)
      // hard to assert on the specific message if they decide they want a different message
      // so we'll just assume that if it's showing up it's correct.
      expect(screen.getByRole('alert')).toHaveTextContent(/.+/)
      userEvent.click(submit)
      expect(global.alert).not.toHaveBeenCalled()
    }, `Make sure to display the correct error message when the username is too short (like in "jo") and don't allow the form to be submitted when it's invalid.`)

    alfredTip(() => {
      userEvent.type(input, `{selectall}joejoejoejoe`)
      // hard to assert on the specific message if they decide they want a different message
      // so we'll just assume that if it's showing up it's correct.
      expect(screen.getByRole('alert')).toHaveTextContent(/.+/)
      userEvent.click(submit)
      expect(global.alert).not.toHaveBeenCalled()
    }, `Make sure to display the correct error message when the username is too long (like in "joejoejoejoe") and don't allow the form to be submitted when it's invalid.`)

    alfredTip(() => {
      userEvent.type(input, `{selectall}Joe`)
      // hard to assert on the specific message if they decide they want a different message
      // so we'll just assume that if it's showing up it's correct.
      expect(screen.getByRole('alert')).toHaveTextContent(/.+/)
      userEvent.click(submit)
      expect(global.alert).not.toHaveBeenCalled()
    }, `Make sure to display the correct error message when the username has a capital letter (like in "Joe") and don't allow the form to be submitted when it's invalid.`)

    alfredTip(() => {
      userEvent.type(input, `{selectall}joe`)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      userEvent.click(submit)
      expect(global.alert).toHaveBeenCalled()
    }, `Make that a valid input (like "joe") does not render the alert div and clicking submit will actually submit the form.`)
  })
}
