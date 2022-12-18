import React, { useState } from 'react'
import adminImg from '../icons/admin.png'
import categoryImg from '../icons/categories.png'
import eliteLogo from '../../src/icons/elite_black_logo.png'
import { Link } from 'react-router-dom'
import cheackAuth from '../Auth'

const Sidebars = () => {
    return (
        <>

            <div className="flex flex-col w-1/4 h-screen py-8 bg-white border-r dark:bg-gray-900 dark:border-gray-700">
                <div className="flex flex-col justify-between flex-1 ">
                    <img src={eliteLogo} alt="Image" className=' h-20 w-44 m-auto rounded-lg p-2 mb-2' />
                    <nav className='p-2 flex flex-col gap-4'>
                        <span className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-800 bg-gray-200 dark:text-gray-200" href="#">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <span className="mx-4 font-medium"><Link to="/">Dashboard</Link></span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={adminImg} />
                            <span className="mx-4 font-medium"> <Link to={cheackAuth() ? "/admintable" : "/"}>Admin Details</Link></span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium"><Link to={cheackAuth() ? "/lightcategorytable" : "/"} >Main Light Category Details</Link></span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium"> <Link to={cheackAuth() ? "/seriestable" : "/"}>Light Series Details</Link></span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium"> <Link to={cheackAuth() ? "/productstable" : "/"}>Product Details</Link></span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium">
                                <Link to="/home">Home Page & About us details</Link>
                            </span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium"> <Link to="/queries">Contact Form Data</Link></span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium">
                                <Link to="/branchesdetails">Branch Details</Link>
                            </span>
                        </span>
                        
                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium">
                                <Link to="/gallerytable">Gallery Page Details</Link>
                            </span>
                        </span>

                        <span className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform bg-gray-200 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                            <img src={categoryImg} />
                            <span className="mx-4 font-medium">
                                <Link to="/featuredproductstable">Featured Products</Link>
                            </span>
                        </span>

                        <h1 className='mt-6 text-sm text-center '> Developed By <span href="https://muchmark.in" target="_blank">Muchmark Business Solution</span> </h1>
                    </nav>

                </div>
            </div>
        </>

    )
}

export default Sidebars