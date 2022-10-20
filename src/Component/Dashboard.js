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

            Hello Dashboard</div>)
          :
          (<Login />)
      }

    </>
  )
}

export default Dashboard