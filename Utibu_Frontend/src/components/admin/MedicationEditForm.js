import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import axios from 'axios';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { Helmet } from 'react-helmet';

const MedicationEdit = () => {
  const { medicationId } = useParams();
  const [medication, setMedication] = useState({
    name: '',
    quantity: '',
    price: '',
  });

  const [roleError, setRoleError] = useState('');
  const [nameError, setNameError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [dataLoadError, setDataLoadError] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  useEffect(() => {
      setShowProgressBar(true);

      const authToken = localStorage.getItem("access_token");

      axios
        .get(`https://utibu-backend-5c25d99347b7.herokuapp.com/api/medications/${medicationId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
        )
        .then((response) => {
          if (response.status === 200) {
            setMedication(response.data);
          }
        })
        .catch((error) => {
          setDataLoadError(true);
          setMessage('An error occurred while fetching medication data.');
        })
        .finally(() => {
          setShowProgressBar(false);
        });
    }, [medicationId]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMedication(prevMedication => ({
      ...prevMedication,
      [name]: value
    }));
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

    await submitMedication(medication);
    setShowSuccessMessage(true);
  };


  const submitMedication = async (data) => {
    try {
      const authToken = localStorage.getItem("access_token");
      
      const response = await axios.put(`https://utibu-backend-5c25d99347b7.herokuapp.com/api/medications/${medicationId}`, medication,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
        );

      if (response.status === 200) {
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
    if (!medication.name.trim()) {
      setNameError('Please enter the name');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate Phone Number field
    if (!medication.quantity.trim()) {
      setQuantityError('Please enter the quantity');
      isValid = false;
    } else {
      setQuantityError('');
    }

    if (!medication.price.trim()) {
      setPriceError('Please enter the price');
      isValid = false;
    } else {
      setPriceError('');
    }

    return isValid;
  };

  return (
    <div className="main-content user-main-container">
      <Helmet>
        <title>Utibu-Health | Edit Medication {medicationId}</title>
      </Helmet>
      <SimpleBar className="page-content page-container-scroll">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6 send-fire-report-form">
              <div className="card card-h-100">
                <div className="card-header justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Edit Medication</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>                

                    {dataLoadError ? (
                      <div className="text-danger">
                        {message}
                      </div>
                    ) : (
                    <>
                      <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <TextField
                            required
                            className="form-control"
                            label="Medication Name"
                            helperText={nameError}
                            id="formrow-name-input"
                            name="name"
                            value={medication.name}
                            onChange={handleInputChange}
                            error={!!nameError}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <TextField
                            required
                            className="form-control"
                            label="Quantity (g, mg, ml)"
                            helperText={quantityError}
                            id="formrow-quantity-input"
                            name="quantity"
                            value={medication.quantity}
                            onChange={handleInputChange}
                            error={!!quantityError}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row"
                    style={{marginTop:'40px'}}>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <TextField
                            required
                            className="form-control"
                            label="Price (in Ksh./{ml, mg, g})"
                            helperText={priceError}
                            id="formrow-price-input"
                            name="price"
                            value={medication.price}
                            onChange={handleInputChange}
                            error={!!priceError}
                          />
                        </div>
                      </div>
                    </div>
                    {showProgressBar && (
                      <>
                        <div className="progress-circle-container">
                          <Stack sx={{ color: 'grey.500' }} direction="row">
                            <CircularProgress color="primary" />
                          </Stack>
                        </div>
                      </>
                    )}
                    {(submissionError || showSuccessMessage) && !showProgressBar && (
                      <div className={submissionError ? 'text-danger' : 'text-success'}>
                          {message}
                        </div>
                    )}

                    <div className="mt-4">
                      <button type="submit" className="btn btn-primary w-md">
                        Submit
                      </button>
                    </div>
                    </>
                    )
                  }                  
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SimpleBar>
    </div>
  );
};

export default MedicationEdit;

{/*export const CustomDropDown = ({ options, onRoleChange, roleError, user }) => {
  const [selectedOption, setSelectedOption] = React.useState('Role');

  useEffect(() => {
    // Set the initial selectedOption based on the user's role
    if (user && user.role) {
      const selectedOptionData = options.find((option) => option.value === user.role);
      const selectedOptionDisplay = selectedOptionData ? selectedOptionData.display : '';
      setSelectedOption(selectedOptionDisplay);
    }
  }, [user]);

  const handleChange = (event) => {
    const newCategory = event.target.value;

    const selectedValue = options.find((option) => option.display.toLowerCase() === newCategory.toLowerCase())?.value;

    setSelectedOption(newCategory);
    onRoleChange(selectedValue);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
      <InputLabel id="demo-select-small-label">Select Role</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={selectedOption}
        label="Select Category"
        onChange={handleChange}
        error={roleError ? true : false}
      >
        {options.map((option) => (
          <MenuItem key={option.display} value={option.display}>
            {option.display}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};*/}