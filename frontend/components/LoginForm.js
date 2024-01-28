import React, { useState } from 'react'
import PT from 'prop-types'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const navigate = useNavigate();
  // ✨ where are my props? Destructure them here

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    props.setSpinnerOn(true)
    axios.post('http://localhost:9000/api/login', values)
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        navigate('/articles')
        props.setMessage(res.data.message)
      }).finally(() => {
      props.setSpinnerOn(false)
    })
  }

  const isDisabled = () => {
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
    if (
      values.username.trim().length >= 3 &&
      values.password.trim().length >= 8
    ) {
      return false
    } else {
      return true
    }
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}


