import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import AddHotel from '../components/AddHotel';
import AdminDashboard from '../components/AdminDashboard';
import { useSelector } from 'react-redux';
import AddFood from '../components/AddFood';
import AddStaff from '../components/AddStaff';
import AddTables from '../components/AddTables';

function Dashboard() {
    const location = useLocation();
    const [tab,setTab] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl === 'admin-dashboard' && currentUser?.role !== 'hotel_admin') {
            navigate('/dashboard?tab=profile'); 
          } else {
            setTab(tabFromUrl);
          }
    },[location.search, currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56">
            <DashSidebar/>
        </div>
        { tab === "profile" && <DashProfile/>}
        { tab === "add-hotel" && <AddHotel/>}
        { tab === "admin-dashboard" && currentUser?.role === "hotel_admin" && <AdminDashboard />}
        { tab === "add-food" && currentUser?.role === "hotel_admin" && <AddFood/>}
        { tab === "add-staff" && currentUser?.role === "hotel_admin" && <AddStaff/>}
        { tab === "add-tables" && currentUser?.role === "hotel_admin" && <AddTables/>}
    </div>
  )
}

export default Dashboard