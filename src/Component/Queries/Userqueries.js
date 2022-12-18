import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import cheackAuth from '../../Auth';
import Sidebars from '../Sidebar';
import LogoutIcon from '../../icons/exit.png'


const Userqueries = () => {

    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const [data, setData] = useState([])
    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
        axios.get("https://elitebackend-sage.vercel.app/getfomdata/showformdetails", {
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
            // console.log(err)
        })
    }, [])
    return (
        <>
            <Sidebars />
            <div className="overflow-x-auto relative w-full mt-10 p-2 border-2 m-3">
                <div className="logout absolute right-2 top-2 mt-4" >
                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                </div>
                <h1 className='m-auto mb-12 mt-10 text-center text-2xl font-bold text-gray-900'>Customer Enquiries</h1>
                <table className="w-full text-md text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Sr.no
                            </th>
                            <th scope="col" className="py-3 px-6">
                                User Query
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Email
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Contact
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Time & Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((val, idx) => {

                            return (
                                <tr className={`bg-${idx in [0, 1, 2, 4] ? "border-b border-black text-black font-semibold" : "white"}  border-b`}>
                                    <td className="py-4 px-6">
                                        {idx + 1}
                                        {
                                            idx < 4 ? (
                                                <span class="ml-2 bg-blue-800 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">New</span>
                                            ) : ("")

                                        }
                                    </td>
                                    <th scope="row" className="py-4 px-6 font-medium text-gray-900  dark:text-white">
                                        {val.message}
                                    </th>
                                    <td className="py-4 px-6">
                                        {val.name}
                                    </td>
                                    <td className="py-4 px-6">
                                        {val.email}
                                    </td>
                                    <td className="py-4 px-6">
                                        {val.contact}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className='flex flex-col gap-3'>
                                            <span>{val.createdAt.date}</span>
                                            <span>{val.createdAt.time}</span>
                                        </div>

                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
        </>


    )
}

export default Userqueries