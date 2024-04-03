import { Helmet } from 'react-helmet';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={0} ref={ref} variant="filled" {...props} />;
});

function CheckOutForm() {
	const [showSnackBar, setShowSnackBar] = useState(false);
	const [snackBarSeverity, setSnackBarSeverity] = useState('');
	const [snackBarMessage, setSnackBarMessage] = useState('');
	const [showProgressBar, setShowProgressBar] = useState(false);
	const [phoneError, setPhoneError] = useState('');
	const [orderDetails, setOrderDetails] = useState(null);

	const location = useLocation();

	const handleInputChange = (event) => {
	    const { name, value } = event.target;
	    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	  };

	useEffect(() => {
	    if (location.state && location.state.orderDetails) {
	      setOrderDetails(location.state.orderDetails);
	    }
	  }, [location.state]);

	const [formData, setFormData] = useState({ phone:''});

	const handleSubmit = async (event) => {
	    event.preventDefault();

	    
	    const isValid = validateForm();

	    if (!isValid) {
	      return;
	    }

	    setShowProgressBar(true);

	    await submitFormData(formData);
	};


	const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowSnackBar(false);
    };


	const submitFormData = async (data) => {
	  try {
	  	const authToken = localStorage.getItem("access_token");  
        if(!authToken){
          setSnackBarMessage("You are not logged in");
          setSnackBarSeverity('error');
          return;
        }
	    const response = await axios.post('http://localhost:5000/api/payments', {
	        order_id: orderDetails.id,
	        amount: orderDetails.total_price,
	        phone: formData.phone
	      },
	      {
            headers: { Authorization: `Bearer ${authToken}` },
          }
	      );

	    setSnackBarMessage('Payment Successful');
			setSnackBarSeverity('success');
			setShowSnackBar(true);

	  } catch (error) {
	    handleRequestError(error);
	  } finally {
	    setShowProgressBar(false);
	    setShowSnackBar(true);
	  }
	};


	const handleRequestError = (error) => {
		setSnackBarSeverity('error');
      if (error.response) {
        setSnackBarMessage(`Error ${error.response.status} : ${error.response.data.message}`);
      } else if (error.request) {
        setSnackBarMessage('Server is unreachable. Try again later');
      } else {
        setSnackBarMessage('An error occurred while processing your request.');
      }
    };


    const validateForm = () => {
	    let isValid = true;

	    
	    if (!formData.phone.trim()) {
	      setPhoneError('Please enter your phone number.');
	      isValid = false;
	    } else if (!/^0|254\d{9}$/.test(formData.phone)) {
	      setPhoneError('Invalid phone number. Please enter a valid Kenyan phone number starting with 0 or 254.');
	      isValid = false;
	    } else {
	      setPhoneError('');
	    }

	    return isValid;
	  };


  return (

    <div className="main-content user-main-container" 
    style={{ marginLeft: '0px' }}
    >
      <Helmet>
        <title>Utibu-Health | CheckOut</title>
      </Helmet>      
		  <div id="layout-wrapper">
		    <div className="container-fluid">
		      <div className="row"
		      style={{justifyContent:'center'}}>
			    <div className="hotel-right  vlcone col-xl-4">
			      <div className="alert-close"> </div>
			      <div className="hotel-form">
		          

			        <h3 style={{color: '#FE346E'}}>Receipt Form</h3>
			        <p style={{display:'flex', alignContent:'center', fontSize:'16px', fontWeight:'550', fontFamily: 'Droid Serif, serif'}}>
			          If you wish to make the payment later then just close this page
			          We have already placed your order
		          </p>
			        <ul className="list_ins1">
			          <li>Order ID</li>
			          <li>Order Date</li>
			          <li>Your Name</li>
			          <li>Medication Name</li>
			          <li>Medication Quantity</li>
			          <li>Total Price</li>
			        </ul>
			        <ul className="list_ins2">
			          <li>: {orderDetails?.id}</li>
			          <li>: {orderDetails?.created_at}</li>
			          <li>: {orderDetails?.username}</li>
			          <li>: {orderDetails?.medication_name}</li>
			          <li>: {orderDetails?.quantity}</li>
			          <li>: Ksh. {orderDetails?.total_price}</li>
			        </ul>
			        <div className="clear"></div>
			      </div>
			      <div className="pay-form">
			        <form onSubmit={handleSubmit}>
			          <h3 style={{color: 'rgb(254, 52, 110)'}}>Payment Information</h3>
			          
			          <h5>Your Phone Number</h5>
			          <p style={{display:'flex',alignContent:'start',fontWeight:'normal'}}>You will receive an STK Push on your Phone</p>
			          <div className="col-md-12">
                      <div className="mb-3">
                        <TextField
                          required
                          className="form-control"
                          label="Your Phone Number"
                          helperText={phoneError}
                          id="formrow-phone-input"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          error={!!phoneError}
                          className="card_logo" type="text"
				          style={{color:'#000000 !important', width:'100%'}}
                        />
                      </div>
                    </div>
			          <div className="clear"></div>
			          <input type="submit" value="PAY SECURELY"/>
			        </form>
			        <p><span></span>Your information is encrypted.</p>

			        {/* Display the progress circle */}
                    {showProgressBar && (
                      <div className="progress-circle-container" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack sx={{ color: 'grey.500' }} direction="row">
                          <CircularProgress color="primary" />
                        </Stack>
                      </div>
                    )}


			        {showSnackBar && (
	                  <Snackbar open={showSnackBar} autoHideDuration={3600000} onClose={handleCloseSnackBar}
	                  style={{bottom:'0px', position: 'unset !important'}}>
	                    <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity} sx={{ width: '100%' }}>
	                      {snackBarMessage}
	                    </Alert>
	                  </Snackbar>
	                )}
			      </div>
			    </div>
		    </div>
	    </div>
	    </div>
    </div>
  );
}

export default CheckOutForm;