import axios from 'axios';
import React, { useState } from 'react';
import delIcon from '../../icons/bin.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoutIcon from '../../icons/exit.png'
import cheackAuth from '../../Auth'
import Sidebars from '../Sidebar'
import { useNavigate, Link } from 'react-router-dom'

const Branches = () => {
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    const [number, setNumber] = useState('');
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();

    const handleNumberInput = (e) => {
        setNumber(e.target.value)
    }

    const [submitNumber, setSubmitNumber] = useState([]);

    const handleNumberAdd = () => {
        setSubmitNumber([...submitNumber, number])
        setNumber('')
    }

    const handleDelete = (id) => {
        const newArray = submitNumber.filter((element, index) => {
            return index !== id
        })
        setSubmitNumber(newArray)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const data = Object.fromEntries(formdata.entries());

        const payload = { ...data, contact: submitNumber }

        axios.post('https://elitebackend-sage.vercel.app/branch/getbranchdetails', payload, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            notify(1, "Branch Added Successfully...!")
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
              }
            notify(0, "Something Went Wrong..!")
        })

        e.target.branch_name.value = "";
        e.target.branch_city.value = "";
        e.target.address.value = "";
        e.target.email.value = "";
        setSubmitNumber([])
    }

    return (
        <>
            {
                <>
                    <Sidebars />
                    <div className='admin w-3/4 px-2'>
                        <div className="form mt-24">
                            <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                                <div className="logout absolute right-2 top-2 mt-4" >
                                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Add Branch Details</p>

                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                                        <div className="w-full mt-5">
                                            <label htmlFor="branch_city">Add Branch City</label>
                                            <input type="text" name="branch_city" placeholder="Branch City" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-5">
                                            <label htmlFor="branch_name">Add Branch Name</label>
                                            <input type="text" name="branch_name" placeholder="Branch Name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-5">
                                            <label htmlFor="address">Add Branch Address</label>
                                            <input type="text" name="address" placeholder="Branch Address" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-5">
                                            <label htmlFor="email">Add Email ID</label>
                                            <input type="email" name="email" placeholder="Email ID" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                        </div>

                                        <div className="w-full mt-5">
                                            <label htmlFor="contact">Add Branch Contact Numbers</label>
                                            <div className='flex gap-8'>
                                                <input type="number" name="contact" value={number} onChange={handleNumberInput} placeholder="Branch Contact Numbers" className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                <input type='button' value="Add Number" onClick={handleNumberAdd} placeholder='button' className=" w-1/4 m-auto px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none mt-8" />
                                            </div>
                                            <div className="mt-6">
                                                <h3 className='font-bold text-lg'>Added Numbers: </h3>
                                                {
                                                    submitNumber?.map((val, ind) => {
                                                        return (
                                                            <div className='flex gap-6 mt-10 mb-12 '>
                                                                <h4>{val}</h4> <span onClick={() => { handleDelete(ind) }}> <img src={delIcon} alt="Img" /> </span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <button type="submit" className="px-6 py-4 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none">Submit Now</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </>
            }
        </>
    )
}

export default Branches