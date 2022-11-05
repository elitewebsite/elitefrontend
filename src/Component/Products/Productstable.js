import React from 'react'
import axios from 'axios'
import delIcon from '../../icons/bin.png'
import editIcon from '../../icons/edit.png'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'

const Productstable = () => {

  const [flag, setFlag] = useState(false)

  const navigate = useNavigate();

  const [data, setData] = useState([])
  const [status, setStatus] = useState(false)

  const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);

  useEffect(() => {

    cheackAuth() ? setFlag(true) : (navigate("/"));

    axios.get('https://elitebackend.vercel.app/admincrud/getallproducts',{
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

  const deleteProduct = (id, series) => {
    const delMsg = window.confirm("Do you really want to delete ?")
    if (delMsg) {
      axios.post('https://elitebackend.vercel.app/admincrud/deleteproduct', { id, series },{
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem('token')
        },
      }).then((res) => {
        notify(1, "Product Deleted Succesfully..!")
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
          (<div className='admin w-3/4 mt-20 px-2'>
            <div className="logout absolute right-2 top-2" >
              <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
            </div>
            <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg order-2">
              <p className="mt-1 mb-3 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Active Light Products</p>

              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Sr. No.
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Product Id
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Series Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Product Name
                    </th>

                    <th scope="col" className="py-3 px-6">
                      Model Number
                    </th>

                    <th scope="col" className="py-3 px-6">
                      Product Images
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
                        {value.series_name}
                      </td>

                      <td className="py-4 px-6">
                        {value.product_name}
                      </td>

                      <td className="py-4 px-6">
                        {value.model_no}
                      </td>

                      <td className="py-4 px-6">
                        <img src={value.images[0]} alt="Image" className="h-12 w-50" />
                      </td>

                      <td className="py-4 px-6">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          <img src={delIcon} alt="Image" onClick={() => {
                            deleteProduct(value._id, value.series_name)
                          }} />
                        </a>
                      </td>

                      <td className="py-4 px-6">
                        <Link to="/updateproduct" state={{ id: value._id }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
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

export default Productstable