import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    // const reload = () => {
    //     localStorage.removeItem('token')
    //     navigate(0)
    // }

    // reload()

    useEffect(() => {
        localStorage.removeItem('token')
        navigate("/")
        //window.location.reload()
    }, [])

    return (
        <></>
    )
}

export default Logout