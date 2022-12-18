import React from 'react'
import axios from 'axios'
import delIcon from '../../icons/bin.png'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'

import LogoutIcon from '../../icons/exit.png'
import Sidebars from '../Sidebar';

const GalleryTable = () => {
    const [data, setData] = useState([])
    const [status, setStaus] = useState(false)
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
        axios.get('https://elitebackend-sage.vercel.app/dynamicgallery/getgallery/').then((res) => {
            setData(res.data)
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
            }

            notify(0, "Error While Fetching Data..")
        })
    }, [status])

    const deleteGallery = (id) => {
        const alertMsg = window.confirm("Are you sure to delete?")

        if (alertMsg) {
            axios.post('https://elitebackend-sage.vercel.app/dynamicgallery/deletegalleryimage', { id }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem('token')
                },
            }).then((res) => {
                notify(1, "Image Deleted Successfully..!")
                setStaus(!status)
            }).catch((err) => {
                if (err.response.status === 401) {
                    navigate('/logout')
                }
                notify(0, "something Went Wrong..!")
            })
        }
    }

    return (
        <>
            <Sidebars />
            <div className='admin w-3/4 mt-12 px-2'>
                <div className="logout absolute right-2 top-2" >
                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                </div>
                <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg order-2">


                    <p className="mt-1 mb-3 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold w-1/2 m-auto">Added Gallery Images</p>

                    <div className="add_btn mt-6 mb-6 flex justify-end mr-4">
                        <Link to="/gallerypage" className='p-3 rounded-md font-bold bg-blue-600 text-white'>Add Gallery Image</Link>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Sr.No.
                                </th>

                                <th scope="col" className="py-3 px-6">
                                    Event Name
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Image
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Delete
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((value, index) => {
                                return (<tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                    <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </th>


                                    <td className="py-4 px-6">
                                        {value.eventName}
                                    </td>

                                    <td className="py-4 px-6">
                                        <img src={value.image.url} alt="" width="90px" />
                                    </td>

                                    <td className="py-4 px-6">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <img src={delIcon} alt="Image" onClick={() => {
                                                deleteGallery(value._id)
                                            }} />
                                        </a>
                                    </td>


                                </tr>)
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default GalleryTable