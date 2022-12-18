import axios from 'axios'
import { useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()

  const [flag, setFlag] = useState(false)

  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.email !== '' && data.password !== '') {
      axios.post('https://elitebackend-sage.vercel.app/auth/login', data).then((res) => {
        localStorage.setItem('token', res.data.token)
        navigate(0);
      }).catch((err) => {
        if (err.response.status === 401) {
          setFlag(true)
        }
      })
    } else {
      window.alert("Provide Username and Password")
    }
  }

  return (
    <>

      <div className="w-full mt-40 max-w-sm p-6 m-auto mx-auto bg-white rounded-md shadow-xl border-2 dark:bg-gray-800">
        {
          flag ?
            (<h1 className='text-center text-xl text-red-400 mb-4'>Invalid Credentials..!</h1>)
            :
            ('')
        }
        <h1 className="text-3xl font-semibold text-center text-gray-700 dark:text-white">ELITE</h1>

        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

          <a className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
            Please login here
          </a>

          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
        </div>


        <form className="mt-6" >
          <div>
            <label for="username" className="block text-sm text-gray-800 dark:text-gray-200">Username</label>
            <input type="text" onChange={(e) => {
              setData({ ...data, email: e.target.value })
            }} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label for="password" className="block text-sm text-gray-800 dark:text-gray-200">Password</label>
            </div>
            <input type="password" onChange={(e) => {
              setData({ ...data, password: e.target.value })
            }} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />

          </div>

          <div className="mt-6">
            <button onClick={handleSubmit} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login