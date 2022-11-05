import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import delIconWhite from '../../icons/trash.png'
import ReactLoading from 'react-loading';
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'

const Addproducts = () => {
  const imageFormator = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        resolve(reader.result)
      }
    })
  }
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
  const [category, setCategory] = useState([])
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false)
  const [main, setMain] = useState({
    title: '',
    desc: '',
  });

  useEffect(() => {
    cheackAuth() ? setFlag(true) : (navigate("/"));
    axios.get("https://elitebackend.vercel.app/admincrud/getseriesname", {
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

    // Sending data request to backend 
    e.preventDefault();
    const formdata = new FormData(e.target)

    //getting entries from from
    const data = Object.fromEntries(formdata.entries())
    setLoading(true)

    //Whatever data received from dynamic inputs for light parameters + all form data received after submit. we are send as payload
    //pasreing object to jaons string   
    if (data.file1.size < 500000 && data.file2.size < 500000 && data.file3.size < 500000 && data.file4.size < 500000 && data.pdffile.size < 500000 && data.pdffile.type === "application/pdf") {
      const payload = { ...data, 'info': JSON.stringify(value), file1: await imageFormator(data.file1), file2: await imageFormator(data.file2), file3: await imageFormator(data.file3), file4: await imageFormator(data.file4), pdffile: await imageFormator(data.pdffile) }
      axios.post('https://elitebackend.vercel.app/admincrud/addproduct', payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem('token')
        },
      }).then((res) => {

        notify(1, "Product Added Successfully..")
        setLoading(false)
      }).catch((err) => {
        if (err.response.status === 401) {
          navigate('/logout')
        }
        else {
          notify(0, "Internal server error..")
          setLoading(false)
        }
      })

      e.target.series_name.value = ""
      e.target.product_name.value = ""
      e.target.model_no.value = ""
      e.target.product_description.value = ""
      e.target.youtube.value = ""
      e.target.news.value = ""
      e.target.file1.value = ""
      e.target.file2.value = ""
      e.target.file3.value = ""
      e.target.file4.value = ""
      e.target.pdffile.value = ""
      setValue([])
    }
    else {
      window.alert("file size should be less than 500kb and should be in given format..")
      setLoading(false)
    }

  }

  //remove the item from all buckect
  const removeItem = (idx) => {
    const filterData = value.filter((element, index) => {
      return index !== idx;
    });
    setValue(filterData);
  };


  //add data to bucket 
  const addData = () => {
    setValue([...value, main]);
    setMain({ title: '', desc: '' });
  };

  return (
    <>
      {
        flag ?
          (<div className='admin w-3/4 mt-24 px-2'>
            <div className="logout absolute right-2 top-2" >
              <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
            </div>
            <div className="form">
              <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                <div className="px-6 py-4">

                  <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Add Products</p>
                  <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                  <form onSubmit={handleSubmit} autoComplete="off">

                    <div className="w-full mt-4">
                      <label htmlFor="series_name"><b>Light Series:</b> </label>
                      <select name="series_name" id="series_name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300">
                        <option value=""> -- Select Light Series --</option>
                        {category.map((value, index) => {
                          return (<option key={index} value={value.series}>{value.series}</option>);
                        })}
                      </select>

                    </div>

                    <div className="flex gap-2">
                      <div className="w-full mt-4">
                        <label htmlFor="product_name"><b>Product Name:</b></label>
                        <input type="text" name='product_name' placeholder="Product Name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                      </div>

                      <div className="w-full mt-4">
                        <label htmlFor="model_no"> <b>Product Model Number:</b></label>
                        <input type="text" name='model_no' placeholder="Product Model Number" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 mt-4">

                      <label htmlFor="file1"><b>Upload Product Images: </b></label> <br /> <br />
                      <div className="">
                        <label htmlFor="file1">1. Front View Product Images:</label>
                        <input type="file" name='file1' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                      </div>

                      <div className="">
                        <label htmlFor="file2">2. Rear View Product Images:</label>
                        <input type="file" name='file2' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                      </div>

                      <div className="">
                        <label htmlFor="file3">3. Right Side View Product Images:</label>
                        <input type="file" name='file3' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                      </div>

                      <div className="">
                        <label htmlFor="file4">4. Left Side View Product Images:</label>
                        <input type="file" name='file4' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                      </div>

                    </div>

                    <div className="w-full mt-4">
                      <label htmlFor="product_description"><b>Product Description:</b></label>
                      <textarea name='product_description' placeholder="Product Description" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                    </div>

                    <div className="w-full mt-4">
                      <label htmlFor="pdffile"><b>Downloadable pdf Data:</b></label>
                      <input type="file" name='pdffile' placeholder="PDF" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                    </div>

                    <div className="w-full mt-4">
                      <label htmlFor="youtube"><b>YouTube Video Link:</b></label>
                      <input type="text" name='youtube' placeholder="YouTube Video Link" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                    </div>

                    <div className="w-full mt-4">
                      <label htmlFor="news"><b>News Data:</b></label>
                      <textarea name='news' placeholder="News Content" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                    </div>

                    <h1 className=" mt-12 mb-4 text-lg"> <b> Add Product Parameters</b></h1>
                    {/* {/ Add data inputs div /} */}
                    <div className="flex gap-8">
                      <div className="w-full flex flex-col">
                        <input type="text"

                          value={main.title}
                          onChange={(e) => {
                            setMain({ ...main, title: e.target.value });
                          }}

                          name="" id="" placeholder='Parameter Heading' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />

                        <textarea name="" id=""
                          value={main.desc}
                          onChange={(e) => {
                            setMain({ ...main, desc: e.target.value });
                          }}
                          placeholder='Parameter Description' className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                        <input type='button' value="Add Data" onClick={addData} placeholder='button' className=" w-1/4 m-auto px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none mt-8" />
                      </div>
                    </div>

                    {/* Added Data display div*/}
                    <div className="w-full mt-12 flex flex-col gap-4">
                      <h2 className='mb-4 font-bold text-lg'>Added Data:</h2>
                      {value.map((val, idx) => {
                        return (

                          <div key={idx} className="relative bg-blue-600 text-white p-4 rounded-lg">
                            <div className=' gap-12'>
                              <span className='text-lg font-bold capitalize'>{val.title}: </span>
                              <span onClick={() => { removeItem(idx); }} > <img src={delIconWhite} alt="" className='absolute right-2 top-2' /> </span>
                              <br />
                              <div className='flex flex-col'>
                                {val.desc.split(',').map((data, index) => {
                                  return (
                                    <div key={index}>
                                      <span> {data} </span>
                                      <br />
                                    </div>
                                  )
                                })}

                              </div>
                            </div>
                            <br />
                          </div>

                        );
                      })}
                    </div>

                    <div className="mt-5">

                      {
                        loading ? (<div className='mt-10'><ReactLoading type={'spinningBubbles'} color={'#3A4AC9'} height={'40px'} width={'40px'} /></div>
                        ) : (<button type="submit" className="px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none" >Submit</button>
                        )
                      }

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

export default Addproducts