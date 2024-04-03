import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import OrderSteps from './user/OrderSteps.js';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MedicationsTable from './MedicationsTable.js';
import OrderForm from './user/OrderForm.js';

const Medications = () => {
    return (
        <div className="row" style={{margin:'10px'}}>
            <Helmet>
                <title>Utibu-Health | Medications</title>
            </Helmet>
            <div className="row fire-reports-wrapper">
                <MedicationsTable/>
                <OrderForm/>
            </div>
            <div className="row fire-reports-wrapper">
                <OrderSteps/>
            </div>
        </div>
    );
}

export default Medications;
