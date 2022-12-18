import React, { useEffect, useState } from 'react'
import Login from './LogIn/Login'
import cheackAuth from '../Auth'
import LogoutIcon from '../icons/exit.png'
import { UserData } from "./Dashboardcharts/dataChart"
import axios from 'axios'
import Sidebars from './Sidebar'

import { useLocation, Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userDatas, setUserData] = useState({
    labels: UserData.map((val) => val.year),
    datasets: [{
      label: "Analatycal dashboard",
      data: UserData.map((val) => val.userGain),
      backgroundColor: ['#8458B3', '#d0bdf4', '#a28089'],
      borderColor: "black",
      borderWidth: 2,
      circlar: true
    }]
  })
  const [flag, setFlag] = useState(false);
  const [analytic, setAnalytic] = useState([])

  useEffect(() => {
    cheackAuth() ? setFlag(true) : (navigate("/"));
    axios.get("https://elitebackend-sage.vercel.app/admincrud/getanalyticsdata", {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": localStorage.getItem('token')
      },
    }).then((res) => {
      setAnalytic(res.data)
    }).catch((err) => {
      if (err.response.status === 401) {
      //  navigate('/admintable')
      }
    })
  }, [])

  return (
    <>
      {
        cheackAuth() ?
          (
            <>
              <Sidebars />
              <div className='admin w-3/4  text-center relative'>

                <div className="logout absolute right-2 top-2" >
                  <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
                </div>

                <h1 className='mt-4 text-center text-2xl font-bold'>Welcome to Admin Panel</h1>

                <div className="upper grid grid-cols-2 gap-6 mt-20 p-4" >
                  <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                    <span className='text-lg font-bold'>Main Light Categories</span>
                    <div className="bg-red-500 h-24 w-24 rounded-full  text-bottom text-xl font-bold text-black p-7">{analytic.mainlight}</div>
                  </div>
                  <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                    <span className='text-lg font-bold'>Total Added Series</span>
                    <div className="bg-blue-500 h-24 w-24 rounded-full  text-bottom text-xl font-bold text-black p-7">{analytic.series}</div>
                  </div>
                  <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                    <span className='text-lg font-bold'>Total Added Products</span>
                    <div className="bg-green-500 h-24 w-24 rounded-full text-bottom text-xl font-bold text-black p-7">{analytic.product}</div>
                  </div>
                  <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                    <span className='text-lg font-bold'>Total Created Admin</span>
                    <div className="bg-indigo-500 h-24 w-24 rounded-full  text-bottom text-xl font-bold text-black p-7">{analytic.users}</div>
                  </div>

                </div>
                {/* <BarChart chartdata={userDatas} /> */}
              </div>
            </>
          )

          :
          (<Login />)
      }

    </>
  )
}

export default Dashboard