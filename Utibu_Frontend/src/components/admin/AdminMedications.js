import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MedicationsTable from './MedicationsTable.js';
import MedicationsForm from './MedicationsForm.js';

const AdminMedications = () => {
    return (
        <div className="row" style={{margin:'10px'}}>
            <Helmet>
                <title>Utibu-Health | Admin-Medications</title>
            </Helmet>
            <div className="row fire-reports-wrapper">
                <MedicationsTable/>
            </div>
            <div className="row fire-reports-wrapper">
                <MedicationsForm/>            
            </div>
        </div>
    );
}

export default AdminMedications;
