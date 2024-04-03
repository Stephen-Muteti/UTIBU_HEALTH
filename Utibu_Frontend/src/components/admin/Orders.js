import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OrdersTable from './OrdersTable.js';
import PaymentsTable from './PaymentsTable.js';

const AdminOrders = () => {
    return (
        <div className="row" style={{margin:'10px', display:'flex', justifyContent:'center'}}>
            <Helmet>
                <title>Utibu-Health | Orders</title>
            </Helmet>
            <div className="row fire-reports-wrapper">
                <OrdersTable/>
            </div>
            <div className="row fire-reports-wrapper"
            style={{display:'flex', justifyContent:'center'}}>            
                <PaymentsTable/>
            </div>
        </div>
    );
}

export default AdminOrders;
