import React from 'react'
import RegisterForm from '../form/register-form'

const RegisterPage = () => {
  return (
    <div className=' space-y-4 grid place-content-center  w-full min-h-screen'>
        <h2 className=' font-bold text-2xl text-center'>Register</h2>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
