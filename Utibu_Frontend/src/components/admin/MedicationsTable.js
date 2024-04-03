import { useNavigate} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import {CustomDropDown} from '../CustomCategorySelection.js';
import {CustomizedInputBase} from '../CustomSearch.js';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';

const columns = [
  { id: 'id', label: 'Medication ID', minWidth: 170, align: 'center' },
  { id: 'name', label: 'Medication Name', minWidth: 100, align: 'center' },
  { id: 'price', label: 'Price (Ksh)', minWidth: 170, align: 'center' },
  { id: 'quantity', label: 'Quantity', minWidth: 170, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MedicationsTable = () => {

  const isMounted = useRef(false);
  const [medications, setMedications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moreMedicationsToLoad, setMoreMedicationsToLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);
  const [searchString, setSearchString] = useState('');
  const reportsPerPage = 10;
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [message, setMessage] = useState('');   

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleEditClick = (medicationId) => {
      navigate(`edit-medication/${medicationId}`);
    };


    const fetchDataOnMount = async () => {
      try {
        if (currentPage){
        setIsLoading(true);
        setDataFetchError(false);
        const authToken = localStorage.getItem("access_token");        
        const response = await axios.get(
          `http://localhost:5000/api/medications?searchstring=${searchString}&page=${currentPage}`,
          {
            headers: {Authorization: `Bearer ${authToken}`,},
          }
        );

        if (response.status === 200) {
          const newMedications = response.data;

          if (newMedications.length >= reportsPerPage) {
            setMedications((prevMedications) => [...prevMedications, ...newMedications]);
            } else if (newMedications.length < reportsPerPage) {
              setMedications((prevMedications) => [...prevMedications, ...newMedications]);                  
              setMoreMedicationsToLoad(false);
            }
        }
        }        
      } catch (error) {
        handleFetchRequestError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMedications = async (page) => {
      try {
        setIsLoading(true);
        setDataFetchError(false);
        const authToken = localStorage.getItem("access_token");        
        const response = await axios.get(
          `http://localhost:5000/api/medications?searchstring=${searchString}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${authToken}`,},
          }
        );

        if (response.status === 200) {
              const newMedications = response.data;

              if (newMedications.length >= reportsPerPage) {
                  setMedications((prevMedications) => [...prevMedications, ...newMedications]);
                } else if (newMedications.length < reportsPerPage) {
                  setMedications((prevMedications) => [...prevMedications, ...newMedications]);                  
                  setMoreMedicationsToLoad(false);
                }
        }        
      } catch (error) {
        handleFetchRequestError(error);
      } finally {
        setIsLoading(false);
      }
    };



    const handleFetchRequestError = (error) => {
      setDataFetchError(true);
      let message = 'An error occurred while processing your request';
      if (error.response) {
        message = `Error ${error.response.status} : ${error.response.data.message}`;
      } else if (error.request) {
        message = 'Server is unreachable. Try again later';
      }
      setMessage(message);
    };


  useEffect(() => {
    setMedications([]);
    setCurrentPage(1);
    setMoreMedicationsToLoad(true);
  }, [searchString]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    fetchMedications(currentPage);  
  }, [searchString, currentPage]);

    const deleteMedication = (medication) => {
      setMedicationToDelete(medication);
      setShowPopup(true);     
    };

    const cancelDelete = () => {
      setMedicationToDelete(null);
      setShowPopup(false);
    };

    const confirmDelete = async () => {
      setIsDeleting(true);
      await handleDelete(medicationToDelete);
    };

    const customActionsTheme = createTheme({
      palette: {
        delete: {
          main: '#ff6384',
        },
        edit: {
          main: '#038edc',
          light: '#F5EBFF',
          contrastText: '#47008F',
        },
      },
    });


    const handleDelete = async (medicationToDelete) => {
      try {
        const authToken = localStorage.getItem("access_token");
        const response = await axios.delete(`http://localhost:5000/api/medications/${medicationToDelete.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          setSnackBarSeverity('success');
          setSnackBarMessage(response.data.message);
          setMedications(prevMedications => prevMedications.filter(medication => 
          medication.id !== medicationToDelete.id));
        }
      } catch (error) {
        handleRequestError(error);
      } finally {
        setIsDeleting(false);
        setShowPopup(false);
        setShowSnackBar(true);
      }
    };


    const handleRequestError = (error) => {
      let message = 'An error occurred while processing your request.';

      if (error.response) {
        const { status, data } = error.response;
        message = `Error ${status} : ${data.message}`;
      } else if (error.request) {
        message = 'Server is unreachable. Try again later';
      }

      setSnackBarSeverity('error');
      setSnackBarMessage(message);
    };


    const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setShowSnackBar(false);
    };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  }

return(
      <div className="col-xl-12">
        <div className="card card-h-100">
          <div className="card-body">
            <div className="row users-table-top">
              <div className="col-xl-4">
                <h4 className="card-title mb-4">Medications</h4>
              </div>   

                <div className="col-xl-4 user-search-container">
                  <CustomizedInputBase 
                    searchString={searchString}
                    setSearchString={setSearchString}
                    placeholder="Search Medications"
                  />
                </div>
              </div>

                <SimpleBar className="table-responsive fire-reports-container">
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medications.map((row, index) => (
                          <TableRow key={row.id} hover role="checkbox" tabIndex={-1} key={index}>
                            {columns.map((column) => (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === 'actions' ? 
                                (<Stack direction="row" spacing={2} className="action-btns-holder">

                                <ThemeProvider theme={customActionsTheme}>                                  
                                    <IconButton aria-label="edit" size="small" onClick={() => handleEditClick(row.id)} color="edit">
                                      <EditIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton aria-label="delete" size="small" onClick={() => deleteMedication(row)} color="delete">
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </ThemeProvider>

                                  </Stack>) : 
                                  row[column.id] || 'error'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </SimpleBar>

                {showSnackBar && (
                  <Snackbar open={showSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                    <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity} sx={{ width: '100%' }}>
                      {snackBarMessage}
                    </Alert>
                  </Snackbar>
                )}

                {/* Show the confirmation popup */}
                {showPopup && (
                <Dialog
                  fullScreen={fullScreen}
                  open={showPopup}
                  onClose={cancelDelete}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {`Delete Medication`}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete {medicationToDelete.name}?
                    </DialogContentText>
                  </DialogContent>
                  {isDeleting && (
                    <div className="progress-circle-container">
                      <Stack sx={{ color: 'grey.500' }} direction="row">
                        <CircularProgress color="primary" />
                      </Stack>
                    </div>
                  )}
                  <DialogActions>
                    <Button autoFocus onClick={cancelDelete}>
                      Cancel
                    </Button>
                    <Button onClick={confirmDelete} autoFocus>
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
                )}

                {isLoading && (
                <div className="progress-circle-container">
                  <Stack sx={{ color: 'grey.500' }} direction="row">
                    <CircularProgress color="primary" />
                  </Stack>
                </div>
              )}

                {!dataFetchError && moreMedicationsToLoad ? (
                    <div className="mt-4 load-more-container">
                      <button
                        type="submit"
                        className="btn btn-primary w-md"
                        onClick={handleLoadMore}
                      >
                        Load more
                      </button>
                    </div>
                  ) : (
                    !dataFetchError && !moreMedicationsToLoad ? (
                      <div className="text-center text-primary">
                        No more records
                      </div>
                    ) : null // You can provide a fallback or return null if neither condition is met
                  )}

                  {dataFetchError && (
                    <div className="text-center text-danger">
                      {message}
                    </div>
                  )}                      
            </div>
          </div>
        </div>
    );
}

export default MedicationsTable;