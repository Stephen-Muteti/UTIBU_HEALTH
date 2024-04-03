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
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import {CustomDropDown} from './CustomCategorySelection.js';
import {CustomizedInputBase} from './CustomSearch.js';
import Stack from '@mui/material/Stack';

const columns = [
  { id: 'id', label: 'Medication ID', minWidth: 170, align: 'center' },
  { id: 'name', label: 'Medication Name', minWidth: 170, align: 'center' },
  { id: 'price', label: 'Price (Ksh)', minWidth: 170, align: 'center' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MedicationsTable = () => {
  const isMounted = useRef(false);

  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);
  const reportsPerPage = 10;
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [moreMedicationsToLoad, setMoreMedicationsToLoad] = useState(true);
  const [searchString, setSearchString] = useState('');

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      setDataFetchError(false);
      const authToken = localStorage.getItem("access_token");        
      const response = await axios.get(
        `https://utibu-backend-5c25d99347b7.herokuapp.com/api/medications`,
        {
          params: {
            searchstring: searchString,
            page: currentPage,
            limit: reportsPerPage
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const newMedications = response.data;
        setMedications((prevMedications) => [...prevMedications, ...newMedications]);
        if (newMedications.length < reportsPerPage) {
          setMoreMedicationsToLoad(false);
        }
      }
    } catch (error) {
      handleFetchRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataOnMount = async () => {
    try {
      setIsLoading(true);
      setDataFetchError(false);
      const authToken = localStorage.getItem("access_token");        
      const response = await axios.get(
        `https://utibu-backend-5c25d99347b7.herokuapp.com/medication/medications`,
        {
          params: {
            searchstring: searchString,
            page: currentPage,
            limit: reportsPerPage
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const newMedications = response.data;
        setMedications((prevMedications) => [...prevMedications, ...newMedications]);
        if (newMedications.length < reportsPerPage) {
          setMoreMedicationsToLoad(false);
        }
      }
    } catch (error) {
      handleFetchRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMedications([]);
    setCurrentPage(1);
    setMoreMedicationsToLoad(true);
  }, [searchString, currentPage]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    fetchMedications(currentPage);  
  }, [searchString, currentPage]);

  const handleFetchRequestError = (error) => {
    setDataFetchError(true);
    let message = 'An error occurred while processing your request';
    if (error.response) {
      message = `Error ${error.response.status} : ${error.response.data.error}`;
    } else if (error.request) {
      message = 'Server is unreachable. Try again later';
    }
    setMessage(message);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  return (
      <div className="col-xl-8">
        <div className="card card-h-100">
          <div className="card-body">
            {/* Your search and filter UI */}
            <div className="row users-table-top">
              <div className="col-xl-4">
                <h4 className="card-title mb-4">Available Medications</h4>
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
                      <TableRow key={row.id}>
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align}>
                            {row[column.id] || 'error'}
                              </TableCell>
                            ))}
                          </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </SimpleBar>

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
                ) : null
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
