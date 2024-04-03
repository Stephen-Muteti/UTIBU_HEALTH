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
import { useAuth } from './auth.js';
import Grid from '@mui/material/Grid';
import {NavLink, Outlet} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Header from './Header.js';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={0} ref={ref} variant="filled" {...props} />;
});


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <NavLink color="inherit" to="/">
        Utibu Health
      </NavLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [submissionError, setSubmissionError] = useState(false);

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
    
  const auth = useAuth();
  
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

	  const handleMouseDownPassword = (event) => {
	    event.preventDefault();
	  };

	  const handleInputChange = (event) => {
	    const { name, value } = event.target;
	    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	  };


    const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowSnackBar(false);
    };

	const handleSubmit = async (event) => {
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
        resetUI();
		    const response = await axios.post('https://utibu-backend-5c25d99347b7.herokuapp.com/api/login', formData);

		    if (response.data.token) {
          setSnackBarMessage('Login Successful');
          setSnackBarSeverity('success');
          setShowSnackBar(true);
          localStorage.setItem('access_token', response.data.token);
		      const user = response.data.user;

          console.log(user);

          auth.login(user);
		      localStorage.setItem('user', JSON.stringify(user));
		      localStorage.setItem('access_token', response.data.token);

		      /*if (user.role === 'admin' || user.role === 'staff') {
		        navigate('/admin', { replace: true });
		      } else if (user.role === 'user') {
		        navigate('/', { replace: true });
		      }*/

          /*setSnackBarMessage('Login Successful');
          setSnackBarSeverity('success');
          setShowSnackBar(true);*/
		    }
		  } catch (error) {
		    handleRequestError(error);
		  } finally {
		    setShowProgressBar(false);
		  }
		};

    const resetUI = () =>{
      setMessage('');
      setEmailError('');
      setPasswordError('');
      setShowSuccessMessage(false);
      setSubmissionError(false);
      setShowSuccessMessage(false);
    }


  	const handleRequestError = (error) => {
      if (error.response) {
        setSubmissionError(true);
        setMessage(`Error ${error.response.status} : ${error.response.data.message}`);
      } else if (error.request) {
        setSubmissionError(true);
        setMessage('Server is unreachable. Try again later');
      } else {
        setSubmissionError(true);
        setMessage('An error occurred while processing your request.');
      }
    };


	  const validateForm = () => {
	    let isValid = true;

	    
	    if (!formData.email.trim()) {
	      setEmailError('Please enter your Email Address');
	      isValid = false;
	    } else {
	      setEmailError('');
	    }

	    /*Validate Password field*/
	    if (!formData.password) {
	      setPasswordError('Please enter a password.');
	      isValid = false;
	    } else {
	      setPasswordError('');
	    }

	    return isValid;
	  };
	return (
    <div className="main-content user-main-container" 
    style={{ marginLeft: '0px' }}
    >
      <Helmet>
        <title>Utibu-Health | Login</title>
      </Helmet>      
      <div id="layout-wrapper">
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-3 send-fire-report-form">
              <div className="card card-h-100">
                <div className="card-header justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Login</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <TextField
                          required
                          className="form-control"
                          label="Your Email Address"
                          helperText={emailError}
                          id="formrow-email-input"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={!!emailError}
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-3 add-user-password-container">
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                            required
                            className="form-control"
                            name="password"
                            error={!!passwordError}
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </div>
                    </div>

                    {/* Display the progress circle */}
                    {showProgressBar && (
                      <div className="progress-circle-container" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack sx={{ color: 'grey.500' }} direction="row">
                          <CircularProgress color="primary" />
                        </Stack>
                      </div>
                    )}

                    {/* Display the success message */}
                    {showSuccessMessage && (
                      <div className={`form-submission-message ${submissionError ? 'text-danger' : 'text-success'}`}
                      style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        {message}
                      </div>
                    )}

                    <div className="mt-4 add-brigade-sub-btn"
                     style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <button type="submit" className="btn btn-primary w-md">
                        Submit
                      </button>
                    </div>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                          <NavLink to="/register" variant="body2">
                            Don't have an account? Register
                          </NavLink>
                        </Grid>
                      </Grid>
                  </form>
                </div>
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
            <Copyright sx={{ mt: 5 }} />
          </div>
        </div>
    </div>
    </div>
  );
}

export default Login;