import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import AddHotel from '../components/AddHotel';
import AdminDashboard from '../components/AdminDashboard';
import { useSelector } from 'react-redux';
import AddFood from '../components/AddFood';

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
    </div>
  )
}

export default Dashboard