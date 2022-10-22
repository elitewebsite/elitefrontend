import React, { useState } from 'react'
import Login from './LogIn/Login'
import cheackAuth from '../Auth'
import { Link } from 'react-router-dom'
import LogoutIcon from '../icons/exit.png'
import BarChart from './Dashboardcharts/BarChart'

import { UserData } from "./Dashboardcharts/dataChart"
const Dashboard = () => {
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
  return (
    <>
      {
        cheackAuth() ?
          (<div className='admin w-3/4  text-center relative'>

            <div className="logout absolute right-2 top-2" >
              <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
            </div>

            <h1 className='mt-4 text-center text-2xl font-bold'>Welcome to Admin Panel</h1>

            <div className="upper grid grid-cols-2 gap-4 mt-20 p-4" >
              <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                <span className='text-lg font-bold'>Total Products</span>
                <div className="bg-green-500 h-24 w-24 rounded-full text-bottom text-xl font-bold text-black p-7">84</div>
              </div>
              <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                <span className='text-lg font-bold'>Total Series</span>
                <div className="bg-blue-500 h-24 w-24 rounded-full  text-bottom text-xl font-bold text-black p-7">34</div>
              </div>
              <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                <span className='text-lg font-bold'>Total main lights</span>
                <div className="bg-red-500 h-24 w-24 rounded-full  text-bottom text-xl font-bold text-black p-7">64</div>
              </div>
              <div className="w-full border-b-4 border-indigo-700 bg-gray-200 h-36 rounded-xl flex justify-around content-center items-center">
                <span className='text-lg font-bold'>Total Admins</span>
                <div className="bg-indigo-500 h-24 w-24 rounded-full  text-bottom text-xl font-bold text-black p-7">74</div>
              </div>

            </div>
            <BarChart chartdata={userDatas} />
          </div>

          )

          :
          (<Login />)
      }

    </>
  )
}

export default Dashboard