import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'
import Sidebars from '../Sidebar';

const GalleryPage = () => {

    const [imgdata, setImgdata] = useState('')
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);

    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
    }, [])

    const imageFormator = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onloadend = () => {
                setImgdata(reader.result)
                resolve(reader.result)
            }
        })
    }

    const [title, setTitle] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target)
        const data = Object.fromEntries(formdata.entries())

        setTitle(data.eventname)

        const payload = { ...data, myfile: await imageFormator(data.myfile) }

        axios.post('https://elitebackend-sage.vercel.app/dynamicgallery/addgalleryimage', payload, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            // console.log(res)
            notify(1, "Gallery Image Added Successfully..!")
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
            }

            notify(0, "Something Went Wrong..!")
        })


    }

    return (
        <>
            <Sidebars />
            <div className='admin w-3/4 px-2'>
                <div className="logout absolute right-2 top-2" >
                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                </div>
                <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                <div className="form mt-24">
                    <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                        <div className="px-6 py-4">
                            <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Add Gallery Images</p>

                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className="w-full mt-5">
                                    <label htmlFor="myfile">Upload Image</label>
                                    <input type="file" name="myfile" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                </div>

                                <div className="w-full mt-5">
                                    <label htmlFor="eventname">Event Name</label>
                                    <input type="text" name="eventname" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                </div>


                                <div className="flex items-center justify-between mt-6">
                                    <button type="submit" className="px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none">Submit</button>
                                </div>

                            </form>

                            {
                                imgdata !== '' ? (
                                    <div>
                                        <p className='mt-6 text-lg'> <b>Uploaded Image:</b></p>
                                        <img src={imgdata} alt="Image" />
                                        <h3 className=' text-lg font-bold mt-2'>{title}</h3>
                                    </div>) : ('')
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default GalleryPage