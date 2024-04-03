import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Stack from '@mui/material/Stack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {NavLink, Outlet} from 'react-router-dom';
import Header from './Header.js';

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

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [nameError, setNameError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [submissionError, setSubmissionError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [containsUpperCase, setContainsUpperCase] = useState(false);
  const [containsLowerCase, setContainsLowerCase] = useState(false);
  const [containsNumber, setContainsNumber] = useState(false);
  const [containsSpecialChar, setContainsSpecialChar] = useState(false);
  const [isMinLength, setIsMinLength] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;

    setContainsUpperCase(/[A-Z]/.test(password));
    setContainsLowerCase(/[a-z]/.test(password));
    setContainsNumber(/\d/.test(password));
    setContainsSpecialChar(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password));
    setIsMinLength(password.length >= 8);

    setFormData((prevFormData) => ({
      ...prevFormData,
      password: password,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form data before submission
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setShowProgressBar(true);
    setShowSuccessMessage(false);
    setSubmissionError(false);

    await submitFormData(formData);

    // Show the success message when the submission is successful
    setShowSuccessMessage(true);
  };

  const submitFormData = async (data) => {
    try {
      const response = await axios.post('https://utibu-backend-5c25d99347b7.herokuapp.com/api/register', formData
        );

      if (response.status === 200) {
        setShowProgressBar(false);
        setShowSuccessMessage(true);
        setMessage(response.data.message);  
      }
    } catch (error) {
      handleRequestError(error);
    } finally {
      setShowProgressBar(false);
    }
  };


  const handleRequestError = (error) => {
    setSubmissionError(true);
    let message = 'An error occurred while processing your request';
    if (error.response) {
      message = `Error ${error.response.status} : ${error.response.data.message}`;
    } else if (error.request) {
      message = 'Server is unreachable. Try again later';
    }
    setMessage(message);
  };

  const validateForm = () => {
    let isValid = true;

    // Validate Name field
    if (!formData.name.trim()) {
      setNameError('Please enter your name.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate Phone Number field
    if (!formData.phone.trim()) {
      setPhoneNumberError('Please enter your phone number.');
      isValid = false;
    } else if (!/^0|254\d{9}$/.test(formData.phone)) {
      setPhoneNumberError('Invalid phone number. Please enter a valid Kenyan phone number starting with 0 or 254.');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    
    if (!formData.email.trim()) {
      setEmailError('Please enter your Email Address');
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      setEmailError('Email Address format is incorrect');
      isValid = false;
    } else {
      setEmailError('');
    }

    /*if (formData.role.toLowerCase() === 'role') {
      setRoleError('Please select a role');
      isValid = false;
    } else {
      setRoleError('');
    }*/

    // Validate Password field
    if (!formData.password) {
      setPasswordError('Please enter a password.');
      isValid = false;
    } else if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else if (formData.password.includes(formData.name) || formData.password.includes(formData.email)) {
      setPasswordError('Password contains name or email parts.');
      isValid = false;
    } else if (!isValidPassword(formData.password)) {
      setPasswordError('Invalid password format.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialCharacter;
  };

  return (
    <div className="main-content user-main-container" 
    style={{ marginLeft: '0px' }}
    >
      <Helmet>
        <title>Utibu-Health | Register</title>
      </Helmet>
      <div id="layout-wrapper">
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6 send-fire-report-form"
            >
              <div className="card card-h-100"
              >
              <div className="card-header justify-content-between d-flex align-items-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <h4 className="card-title">Register</h4>
              </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <TextField
                            required
                            id="formrow-firstname-input"
                            className="form-control"
                            label="Name"
                            helperText={nameError}
                            value={formData.name}
                            onChange={handleInputChange}
                            name="name"
                            error={nameError ? true : false}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <TextField
                            required
                            className="form-control"
                            label="Email Address"
                            helperText={emailError}
                            id="formrow-email-input"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={emailError ? true : false}
                          />
                        </div>
                      </div>                      
                    </div>

                    <div className="row" style={{marginTop: '20px'}}>
                      <div className="col-md-6">
                          <div className="mb-3">
                            <TextField
                              required
                              className="form-control"
                              label="Phone Number"
                              helperText={phoneNumberError}
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              error={phoneNumberError ? true : false}
                            />
                          </div>
                        </div>


                      <div className="col-md-6">
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
                              error={passwordError ? true : false}
                              value={formData.password}
                              onChange={handlePasswordChange}
                            />
                          </FormControl>
                        </div>
                      </div>                     
                    </div>

                    <div className="row"
                    style={{ display: 'flex', justifyContent: 'center' }}
                    >

                      <div className="col-md-6">
                        <div className="mb-3">
                        For Password
                          <ul>
                            <li className={containsUpperCase ? 'text-success' : ''}>An upper case letter: A-Z</li>
                            <li className={containsLowerCase ? 'text-success' : ''}>A lower case letter: a-z</li>
                            <li className={containsNumber ? 'text-success' : ''}>A number: 0-9</li>
                            <li className={containsSpecialChar ? "text-success" : ""}>A special character: !@#$%^&amp;*()_+{}[]:;&lt;>,.?~\\/-</li>
                            <li className={isMinLength ? 'text-success' : ''}>At least 8 characters</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Display the progress circle */}
                    {showProgressBar && (
                      <>
                        <div className="progress-circle-container">
                          <Stack sx={{ color: 'grey.500' }} direction="row">
                            <CircularProgress color="primary" />
                          </Stack>
                        </div>
                      </>
                    )}

                    {/* Display the success message */}
                    {showSuccessMessage && (
                      <div className={`form-submission-message ${submissionError ? 'text-danger' : 'text-success'}`}>
                        {message}
                      </div>
                    )}
                    <div className="mt-4">
                      {/*
                      <button type="submit" className="btn btn-primary w-md">
                        Submit
                      </button>
                      */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="btn btn-primary w-md"
                      >
                        Sign Up
                      </Button>

                      <Grid container justifyContent="center">
                        <Grid item>
                          <NavLink to="/login" variant="body2">
                            Already have an account? Sign in
                          </NavLink>
                        </Grid>
                      </Grid>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <Copyright sx={{ mt: 5 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;