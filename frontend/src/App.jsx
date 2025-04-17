import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AdminHomePage from "./pages/AdminHomePage";
import CustomerPrivateRoute from "./components/CustomerPrivateRoute";
import Cart from "./pages/Cart";
import HallManagerPrivateRoute from "./components/HallManagerPrivateRoute";
import HallManagerDashBoard from "./pages/HallManagerDashBoard";
import ChefPrivateRoute from "./components/ChefPrivateRoute";
import ChefDashBoard from "./pages/ChefDashBoard";
import RestaurantList from "./pages/RestaurantList";
import ReserveTableList from "./pages/ReserveTableList";
import FooterCom from "./components/Footer";
import ViewBills from "./pages/ViewBills";
import ManageTables from "./pages/ManageTables";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/reservetable" element={<ReserveTableList/>}/>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-home" element={<AdminHomePage/>} />
          <Route path="/viewbills" element={<ViewBills/>} />
        </Route>
        <Route element={<HallManagerPrivateRoute />}>
          <Route path="/hall-manager-dashboard" element={<HallManagerDashBoard/>} />
          <Route path="/managetables" element={<ManageTables/>} />
        </Route>
        <Route element={<ChefPrivateRoute />}>
          <Route path="/chef-dashboard" element={<ChefDashBoard/>} />
        </Route>
        <Route element={<CustomerPrivateRoute />}>
          <Route path="/cart" element={<Cart/>} />
        </Route>
      </Routes>
      <FooterCom/>
    </BrowserRouter>
  );
}

export default App;
