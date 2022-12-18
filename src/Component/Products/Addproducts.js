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
import Sidebars from '../Sidebar';

const Addproducts = () => {

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

  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const notify = (p, msg) => p ? toast.success(msg) : toast.error(msg);
  const [category, setCategory] = useState([])
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false)

  //*******dynamic image addition start ************
  const [myfile, setMyfile] = useState('')
  const [arr, setArray] = useState([])

  //2. adds the images to the image bucket 
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
  //3.deletes the image from bucket
  const deleteImage = (idx) => {
    const filterData = arr.filter((element, index) => {
      return index !== idx;
    });
    setArray(filterData);
  }

  // //*********dynamic image addttion completed

  //getting series names from database
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

  //cloudinary image upload function 
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
          notify(0, "sorrry error in clouidinary.")
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

        // uploading image to cloudinary 
        axios.post('https://api.cloudinary.com/v1_1/dql4azndw/raw/upload', dataForm).then((res) => {
          //getting only required data
          resolve({ url: res.data.url, public_id: res.data.public_id, title: myimage.title })
        }).catch((err) => {
          notify(0, "sorrry error in clouidinary.")
        })
      })

   
  }

  //handle the submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target)
    const data = Object.fromEntries(formdata.entries())
    setLoading(true)

    // ***********image uloading start*********//
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
    const payload = { ...data, info: JSON.stringify(value), pdffile: JSON.stringify(pdfResponses), images: JSON.stringify(imageResponses), youtube: JSON.stringify(addlink), news: JSON.stringify(addnewsdata) }
    setLoading(false)
    axios.post('https://elitebackend-sage.vercel.app/admincrud/addproduct', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": localStorage.getItem('token')
      },
    }).then((res) => {
      notify(1, "Product Added Successfully..")
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      if (err.response.status === 401) {
        navigate('/logout')
      }
      else {
        notify(0, "Internal server error..")
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

  //**********parameter section start ***********/

  //1.logic for dynamic paramter addtion
  const [main, setMain] = useState({
    title: '',
    desc: '',
  });
  //2.add data to bucket for parametes section
  const addData = () => {
    setValue([...value, main]);
    setMain({ title: '', desc: '' });
  };
  //3.remove the item from all buckect for parameter section
  const removeItem = (idx) => {
    const filterData = value.filter((element, index) => {
      return index !== idx;
    });
    setValue(filterData);
  };
  //**************parametrs section end *******************/

  //**********Multiple Youtube link/*********/
  // 1. adding inserted link into state variable:
  const [link, setLink] = useState('')
  const [addlink, setAddlink] = useState([])

  const handleYoutube = (e) => {
    setLink(e.target.value)
  }
  // 2. Handling button change:
  const handleYoutubeAdd = () => {
    if (link) {
      setAddlink([...addlink, link])
      setLink('')
    }
    else {
      window.alert("Empty Addition is Not Possible")
    }
  }
  // 3. Delete youtube link:
  const handlelinkDelete = (id) => {
    const newArray = addlink.filter((element, indx) => {
      return indx !== id
    })
    setAddlink(newArray)
  }
  //********* youtube link section end *******/

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
  // *********** Dynamic news end ************

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
              <div className='admin w-3/4 mt-24 px-2'>
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
                          {/* dynamic gallery logic */}
                          <input type="file" name="" id="" onChange={(e) => { setMyfile(e.target.files[0]) }} className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />

                          <input type="button" onClick={handleChange} className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg' value="Add Image" />
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
                          <textarea name='product_description' placeholder="Product Description" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                        </div>

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

                        {/* Multiple Youtube Links Bucket */}
                        <div className="w-full mt-4">
                          <label htmlFor="youtube"><b>YouTube Video Link:</b></label>
                          <div className="flex gap-4">
                            <input type="text" name='youtube' value={link} onChange={handleYoutube} placeholder="YouTube Video Link" className="block w-1/2 px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" />
                            <input type='button' value="Add Link" onClick={handleYoutubeAdd} placeholder='button' className="px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg" />
                          </div>

                          {
                            addlink.length !== 0 ? (<p className='text-lg font-bold mb-6 mt-8'>Added Youtube Links: </p>) : ('')
                          }

                          <div className="grid grid-cols-4 gap-x-6 w-full mt-8 ">
                            {
                              addlink?.map((value, index) => {
                                return (

                                  <div className='flex flex-col gap-2'>
                                    <iframe width="100%" height="200px" frameBorder="0" allowFullScreen
                                      src={`https://www.youtube.com/embed/${value.split('=')[1]}`}>
                                    </iframe>
                                    <span onClick={() => { handlelinkDelete(index) }} className='px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none text-center font-bold' >Delete Link</span>
                                  </div>

                                )
                              })
                            }
                          </div>
                        </div>
                        {/* multiple news data */}
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

                        <h1 className=" mt-12 mb-4 text-lg"> <b> Add Product Parameters</b></h1>
                        {/* {/ Add data inputs div /} */}
                        <div className="w-full flex gap-8">
                          <div className="w-1/2 flex flex-col">
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
                          </div>

                          <input type='button' value="Add Data" onClick={addData} placeholder='button' className="px-4 w-1/4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-600 focus:outline-none w-1/2 font-bold text-lg h-16 mt-8" />

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
                            ) : (<button type="submit" className="flex px-20 py-8 mt-20 m-auto leading-5 text-white transition-colors text-xl font-bold duration-300 transform bg-green-700 rounded hover:bg-green-600 focus:outline-none">Submit Data</button>
                            )
                          }

                        </div>
                      </form>

                    </div>

                  </div>

                </div>
              </div >
            </>
          )
          :
          ('')
      }
    </>
  )
}

export default Addproducts