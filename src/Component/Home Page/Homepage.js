import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import { useState } from 'react';
import LogoutIcon from '../../icons/exit.png'

const Homepage = () => {

    const imageFormator = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                resolve(reader.result)
            }
        })
    }
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);

    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.target);
        const data = Object.fromEntries(formdata.entries())
        if (data.file1.size < 500000 && data.file2.size < 500000 && data.file3.size < 500000 && data.file1.size < 500000) {
            const payload = { ...data, file1: await imageFormator(data.file1), file2: await imageFormator(data.file2), file3: await imageFormator(data.file3), file4: await imageFormator(data.file4) }

            axios.post("https://elitebackend-sage.vercel.app/homedynamic/updatehomepage", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem('token')
                },
            }).then((res) => {
                console.log(res)
                notify(1, "Home Page Updated Successfully..")
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                if (err.response.status === 401) {
                    navigate('/logout')
                }
                else {
                    notify(0, "Internal server error..")
                    setLoading(false)
                }
            })
            e.target.carousel1title.value = "";
            e.target.file1.value = "";
            e.target.carousel2title.value = "";
            e.target.file2.value = "";
            e.target.about1title = "";
            e.target.about1desc.value = "";
            e.target.file3.value = "";
            e.target.about2title = "";
            e.target.about2desc.value = "";
            e.target.file4.value = "";
        }
        else {
            window.alert("file size should be less than 500kb and should be in given format..")
            setLoading(false)
        }

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
                        <div className="form">
                            <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                                <div className="px-6 py-4">
                                    <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold">Add Home Page Detail</p>

                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        {/* Corousel 1 Title & Image */}
                                        <h3 className='text-center mt-8 mb-8 font-bold text-lg border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto'>Add Carousel Details</h3>

                                        <div className="carousel1 flex">

                                            <div className="w-full mt-4">
                                                <label htmlFor="carousel1title">Add Carousel 1 Title </label>
                                                <input type="text" name='carousel1title' placeholder="Carousel 1 Title" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                            </div>

                                            <div className="w-full mt-4">
                                                <label htmlFor="file1">Upload Carousel 1 Image </label>
                                                <input type="file" name='file1' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                            </div>
                                        </div>


                                        <br />
                                        {/* Corousel 2 Title & Image */}
                                        <div className="carousel2 flex">
                                            <div className="w-full mt-4">
                                                <label htmlFor="carousel2title">Add Carousel 2 Title </label>
                                                <input type="text" name='carousel2title' placeholder="Carousel 1 Title" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                            </div>

                                            <div className="w-full mt-4">
                                                <label htmlFor="file2">Upload Carousel 1 Image </label>
                                                <input type="file" name='file2' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                            </div>
                                        </div>





                                        {/* About 1 Title, Description & image */}
                                        <h3 className='text-center mt-8 mb-8 font-bold text-lg border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto'>Add About Section Details</h3>

                                        <div className="w-full mt-4">
                                            <label htmlFor="about1title">Add About 1 Title </label>
                                            <input type="text" name='about1title' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-4">
                                            <label htmlFor="about1desc">Add About 1 Description </label>
                                            <input type="text" name='about1desc' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-4">
                                            <label htmlFor="file3">Upload Avout 1 Image </label>
                                            <input type="file" name='file3' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <br />

                                        {/* About 2 Title, Description & image */}

                                        <div className="w-full mt-4">
                                            <label htmlFor="about2title">Add About 2 Title </label>
                                            <input type="text" name='about2title' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-4">
                                            <label htmlFor="about2desc">Add About 2 Description </label>
                                            <input type="text" name='about2desc' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-4">
                                            <label htmlFor="file4">Upload About 2 Image </label>
                                            <input type="file" name='file4' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
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

export default Homepage