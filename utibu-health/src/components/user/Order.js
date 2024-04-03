import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import OrderSteps from './OrderSteps.js';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OrdersTable from './OrdersTable.js';
import OrderForm from './OrderForm.js';

const Order = () => {
    return (
        <div className="row" style={{margin:'10px'}}>
            <Helmet>
                <title>Utibu-Health | Orders</title>
            </Helmet>
            <div className="row fire-reports-wrapper">
                <OrdersTable/>
            </div>
            <div className="row fire-reports-wrapper">
                <OrderForm/>
                <div className="col-xl-8">
                <OrderSteps/>   
                </div> 
            </div>
        </div>
    );
}

export default Order;
