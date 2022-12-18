import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cheackAuth from '../../Auth'
const Productorder = () => {
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    const [category, setCategory] = useState([])
    const [flag, setFlag] = useState(false);
    const [product, setProducts] = useState([])
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

    const handleCategory = (e) => {

        axios.post('https://elitebackend-sage.vercel.app/admincrud/getallproductsfororder', { series_name: e.target.value }, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            // console.log(res.data)
            setProducts(res.data)
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
            }
            notify(0, "Internal server error..")
        })
    }
    const handleSubmit = (e) => {
        // Sending data request to backend 
        e.preventDefault();
        const formdata = new FormData(e.target)
        //getting entries from from
        const data = Object.fromEntries(formdata.entries())
        //change the order of a product.....
        axios.post('https://elitebackend-sage.vercel.app/admincrud/changeproductorder', data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            notify(1, "Product Order changed succesfully ")
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
            <h1 className="mt-1 mb-3 w-full text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Change sequence of products </h1>
            <form onSubmit={handleSubmit}>
                <div className="w-full mt-4">
                    <label htmlFor="series_name"><b>Light Series:</b> </label>
                    <select name="series_name" id="series_name" onChange={handleCategory} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300">
                        <option value=""> -- Select Light Series --</option>
                        {category.map((value, index) => {
                            return (<option key={index} value={value.series}>{value.series}</option>);
                        })}
                    </select>

                </div>
                <div className="w-full mt-4">
                    <label htmlFor="product_id"><b>Products:</b> </label>
                    <select name="product_id" id="product_name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300">
                        <option value=""> -- Select Products --</option>
                        {product.map((value, index) => {
                            return (<option key={index} value={value._id}>{value.product_name}</option>);
                        })}
                    </select>

                </div>
                <div className="w-full mt-4">
                    <label htmlFor="order"><b>Product Order:</b></label>
                    <input type="number" name='order' placeholder="Product Order" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                </div>

                <button type="submit" className="mt-6 px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none" >Change Order</button>
            </form>
        </div>

    )
}

export default Productorder