import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cheackAuth from '../../Auth'
const Seriesorder = () => {
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    const [category, setCategory] = useState([])
    const [flag, setFlag] = useState(false);
    //const [product, setProducts] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
  
        cheackAuth() ? setFlag(true) : (navigate("/"));
        axios.get("https://elitebackend-sage.vercel.app/admincrud/getseriesname", {
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

    const handleSubmit = (e) => {
        // Sending data request to backend 
        e.preventDefault();
        const formdata = new FormData(e.target)
        //getting entries from from
        const data = Object.fromEntries(formdata.entries())
        //change the order of a product.....
        axios.post('https://elitebackend-sage.vercel.app/admincrud/changeseriesorder', data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {

            notify(1, "Series Order changed  Successfully..")
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
              }
            notify(0, "Internal server error..")
        })


    }
    return (

        <div className="main w-3/4 mt-3 px-2 m-auto mb-6 p-5 rounded-md">
            <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />

            <h1 className="mt-1 mb-3 w-full text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Change sequence of Series </h1>
            <form onSubmit={handleSubmit}>
                <div className="w-full mt-4">
                    <label htmlFor="series_name"><b>Light Series:</b> </label>
                    <select name="series_id" id="series_name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300">
                        <option value=""> -- Select Light Series --</option>
                        {category.map((value, index) => {
                            return (<option key={index} value={value._id}>{value.series}</option>);
                        })}
                    </select>

                </div>
                <div className="w-full mt-4">
                    <label htmlFor="order"><b>Series Order:</b></label>
                    <input type="number" name='order' placeholder="Product Name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                </div>
                <button type="submit" className="mt-6 px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none" >Submit</button>
            </form>
        </div>
    )
}

export default Seriesorder