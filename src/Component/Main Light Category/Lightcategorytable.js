import React from 'react'
import axios from 'axios'
import editIcon from '../../icons/edit.png'
import delIcon from '../../icons/bin.png'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'

const Lightcategorytable = () => {
  const [flag, setFlag] = useState(false)
  const navigate = useNavigate();
  const [data, setData] = useState([])
  const [status, setStatus] = useState(false)
  const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);

  useEffect(() => {
    cheackAuth() ? setFlag(true) : (navigate("/"));

    axios.get('http://localhost:3032/admincrud/getlightcategory', {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": localStorage.getItem('token')
      },
    }).then((res) => {
      setData(res.data)

    }).catch((err) => {
      if (err.response.status === 401) {
        navigate('/logout')
      }
      else {
        notify(0, "Internal server error..")
      }
    })
  }, [status])

  const deleteCategory = (id) => {
    const delMsg = window.confirm("Do you really want to delete ?")
    if (delMsg) {
      axios.post('http://localhost:3032/admincrud/deletemainlight', { id }, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem('token')
        },
      }).then((res) => {
        notify(1, "Main light deleted succesfully..")
        setStatus(!status)

      }).catch((err) => {
        if (err.response.status === 401) {
          navigate('/logout')
        }
        else {
          notify(0, "Oops something went wrong..!")
        }
      })
    }


  }

  return (
    <>
      {
        flag ?
          (<div className='admin w-3/4 mt-12 px-2'>
            <div className="logout absolute right-2 top-2" >
              <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
            </div>
            <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg order-2">
              <p className="mt-1 mb-3 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Active Main Light Categories</p>

              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      sr. no.
                    </th>
                    <th scope="col" className="py-3 px-6">
                      series id
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Main Light Image
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Main Light Category Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Delete
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Update
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((value, index) => {
                    return (<tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {index + 1}
                      </th>
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {value._id}
                      </th>

                      <td className="py-4 px-6">
                        {value.name}
                      </td>

                      <td className="py-4 px-6">
                        <img src={value.url} alt="Image" class="h-12 w-50" />
                      </td>

                      <td className="py-4 px-6">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          <img src={delIcon} alt="Image" onClick={() => {
                            deleteCategory(value._id)
                          }} />
                        </a>
                      </td>

                      <td className="py-4 px-6">
                        <Link to="/updatemainlightcategory" state={{ id: value._id }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          <img src={editIcon} alt="Image" />
                        </Link>
                      </td>

                    </tr>)
                  })}

                </tbody>
              </table>
            </div>
          </div>)
          :
          ('')
      }
    </>
  )
}

export default Lightcategorytable