import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../componenet/Doctorcomponent/Sidebar/Sidebar'
import Navbar from '../../componenet/Doctorcomponent/Navbarr/Navbar.jsx'
import './DoctorLayout.css'

const DoctorLayout = () => {
    return (
        <div className="doctor-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default DoctorLayout