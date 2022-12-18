import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import delIconWhite from '../../icons/trash.png'
import { useLocation, useNavigate, Link } from 'react-router-dom';

import ReactLoading from 'react-loading';
import cheackAuth from '../../Auth'
import LogoutIcon from '../../icons/exit.png'
import Sidebars from '../Sidebar';

const Updateproduct = () => {
    const location = useLocation()
    const [myfile, setMyfile] = useState('')
    const [arr, setArray] = useState([])

    //it formats the image into string format becuase vercel isnt supports file system
    const imageFormator = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                resolve({ img: reader.result, filename: file.name })
            }
        })
    }
    //Converting PDf to string
    const pdfFormator = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                resolve({ img: reader.result, filename: file.name, title: filetitle.title })
            }
        })
    }
    //couinary image upload function 
    const uploaderimg = (myimage) => {

        return new Promise((resolve, reject) => {
            const dataForm = new FormData();
            dataForm.append("file", myimage.img);
            dataForm.append("upload_preset", "ofqztuvt")
            dataForm.append("cloud_name", "dql4azndw")
            //uploading image to cloudinary 
            axios.post('https://api.cloudinary.com/v1_1/dql4azndw/image/upload', dataForm).then((res) => {
                //getting only required data
                resolve({ url: res.data.url, public_id: res.data.public_id })
            }).catch((err) => {
                notify(0, "sorry error in cloudinary.")
            })


        })
    }

    //couinary pdf upload function 
    const uploaderpdf = (myimage) => {
        return new Promise((resolve, reject) => {
            const dataForm = new FormData();
            dataForm.append("file", myimage.image);
            dataForm.append("upload_preset", "ofqztuvt")
            dataForm.append("public_id", myimage.filename)
            dataForm.append("cloud_name", "dql4azndw")
            //uploading image to cloudinary 
            axios.post('https://api.cloudinary.com/v1_1/dql4azndw/raw/upload', dataForm).then((res) => {
                //getting only required data
                resolve({ url: res.data.url, public_id: res.data.public_id, title: myimage.title })
            }).catch((err) => {
              
                notify(0, "sorrry error in clouidinary.")
            })


        })
    }

    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
    const [prev, setPrev] = useState([])
    const [value, setValue] = useState([]);
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        cheackAuth() ? setFlag(true) : (navigate("/"));
    }, [location.state.id])

    //getproduct details by id to update
    useEffect(() => {
        axios.post("https://elitebackend-sage.vercel.app/admincrud/getproductbyid", { id: location.state.id }, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            setPrev(res.data)
            setValue(res.data.info)
            setImages(res.data.images)
            setlinkbucket(res.data.youtube)
            setAddnewsdata(res.data.news)

        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/logout')
            }
            else {
                notify(0, "Internal server error..")
            }
        });
    }, [location.state.id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target)
        const data = Object.fromEntries(formdata.entries())
        setLoading(true)

        //***********image uloading start*********//
        const resulsetimg = arr.map(async (val, idx) => {
            const myresult = await uploaderimg(val)
            return myresult
        })
        let imageResponses = await Promise.all(resulsetimg);
        //**************image uploading end*******//

        //***********pdf uloading start ****//
        const resulsetpdf = pdfBucket.map(async (val, idx) => {
            const myresult = await uploaderpdf(val)
            return myresult
        })
        let pdfResponses = await Promise.all(resulsetpdf);
       
        //**************pdf uploading end/*********/
        // Whatever data received from dynamic inputs for light parameters + all form data received after submit. we are send as payload
        const payload = { ...data, info: JSON.stringify(value), id: location.state.id, images: JSON.stringify(imageResponses), pdffile: JSON.stringify(pdfResponses), youtube: JSON.stringify(linkbucket), news: JSON.stringify(addnewsdata) }

        axios.post('https://elitebackend-sage.vercel.app/admincrud/updateproduct', payload, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": localStorage.getItem('token')
            },
        }).then((res) => {
            notify(1, "Product Descirption Added Successfully..")
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
        e.target.pdffile.value = ""
        setValue([])

    }
    //*******1.add data to parametr bucket */
    const [main, setMain] = useState({
        title: '',
        desc: '',
    });

    //2.add data to bucket 
    const addData = () => {
        setValue([...value, main]);
        setMain({ title: '', desc: '' });
    };
    //3.remove the item from all buckect
    const removeItem = (idx) => {
        const filterData = value.filter((element, index) => {
            return index !== idx;
        });
        setValue(filterData);
    };


    //*************Multiple Youtube Add************
    const [youtubelink, setYoutubelink] = useState('')
    const [linkbucket, setlinkbucket] = useState([])
    //1.add yotube link to bucket
    const handleYoutubeAdd = () => {
        setlinkbucket([...linkbucket, youtubelink])
    }
    //2.delete youtube from bucket
    const deleteLink = (id) => {
        const newArray = linkbucket.filter((ele, idx) => {
            return id != idx
        })
        setlinkbucket(newArray)
    }
    //*********youtube end ***********

    //*******adding image *********** */
    //2.it adds the images to the image bucket 
    const handleChange = async () => {
        if (myfile) {
            if (myfile.size < 500000) {
                const final = await imageFormator(myfile)
                setArray([...arr, final])
            }
            else {
                window.alert("file size should not be more than 500kb")
            }
        }
        else {
            window.alert("please choose a file first")
        }

    }
    //3.it deletes the image from bucket
    const deleteImage = (idx) => {
        const filterData = arr.filter((element, index) => {
            return index !== idx;
        });
        setArray(filterData);
    }
    //*********dynamic image addttion completed

    //*************multiple NEWS data*******
    const [newsdata, setNewsdata] = useState('');
    const [addnewsdata, setAddnewsdata] = useState([]);

    //1.add data to state
    const handleNewsadd = (e) => {
        setNewsdata(e.target.value);
    }
    //2.add data to news
    const handleNewsdataAdd = () => {
        if (newsdata) {
            setAddnewsdata([...addnewsdata, newsdata])
            setNewsdata('')
        }
        else {
            window.alert("News Cannot be empty...!")
        }
    }
    //3. Delete News
    const handleNewsDelete = (idx) => {
        const newArray = addnewsdata.filter((element, index) => {
            return (
                idx !== index
            )
        })
        setAddnewsdata(newArray);
    }
    //********multiple news data end */
    // ******* Dynamic Downloadable Files Start **************
    const [pdfBucket, setPdfBucket] = useState([]);
    const [filetitle, setFiletitle] = useState({
        title: '',
        image: '',
    });
    // 1. Add Title
    const handlePdfTitle = (e) => {
        setFiletitle({ ...filetitle, title: e.target.value });
    }
    // 2. Add PDF/RAR file
    const handlePDFData = async (event) => {
        const pdfImage = await pdfFormator(event.target.files[0]);
        setFiletitle({ ...filetitle, image: pdfImage.img, filename: pdfImage.filename });
    }
    // 3. Add To bucket
    const handleSubmitPdfData = () => {
        if (filetitle.title !== '' && filetitle.image !== '') {
            setPdfBucket([...pdfBucket, filetitle]);
        } else {
            window.alert("Fields Can't be Empty..")
        }
    }
    //4. Deleting PDF files from bucket
    const deletePdfData = (idx) => {
        const newData = pdfBucket.filter((ele, ind) => {
            return idx != ind
        })
        setPdfBucket(newData)
    }
    // ******* Dynamic Downloadable Files End **************
    return (
        <>
            {
                flag ?
                    (
                        <>
                            <Sidebars />
                            <div className='admin w-3/4 mt-24'>
                                <div className="logout absolute right-2 top-2" >
                                    <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                                </div>

                                <div className="form">
                                    <div className="w-full px-10 overflow-hidden bg-white rounded-lg border-2 shadow-lg dark:bg-gray-800">
                                        <div className="px-6 py-4">
                                            <p className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 uppercase font-bold border-b-2 p-y-2 border-indigo-800 w-1/2 m-auto">Update Product</p>
                                            <ToastContainer position="bottom-left" hideProgressBar="true" autoClose="6000" />
                                            <form onSubmit={handleSubmit} autoComplete="off">

                                                <div className="w-full mt-4">
                                                    <label htmlFor="series_name"><b>Light Series:</b> </label>
                                                    <select name="series_name" id="series_name" value={prev.series_name} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300">
                                                        <option value={prev.series_name} >{prev.series_name}</option>
                                                    </select>

                                                </div>

                                                <div className="w-full mt-4">
                                                    <label htmlFor="product_name"><b>Product Name:</b></label>
                                                    <input type="text" name='product_name' value={prev.product_name} onChange={(e) => { setPrev({ ...prev, product_name: e.target.value }) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                                </div>

                                                <div className="w-full mt-4">
                                                    <label htmlFor="model_no"> <b>Product Model Number:</b></label>
                                                    <input type="text" name='model_no' value={prev.model_no} onChange={(e) => { setPrev({ ...prev, model_no: e.target.value }) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" required />
                                                </div>

                                                <h1 className='text-base capitalize font-bold mt-4'>Previous Images: </h1>
                                                <div className='grid grid-cols-6 gap-x-6 w-full'>
                                                    {
                                                        images?.map((val, idx) => {
                                                            return (
                                                                <div className="w-full flex gap-3 flex-col">
                                                                    <img src={val.url} alt="no_image" key={idx} />
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>

                                                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 mt-6">

                                                    <label htmlFor="file1"><b>Upload New Product Images: </b></label> <br /> <br />
                                                    {/* dynamic gallery logic */}
                                                    <input type="file" name="" id="" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" onChange={(e) => { setMyfile(e.target.files[0]) }} />
                                                    <input type="button" className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg' value="Add Image" onClick={handleChange} />
                                                    <div className='grid grid-cols-4 gap-x-6 w-full'>
                                                        {
                                                            arr.map((val, idx) => {
                                                                return (
                                                                    <div className='w-full flex gap-3 flex-col'>
                                                                        <img src={val.img} alt="" />
                                                                        <input type="button" className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none' value="Delete" onClick={() => { deleteImage(idx) }} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>

                                                </div>


                                                <div className="w-full mt-4">
                                                    <label htmlFor="product_description"><b>Product Description:</b></label>
                                                    <textarea name='product_description' value={prev.product_description} onChange={(e) => { setPrev({ ...prev, product_description: e.target.value }) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                </div>

                                                <h1 className='text-xl capitalize font-bold mt-4'>previous PDF Files</h1>
                                                <div className='grid grid-cols-4 gap-x-6 w-full mt-8'>
                                                    {
                                                        prev.pdflink?.map((val, idx) => {
                                                            return (
                                                                <div className='w-full flex gap-3 flex-col'>
                                                                    {
                                                                        ["zip", "rar"].includes(val.url.split(".").pop()) ? (<h1 className='bg-blue-500 text-white h-full text-center font-bold text-lg'>This file is zip or rar which is no supported<br /><a href={val.url} download className='text-black' >download</a></h1>) : (<iframe src={val.url} frameBorder="0" ></iframe>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>

                                                {/* <div className="w-full mt-4">
                                                    <label htmlFor="pdffile"><b>Downloadable pdf Data:</b></label>
                                                    <div className='flex gap-4'>
                                                        <input type="file" name='pdffile' onChange={(e) => { setMyfilepdf(e.target.files[0]) }} placeholder="PDF" className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />

                                                        <input type="button" onClick={handleChangepdf} className='px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg' value="Add PDF" />
                                                    </div>

                                                    <div className='grid grid-cols-4 gap-x-6 w-full mt-8'>
                                                        {
                                                            pdfbucket?.map((val, ind) => {
                                                                return (
                                                                    <div className='w-full flex gap-3 flex-col'>
                                                                        <embed src={val.img} />
                                                                        <input type="button" onClick={() => { deletePdf(ind) }} className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none' value="Delete" />

                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div> */}
                                                <div className="w-full mt-4">
                                                    <br />
                                                    <label htmlFor="pdf_title"><b>Downloadable File Title:</b></label>

                                                    <input type="text" onChange={handlePdfTitle} name='pdf_title' placeholder="File Title" className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                    <br />
                                                    <label htmlFor="pdffile"><b>Upload Downloadable File:</b></label>
                                                    <div className='flex gap-4'>
                                                        <input type="file" onChange={handlePDFData} name="" id="" className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                        <input type="button" onClick={handleSubmitPdfData} className='px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg' value="Add PDF" />
                                                    </div>

                                                    <div className='grid grid-cols-4 gap-x-6 w-full mt-8'>
                                                        {
                                                            pdfBucket.map((val, idx) => {
                                                                return (
                                                                    <div className='w-full flex gap-3 flex-col'>
                                                                        <p className='text-lg font-bold'>Title: {val.title}</p>
                                                                        <embed src={val.image} />
                                                                        <input type="button" className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none' value="Delete" onClick={() => { deletePdfData(idx) }} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>

                                                </div>
                                                <div className="w-full mt-4">
                                                    <label htmlFor="youtube"><b>YouTube Video Link:</b></label>
                                                    <div className='flex gap-4'>
                                                        {/* <input type="text" name='youtube' value={prev.youtube} onChange={(e) => { setPrev({ ...prev, youtube: e.target.value }) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" /> */}
                                                        <input type="text" name='youtube' onChange={(e) => { setYoutubelink(e.target.value) }} placeholder="YouTube Video Link" className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                        <input type='button' value="Add Link" onClick={handleYoutubeAdd} placeholder='button' className="px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg" />
                                                    </div>
                                                </div>

                                                <div className='grid grid-cols-4 gap-x-6 w-full mt-8'>
                                                    {
                                                        linkbucket?.map((val, id) => {
                                                            return (
                                                                <div className="flex flex-col">
                                                                    <iframe width="100%" height="200px" frameBorder="0" allowFullScreen
                                                                        src={`https://www.youtube.com/embed/${val.split('=')[1]}`}>
                                                                    </iframe>
                                                                    <input type="button" onClick={() => { deleteLink(id) }} className='mt-2 mb-4 px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none' value="Delete" />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="w-full mt-4">
                                                    <label htmlFor="news"><b>News Data:</b></label>
                                                    <div className="flex gap-4">
                                                        <textarea name='news' placeholder="News Content" value={newsdata} onChange={handleNewsadd} className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                        <input type='button' value="Add News" onClick={handleNewsdataAdd} placeholder='button' className="px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg h-16 mt-8" />
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-x-6 w-full mt-8 ">
                                                        {
                                                            addnewsdata?.map((value, index) => {
                                                                return (

                                                                    <div className='flex flex-col gap-2'>
                                                                        <p>{value}</p>
                                                                        <span onClick={() => { handleNewsDelete(index) }} className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none text-center font-bold' >Delete Link</span>
                                                                    </div>

                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>

                                                {/* <div className="w-full mt-4">
                                                    <label htmlFor="news"><b>News Data:</b></label>
                                                    <textarea name='news' value={prev.news} onChange={(e) => { setPrev({ ...prev, news: e.target.value }) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                                                </div> */}

                                                <h1 className=" mt-12 mb-4 text-lg"> <b> Add Product Parameters</b></h1>
                                                {/* Add data inputs div */}
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
                                                    {value?.map((val, idx) => {
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

                                                <div className="mt-10">
                                                    {
                                                        loading ? (<div className=' mt-10'><ReactLoading type={'spinningBubbles'} color={'#3A4AC9'} height={'40px'} width={'40px'} /></div>
                                                        ) : (<button type="submit" className="flex px-20 py-8 mt-20 m-auto leading-5 text-white transition-colors text-xl font-bold duration-300 transform bg-green-700 rounded hover:bg-green-600 focus:outline-none" >Submit</button>
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

export default Updateproduct