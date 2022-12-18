import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import cheackAuth from '../../Auth'
import { useState } from 'react';
import LogoutIcon from '../../icons/exit.png'
import Sidebars from '../Sidebar';
import ReactLoading from 'react-loading';


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

    //cloudinary image upload function 
    const uploaderimg = (myimage) => {
        return new Promise((resolve, reject) => {
            const dataForm = new FormData();
            dataForm.append("file", myimage.image);
            dataForm.append("upload_preset", "ofqztuvt")
            dataForm.append("cloud_name", "dql4azndw")
            //uploading image to cloudinary 
            axios.post('https://api.cloudinary.com/v1_1/dql4azndw/image/upload', dataForm).then((res) => {
                //getting only required data
                resolve({ url: res.data.url, public_id: res.data.public_id, title: myimage.title })
            }).catch((err) => {
                notify(0, "sorrry error in clouidinary.")
            })
        })

    }

    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const navigate = useNavigate();
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
    }, [navigate])


    //api to submit data for carousel
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(!loading)
        if (alldata.length !== 0) {

            // ***********image uloading start*********//
            const resulsetimg = alldata.map(async (val, idx) => {
                const myresult = await uploaderimg(val)
                return myresult
            })
            let imageResponses = await Promise.all(resulsetimg);
            //**************image uploading end*******//
            axios.post("https://elitebackend-sage.vercel.app/homepagecarousel/updatecarouseldetails", { info: JSON.stringify(imageResponses) }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem('token')
                },
            }).then((res) => {
                setLoading(false)
                notify(1, "Home Page Updated Successfully..")
                setAlldata([])
            }).catch((err) => {
                setLoading(false)
                if (err.response.status === 401) {
                    navigate('/logout')
                }
                else {
                    if (err.response.status === 401) {
                        navigate('/logout')
                    }
                    notify(0, "Internal server error..")
                }
            })
        }
        else {
            window.alert("Fields cannot be empty...")
        }
    }

    //handles about us details
    const handleSubmit1 = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.target)
        const data = Object.fromEntries(formdata.entries())
        setLoading1(true)
        if (data.file3 && data.file4 && data.file3.size < 500000 && data.file4.size < 500000) {
            const payload = { ...data, file3: await imageFormator(data.file3), file4: await imageFormator(data.file4) }
            axios.post("https://elitebackend-sage.vercel.app/apiforabout/updateaboutdetails", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem('token')
                },
            }).then((res) => {
                console.log(res)
                notify(1, "Home Page Updated Successfully..")
                setLoading1(false)
                setMain({
                    title: '',
                    image: ''
                })
                setAlldata([])
            }).catch((err) => {
                console.log(err)
                setLoading1(false)
                if (err.response.status === 401) {
                    navigate('/logout')
                }
                else {
                    notify(0, "Internal server error..")

                }
            })
        }
        else {
            window.alert("please choose a file file size should not be more than 500kb")
        }
        e.target.about1title = "";
        e.target.about1desc.value = "";
        e.target.file3.value = "";
        e.target.about2title = "";
        e.target.about2desc.value = "";
        e.target.file4.value = "";
    }
    //Mutliple Carousel Image  & Title
    const [alldata, setAlldata] = useState([])
    const [main, setMain] = useState({
        title: '',
        image: '',
    });
    //getting title
    const handleTitle = (e) => {
        setMain({ ...main, title: e.target.value })
    }

    //getting image
    const handleCarouselImage = async (event) => {
        if (event.target.files[0].size < 700000) {
            const newImage = await imageFormator(event.target.files[0])
            setMain({ ...main, image: newImage })
        }
        else {
            window.alert("Image size should be less than 500 KB")
        }
    }

    //2.adding image to bucket for carousel
    const addtoBucket = () => {
        if (alldata.length < 10) {
            if (main.image !== '' && main.title !== '') {
                setAlldata([...alldata, main])

            }
            else {
                window.alert("Fields Cannot Be Empty...!")
            }
        }
        else {
            window.alert("Oops..Image Addition Limit Exceeds..")
        }
    }

    //3.deleting image from bucket
    const handleRecordDel = (id) => {
        const newArray = alldata.filter((ele, indx) => {
            return indx != id
        })
        setAlldata(newArray)
    }
    return (
        <>
            {
                flag ?
                    (
                        <>
                            <Sidebars />
                            <div className='admin w-3/4 px-2'>
                                <div className="logout absolute right-2 top-2" >
                                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                                </div>
                                <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                                <div className="form">
                                    <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                                        <div className="px-6 py-4">
                                            <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold">Add Home Page Detail</p>

                                            {/* handling carousel data  */}
                                            <form onSubmit={handleSubmit} autoComplete="off">
                                                {/* Corousel 1 Title & Image */}
                                                <h3 className='text-center mt-8 mb-8 font-bold text-lg border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto'>Add Carousel Details</h3>

                                                <div className="w-full">

                                                    <label htmlFor="carousel1title">Add Carousel Title </label>
                                                    <div className='flex gap-4'>
                                                        <input type="text" onChange={handleTitle} alue={main.title} className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                        <input type="file" onChange={handleCarouselImage} className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                        <input type="button" onClick={addtoBucket} value="Add Data" className='px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg' />
                                                    </div>

                                                    <div className='grid grid-cols-5 gap-x-6 w-full'>
                                                        {
                                                            alldata?.map((val, index) => {
                                                                return (
                                                                    <div key={index} className="flex flex-col mt-4">
                                                                        <img src={val.image} alt="Image" />
                                                                        <p className='text-center font-semibold text-lg mt-4'>{val.title}</p>
                                                                        <span onClick={() => { handleRecordDel(index) }} className='cursor-pointer bg-blue-700 text-white text-center mt-4 font-semibold py-2 px-3' >Delete Record</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-6">
                                                    {
                                                        loading ? (
                                                            <div className='mt-10'><ReactLoading type={'spinningBubbles'} color={'#3A4AC9'} height={'40px'} width={'40px'} /></div>
                                                        ) : (<button type="submit" className=" cursor-pointer px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none">Submit Carousel details</button>
                                                        )
                                                    }
                                                </div>
                                            </form>

                                            {/* form for about section */}
                                            <form onSubmit={handleSubmit1}>
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
                                                    <label htmlFor="file3">Upload About 1 Image </label>
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
                                                    {
                                                        loading1 ? (<div className='mt-10'><ReactLoading type={'spinningBubbles'} color={'#3A4AC9'} height={'40px'} width={'40px'} /></div>
                                                        ) : (<button type="submit" className="px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none">Submit About us details</button>
                                                        )
                                                    }
                                                </div>
                                            </form>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </>

                    )
                    :
                    ('')
            }
        </>
    )
}

export default Homepage