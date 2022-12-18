import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import delIcon from '../../icons/bin.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import editIcon from '../../icons/edit.png'
import LogoutIcon from '../../icons/exit.png'
import cheackAuth from '../../Auth'
import Sidebars from '../Sidebar'

const BranchesDetails = () => {
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [status, setStatus] = useState(false)
    useEffect(() => {

        cheackAuth() ? setFlag(true) : (navigate("/"));

        axios.get('https://elitebackend-sage.vercel.app/branch/getbranches', {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            setData(res.data)

        }).catch((err) => {
            if (err.response.status === 401) {
                // navigate('/logout')
            }
            else {
                notify(0, "Internal server error..")
            }
        })
    }, [status])

    const deleteProduct = (id) => {
        const desc = window.confirm("Are you sure to delete branch?")

        if (desc) {
            axios.post('https://elitebackend-sage.vercel.app/branch/deletebranch', { id }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem('token')
                },
            }).then((res) => {
                notify(1, "Branch Deleted Successfully..")
                setStatus(!status)

            }).catch((err) => {
                if (err.response.status === 401) {
                    navigate('/logout')
                }
                notify(0, "Something went wrong..!")

            })
        }

    }

    const [branchNames, setBranchNames] = useState([]);

    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
        axios.get("https://elitebackend-sage.vercel.app/branch/getbranchesnames", {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            setBranchNames(res.data)

        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target)

        const data = Object.fromEntries(formdata.entries())

        axios.post("https://elitebackend-sage.vercel.app/branch/changebranchsequence", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            notify(1, "Order Changed Successfully..")
        }).catch((err) => {
            notify(0, "Something Went Wrong")
            console.log(err)
        })
    }

    return (
        <>
            <Sidebars />
            <div className='admin w-3/4 mt-20 px-2'>
                <div className="logout absolute right-2 top-2" >
                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                </div>

                <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg order-2">
                    <p className="mt-1 mb-3 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold  w-1/2 m-auto">Branch Details</p>
                    <div className="add_btn mt-6 flex justify-end mr-4">
                        <Link to="/branches" className='p-3 rounded-md font-bold bg-blue-600 text-white'>Add New Branch</Link>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2 mt-6">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    Sr. No.
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Order
                                </th>

                                <th scope="col" className="py-3 px-6">
                                    Branch City
                                </th>

                                <th scope="col" className="py-3 px-6">
                                    Branch Name
                                </th>

                                <th scope="col" className="py-3 px-6">
                                    Email ID
                                </th>

                                <th scope="col" className="py-3 px-6">
                                    Branch Address
                                </th>

                                <th scope="col" className="py-3 px-6">
                                    Branch Contact Numbers
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
                                        {value.sequence_no}
                                    </th>

                                    <td className="py-4 px-6">
                                        {value.branch_city}
                                    </td>

                                    <td className="py-4 px-6">
                                        {value.branch_name}
                                    </td>

                                    <td className="py-4 px-6">
                                        {value.email}
                                    </td>

                                    <td className="py-4 px-6">
                                        {value.address}
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className='flex flex-col'>
                                            {
                                                value.contact?.map((val, index) => {
                                                    return (
                                                        <span>
                                                            {val}
                                                        </span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <img src={delIcon} alt="Image" onClick={() => {
                                                deleteProduct(value._id)
                                            }} />
                                        </a>
                                    </td>

                                    <td className="py-4 px-6">
                                        <Link to="/updatebranch" state={{ id: value._id }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <img src={editIcon} alt="Image" />
                                        </Link>
                                    </td>

                                </tr>)
                            })}

                        </tbody>
                    </table>
                </div>

                <div className='w-3/4 m-auto'>
                    <p className='text-black text-center mt-16 mb-12 font-bold text-xl'>Change Branch Order</p>
                    <form onSubmit={handleSubmitOrder}>
                        <label htmlFor="branch_id" ><b>Select Branch Name:</b> </label>
                        <select name="branch_id" id="branch_id" className="block w-3/4 px-4 py-2 mt-4 mb-8 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300">
                            <option value=""> -- Select Branch --</option>
                            {

                                branchNames?.map((value, index) => {
                                    return (

                                        <option value={value._id}>{value.branch_name}</option>
                                    )
                                })
                            }
                        </select>

                        <label htmlFor="branch_order"><b>Add Branch Order:</b> </label>
                        <input type="number" name='branch_order' placeholder="Branch Order" className="block w-3/4 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                        <button type="submit" className="mt-6 px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none" >Change Branch Order</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default BranchesDetails