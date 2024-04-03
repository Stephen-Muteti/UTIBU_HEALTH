import logo from './logo.svg';
import './assets/app.min.css';
import './assets/bootstrap.min.css';
import './assets/jsvectormap.min.css';
import './App.css';
import './assets/css/font-awesome.min.css';
import './assets/css/style-liberty.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import { AuthProvider } from './components/auth.js';
import {RequireAuth} from './components/RequireAuth';
import Header from './components/Header.js';
import NotFound from './components/NotFound.js';
import Home from './components/user/Home.js';
import Order from './components/user/Order.js';
import Contact from './components/user/Contact.js';
import Register from './components/Register.js';
import Medications from './components/Medications.js';
import AdminHome from './components/admin/AdminHome.js';
import UserHome from './components/user/UserHome.js';
import AdminMedications from './components/admin/AdminMedications.js';
import MedicationEdit from './components/admin/MedicationEditForm.js';
import AdminOrders from './components/admin/Orders.js';
import CheckOutForm from './components/user/CheckOut.js';

function App() {
  return (
    <AuthProvider>
        <Routes>

        <Route path="/" element={<RequireAuth><UserHome /></RequireAuth>}>
          <Route index element={<Home />} />
          <Route path="orders" element={<Order/>} />
          <Route path="medications" element={<Medications/>} />
          <Route path="contact" element={<Contact/>} />
          <Route path="checkout" element={<CheckOutForm/>} />
        </Route>

        <Route path="/admin" element={<RequireAuth requiredRole={["admin"]}><AdminHome /></RequireAuth>}>
          <Route index element={<AdminMedications />} />
          <Route path="orders" element={<AdminOrders/>} />
          <Route path="medications" element={<AdminMedications/>} />
          <Route path="edit-medication/:medicationId" element={<MedicationEdit/>} /> 
        </Route>  

        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        
        <Route path="*" element={<NotFound />} />             

        </Routes>
    </AuthProvider>
  );
}

export default App;
