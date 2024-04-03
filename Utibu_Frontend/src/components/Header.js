import {NavLink, Outlet} from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/Info';
import BarChartOutlinedIcon from '@mui/icons-material/BarChart';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import MoneyIcon from '@mui/icons-material/Money';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.js';


const Header = () => {
    const auth = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
        auth.logout();
    };

	return (
        <>
        <section className="w3l-top-header-content">
            <div className="hny-top-menu">
                <div className="container">
                    <div className="row">
                        <div className="top-left col-lg-6">
                            <ul className="accounts">
                                <li className="top_li">
                                    <span className="fa fa-map-o"></span>
                                    <a href="#">123 Nairobi Road, Nairobi, Kenya</a>
                                </li>
                                <li className="top_li mr-lg-0">
                                    <span className="fa fa-envelope-o"></span>
                                    <a href="/cdn-cgi/l/email-protection#86ebe7efeac6e5e9ebf6e7e8ffa8e5e9eb" className="mail">
                                        <span className="__cf_email__">info@utibu-health.com</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="social-top col-lg-6 mt-lg-0 mt-sm-3">                           
                        {auth.user ? (
                            <div className="top-bar-text">
                                <NavLink className="bk-button">{auth.user.username}</NavLink>
                                <Button onClick={handleLogout} style={{color:"#ffffff"}}>
                                    <span className="d-block d-sm-none"><i><LogoutIcon/></i></span>
                                    <span className="d-none d-sm-block">Logout</span>    
                                </Button>
                            </div>                                
                            ): (
                            <div className="top-bar-text">
                                <NavLink className="bk-button" to="/login">SIGN IN </NavLink>
                                You are not logged in
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <header className="w3l-header-nav">
            <nav className="navbar navbar-expand-lg navbar-light px-lg-0 py-0 px-3 stroke">
                <div className="container">
                    <NavLink className="navbar-brand" to="/"><span>Utibu</span>Health</NavLink>
                    <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="fa icon-expand fa-bars"></span>
                        <span className="fa icon-close fa-times"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-lg-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" exact>Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/orders">Orders</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/medications">Medications</NavLink>
                            </li>
                            {/*<li className="nav-item">
                                <NavLink className="nav-link" to="/contact">Contact</NavLink>
                            </li>*/}

                            <li class="nav-item">
                                <NavLink className="nav-link" to="/contact">Contact</NavLink>
                            </li>
                        </ul>
                        {/* search-right */}
                        <div className="search-right">
                            <NavLink title="search"><span className="fa fa-phone" aria-hidden="true"></span></NavLink>
                        </div>
                        <div className="call-support">
                            <p>Call us for any question</p>
                            <h5>0757-090-042</h5>
                        </div>
                    </div>
                </div>
            </nav>
            {/* //nav */}
        </header>
        <Outlet/>
        </>
    );
}

export default Header;