import React from 'react'
import Login from './LogIn/Login'
import cheackAuth from '../Auth'
import { Link } from 'react-router-dom'
import LogoutIcon from '../icons/exit.png'

const Dashboard = () => {
  return (
    <>
      {
        cheackAuth() ?
          (<div className='admin w-3/4  text-center relative'>

            <div className="logout absolute right-2 top-2" >
              <Link to="/logout">  <img src={LogoutIcon} alt="Image" /></Link>
            </div>

            <div className="">
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
              <div className="lower gap-4 flex items-end mt-16 ml-4 border-b-2 border-black border-l-2 px-4">
                <div className="chart1 h-60 w-12 bg-red-500 animate-bounce delay-700 skew-y-12 shadow-xl"></div>
                <div className="chart2 h-48 w-12 bg-green-500 animate-bounce delay-900"></div>
                <div className="chart3 h-12 w-12 bg-indigo-900 animate-bounce delay-1000"></div>
                <div className="chart4 h-36 w-12 bg-gray-700 animate-bounce delay-600"></div>

                <div className="chart3 h-12 w-12 bg-indigo-900 animate-bounce delay-700"></div>
                <div className="chart1 h-60 w-12 bg-red-500 animate-bounce delay-900"></div>
                <div className="chart4 h-36 w-12 bg-gray-700 animate-bounce delay-1000"></div>
                <div className="chart2 h-48 w-12 bg-green-500 animate-bounce delay-600"></div>

              </div>
              
            </div>
          </div>

          )

          :
          (<Login />)
      }

    </>
  )
}

export default Dashboard