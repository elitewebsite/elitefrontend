import React from 'react'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import delIcon from '../../icons/bin.png'
import editIcon from '../../icons/edit.png'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'

const Seriestable = () => {

  const [flag, setFlag] = useState(false)

  const navigate = useNavigate();

  const [data, setData] = useState([])

  const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);

  const [status, setStatus] = useState(false)

  useEffect(() => {
    cheackAuth() ? setFlag(true) : (navigate("/"));

    axios.get('https://elitebackend-sage.vercel.app/admincrud/getallseries', {
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

  // Delete Series

  const deleteSeries = (id, series) => {
    const delMsg = window.confirm('All products under series will be deleted..! Do you really want to delete Series??')
    //window.alert(id)
    if (delMsg) {
      axios.post('https://elitebackend-sage.vercel.app/admincrud/deleteseries', { id, series }, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem('token')
        },
      }).then((res) => {
        notify(1, "Series Deleted Succesfully..!")
        setStatus(!status)

      }).catch((err) => {
        if (err.response.status === 401) {
          navigate('/logout')
        }
        else {
          notify(0, "Internal server error..")
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
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg order-2">
              <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
              <p className="mt-1 mb-3 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Active Light Series</p>

              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      sr no
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Series Id
                    </th>

                    <th scope="col" className="py-3 px-6">
                      Main Light Category Name
                    </th>

                    <th scope="col" className="py-3 px-6">
                      Light Series Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Light Series Image
                    </th>

                    <th scope="col" className="py-3 px-6">
                      Delete
                    </th>

                    <th scope="col" className="py-3 px-6">
                      Edit
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
                        {value.mainlight}
                      </td>

                      <td className="py-4 px-6">
                        {value.series}
                      </td>

                      <td className="py-4 px-6">
                        <img src={value.url} alt="no_image" className="h-12 w-50" />

                      </td>

                      <td className="py-4 px-6">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          <img src={delIcon} alt="Image" onClick={() => {
                            deleteSeries(value._id, value.series)
                          }} />
                        </a>
                      </td>


                      <td className="py-4 px-6">
                        <Link to="/updatelightseries" state={{ id: value._id }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
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

export default Seriestable