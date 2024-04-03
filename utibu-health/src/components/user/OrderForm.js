import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import SimpleBar from 'simplebar-react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {NavLink, Outlet} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={0} ref={ref} variant="filled" {...props} />;
});


const OrderForm = () => {
  const [formData, setFormData] = useState({ quantity: '', medication_id: '' });
  const [quantityError, setQuantityError] = useState('');
  const [idError, setIdError] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [submissionError, setSubmissionError] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
	  
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

	const handleSubmit = async (event) => {
    setMessage('');
    event.preventDefault();

    
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setShowProgressBar(true);
    setShowSuccessMessage(false);
    setSubmissionError(false);

    await submitFormData(formData);
    setShowSuccessMessage(true);
  };

	  const submitFormData = async (data) => {
		  try {
        const authToken = localStorage.getItem("access_token");  
        if(!authToken){
          setSnackBarMessage("You are not logged in");
          setSnackBarSeverity('error');
          return;
        }      
		    const response = await axios.post(
          'http://localhost:5000/api/orders',
          formData,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setSnackBarMessage(response.data.message);
        setSnackBarSeverity('success');


        const orderDetails = response.data.orderDetails;
        console.log(orderDetails);
        navigate('/checkout', { state: { orderDetails: orderDetails } });

		  } catch (error) {
		    handleRequestError(error);
		  } finally {
		    setShowProgressBar(false);
        setShowSnackBar(true);
		  }
		};


  	const handleRequestError = (error) => {
      if (error.response) {
        setSnackBarMessage(`Error ${error.response.status} : ${error.response.data.message}`);
      } else if (error.request) {
        setSnackBarMessage('Server is unreachable. Try again later');
      } else {
        setSnackBarMessage('An error occurred while processing your request.');
      }
      setSnackBarSeverity('error');
    };


	  const validateForm = () => {
	    let isValid = true;

	    
	    if (!formData.quantity.trim()) {
	      setQuantityError('Please enter Quantity');
	      isValid = false;
	    } 
      else {
	      setQuantityError('');
	    }

	    /*Validate Name field*/
	    if (!formData.medication_id) {
	      setIdError('Please enter a medication ID');
	      isValid = false;
	    } else {
	      setIdError('');
	    }

	    return isValid;
	  };

    const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowSnackBar(false);
    };

	return (
  <>
    <div className="col-xl-4">
            <div className="col-xl-12 send-fire-report-form">
              <div className="card card-h-100">
                <div className="card-header justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Make an Order</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <TextField
                          required
                          className="form-control"
                          label="Medication ID"
                          helperText={idError}
                          id="formrow-name-input"
                          name="medication_id"
                          value={formData.medication_id}
                          onChange={handleInputChange}
                          error={!!idError}
                        />
                      </div>
                    </div>

                    <div className="col-md-12"
                    style={{marginTop: '40px'}}
                    >
                      <div className="mb-3">
                        <TextField
                          required
                          className="form-control"
                          label="Quantity (ml, mg, g)"
                          helperText={quantityError}
                          id="formrow-quantity-input"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          error={!!quantityError}
                        />
                      </div>
                    </div>

                    {/* Display the progress circle */}
                    {showProgressBar && (
                      <div className="progress-circle-container" 
                      style={{ display: 'flex', justifyContent: 'center', marginTop:'40px' }}
                      >
                        <Stack sx={{ color: 'grey.500' }} direction="row">
                          <CircularProgress color="primary" />
                        </Stack>
                      </div>
                    )}

                    <div className="mt-4 add-brigade-sub-btn"
                     style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <button type="submit" className="btn btn-primary w-md"
                      style={{marginTop:'20px'}}
                      >
                        Submit
                      </button>

                    {showSnackBar && (
                      <Snackbar open={showSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}
                      style={{bottom:'0px', position: 'unset !important'}}>
                        <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity} sx={{ width: '100%' }}>
                          {snackBarMessage}
                        </Alert>
                      </Snackbar>
                    )}
                    </div>
                  </form>
                </div>                
              </div>
            </div>            
    </div>    
</>
  );
}

export default OrderForm;