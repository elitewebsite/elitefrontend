import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'

const Mainlightcategory = () => {
  const [flag, setFlag] = useState(false)

  const navigate = useNavigate();

  const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);

  useEffect(() => {
    cheackAuth() ? setFlag(true) : (navigate("/"));
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formdata = new FormData(e.target)
    const data = Object.fromEntries(formdata.entries())
    axios.post("http://localhost:3032/admincrud/createlight", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": localStorage.getItem('token')
      },
    }).then((res) => {
      notify(1, "Main light category added successfully...")
    }).catch((err) => {
      if (err.response.status === 401) {
        navigate('/logout')
      }
      else {
        notify(0, "Internal server error..")
      }

    })

    e.target.name.value = "";
    e.target.myfile.value = "";
  }

  return (
    <>
      {
        flag ?
          (<div className='admin w-3/4 px-2'>
            <div className="logout absolute right-2 top-2" >
              <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
            </div>
            <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
            <div className="form mt-24">
              <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                <div className="px-6 py-4">
                  <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold">Add Main Light Category</p>

                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="w-full mt-5">
                      <label htmlFor="name">Main Light Category Name</label>
                      <input type="text" name="name" placeholder="Main Light Category" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                    </div>

                    <div className="w-full mt-5">
                      <label htmlFor="myfile">Upload Image</label>
                      <input type="file" name="myfile" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <button type="submit" className="px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none">Submit</button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>)
          :
          ('')
      }
    </>
  )
}

export default Mainlightcategory
