import React from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'

const Updatelightseries = () => {
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
    const navigate = useNavigate();
    const location = useLocation()
    const [category, setCategory] = useState([])
    const [prev, setPrev] = useState([])
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
        //This API will fetch already added series which we want to update now
        axios.post("https://elitebackend-sage.vercel.app/admincrud/getseriesbyid", { id: location.state.id }, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            setPrev(res.data)
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
            }
            else {
                notify(0, "Internal server error..")
            }
        });

        //This API will give main light categories which will be displayed in dropdown
        axios.get("https://elitebackend-sage.vercel.app/admincrud/getlightcategory", {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            setCategory(res.data)
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
            }
            else {
                notify(0, "Internal server error..")
            }
        })

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.target)
        const data = Object.fromEntries(formdata.entries())
        if (data.myfile.size < 500000) {
            const payload = { ...data, "id": location.state.id, myfile: await imageFormator(data.myfile) }

            axios.post("https://elitebackend-sage.vercel.app/admincrud/updateseries", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem('token')
                },
            }).then((res) => {
                notify(1, "Updated Successfully..")
            }).catch((err) => {
                if (err.response.status === 401) {
                    navigate('/logout')
                }
                else {
                    notify(0, "Internal server error..")
                }
            })

            e.target.series.value = "";
            e.target.myfile.value = "";
        }
        else {
            window.alert("file size should be less than 500kb and should be in given format..")
        }

    }

    return (
        <>
            {
                flag ?
                    (<div className='admin w-3/4'>
                        <div className="form mt-24">
                            <div className="logout absolute right-2 top-2" >
                                <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                            </div>
                            <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                            <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                                <div className="px-6 py-4">
                                    <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold">Update Light Series</p>

                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="w-full mt-4">
                                            <label htmlFor="mainlight">Main Light Category: </label>
                                            <select name="mainlight" id="mainlight" value={prev.mainlight} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required>
                                                <option value={prev.mainlight}>{prev.mainlight}</option>
                                            </select>

                                        </div>

                                        <div className="w-full mt-4">
                                            <label htmlFor="series">Add Light Series Name: </label>
                                            <input type="text" name='series' value={prev.series} onChange={(e) => { setPrev({ series: e.target.value }) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" aria-label="Email Address" required />
                                        </div>

                                        <div className="w-full mt-4">
                                            <label htmlFor="myfile">Upload Light Series Image: </label>
                                            <input type="file" name='myfile' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <button type="submit" className="px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none" >Submit</button>
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

export default Updatelightseries
