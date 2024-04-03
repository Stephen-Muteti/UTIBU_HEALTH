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
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import {CustomizedInputBase} from '../CustomSearch.js';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

const columns = [
  { id: 'id', label: 'Payment ID', minWidth: 170, align: 'center' },
  { id: 'order_id', label: 'Order ID', minWidth: 100, align: 'center' },
  { id: 'amount', label: 'Amount (Ksh)', minWidth: 170, align: 'center' },
  { id: 'payment_date', label: 'Payment Date', minWidth: 170, align: 'center' },
];

const PaymentsTable = () => {

  const isMounted = useRef(false);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [morePaymentsToLoad, setMorePaymentsToLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);
  const [searchString, setSearchString] = useState('');
  const reportsPerPage = 10;
  const [message, setMessage] = useState('');   

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    const fetchDataOnMount = async () => {
      try {
        if (currentPage){
        setIsLoading(true);
        setDataFetchError(false);
        const authToken = localStorage.getItem("access_token");        
        const response = await axios.get(
          `http://localhost:5000/api/payments?searchstring=${searchString}&page=${currentPage}`,
          {
            headers: {Authorization: `Bearer ${authToken}`,},
          }
        );

        if (response.status === 200) {
          const newPayments = response.data;

          if (newPayments.length >= reportsPerPage) {
            setPayments((prevPayments) => [...prevPayments, ...newPayments]);
            } else if (newPayments.length < reportsPerPage) {
              setPayments((prevPayments) => [...prevPayments, ...newPayments]);                  
              setMorePaymentsToLoad(false);
            }
        }
        }        
      } catch (error) {
        handleFetchRequestError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPayments = async (page) => {
      try {
        setIsLoading(true);
        setDataFetchError(false);
        const authToken = localStorage.getItem("access_token");        
        const response = await axios.get(
          `http://localhost:5000/api/payments?searchstring=${searchString}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${authToken}`,},
          }
        );

        if (response.status === 200) {
          const newPayments = response.data;

          if (newPayments.length >= reportsPerPage) {
            setPayments((prevPayments) => [...prevPayments, ...newPayments]);
          } else if (newPayments.length < reportsPerPage) {
            setPayments((prevPayments) => [...prevPayments, ...newPayments]);                  
            setMorePaymentsToLoad(false);
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
    setPayments([]);
    setCurrentPage(1);
    setMorePaymentsToLoad(true);
  }, [searchString]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    fetchPayments(currentPage);  
  }, [searchString, currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  }

return(
      <div className="col-xl-8">
        <div className="card card-h-100">
          <div className="card-body">
            <div className="row users-table-top">
              <div className="col-xl-4">
                <h4 className="card-title mb-4">Payments</h4>
              </div>   

                <div className="col-xl-4 user-search-container">
                  <CustomizedInputBase 
                    searchString={searchString}
                    setSearchString={setSearchString}
                    placeholder="Search By Order ID"
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
                        {payments.map((row, index) => (
                          <TableRow key={row.id} hover role="checkbox" tabIndex={-1} key={index}>
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

                {!dataFetchError && morePaymentsToLoad ? (
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
                    !dataFetchError && !morePaymentsToLoad ? (
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

export default PaymentsTable;