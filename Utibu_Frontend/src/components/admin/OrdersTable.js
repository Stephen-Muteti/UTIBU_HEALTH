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
import {CustomDropDown} from '../CustomCategorySelection.js';
import {CustomizedInputBase} from '../CustomSearch.js';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import { useNavigate} from 'react-router-dom';
import PositionedMenu from './CustomStatus.js';

const columns = [
  { id: 'id', label: 'Order ID', minWidth: 100, align: 'center' },
  { id: 'username', label: 'Client', minWidth: 170, align: 'center' },
  { id: 'medication_name', label: 'Medication Name', minWidth: 170, align: 'center' },
  { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'center' },
  { id: 'total_price', label: 'Total Price (Ksh)', minWidth: 170, align: 'center' },
  { id: 'created_at', label: 'Order Date', minWidth: 170, align: 'center' },
  { id: 'payment_status', label: 'Payment', minWidth: 100, align: 'center' },
  { id: 'status', label: 'Order Status', minWidth: 170, align: 'center' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={0} ref={ref} variant="filled" {...props} />;
});

const OrdersTable = () => {

  const isMounted = useRef(false);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const reportsPerPage = 10;
  const [showPopup, setShowPopup] = useState(false);  
  const [snackBarSeverity, setSnackBarSeverity] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [moreOrdersToLoad, setMoreOrdersToLoad] = useState(true);
  const [searchString, setSearchString] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);


  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const confirmCancel = async () => {
    setIsCancelling(true);
    await handleCancel(orderToDelete);
  };


  const handleRequestError = (error) => {
    let message = 'An error occurred while processing your request.';
    let severity = 'error';

    if (error.response) {
      const { status, data } = error.response;
      message = `Error ${status} : ${data.error}`;
    } else if (error.request) {
      message = 'Server is unreachable. Try again later';
    }

    setSnackBarSeverity(severity);
    setSnackBarMessage(message);
  };


  const handleCancel = async (orderToCancel) => {
    try {
        const authToken = localStorage.getItem("access_token");
        if(!authToken){
          setSnackBarSeverity('error');
          setSnackBarMessage('You are not logged in');
          return;
        }
        const response = await axios.put(`https://utibu-backend-5c25d99347b7.herokuapp.com/api/orders/${orderToCancel.id}/cancel`, {}, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
            setSnackBarSeverity('success');
            setSnackBarMessage(response.data.message);

            const updatedOrders = orders.map(order => {
                if (order.id === orderToCancel.id) {
                    return { ...order, status: 'cancelled' };
                }
                return order;
            });
            setOrders(updatedOrders);
        } else {
            setSnackBarSeverity('error');
            setSnackBarMessage(response.data.message);
        }
    } catch (error) {
        handleRequestError(error);
    } finally {
        setIsCancelling(false);
        setShowPopup(false);
        setShowSnackBar(true);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setDataFetchError(false);
      const authToken = localStorage.getItem("access_token");
      if(!authToken){
        setMessage("Log in first");
        setDataFetchError(true);
        return;
      }
      const response = await axios.get(
        `https://utibu-backend-5c25d99347b7.herokuapp.com/order/orders?page=${currentPage}&limit=${reportsPerPage}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        const newOrders = response.data;
        setOrders(newOrders);
      }
    } catch (error) {
      handleFetchRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchOrders = async (page) => {
    try {
      setIsLoading(true);
      setDataFetchError(false);
      const authToken = localStorage.getItem("access_token");
      if(!authToken){
        setMessage("Log in first");
        setDataFetchError(true);
        return;
      }
      const response = await axios.get(
        `https://utibu-backend-5c25d99347b7.herokuapp.com/api/orders?page=${page}&limit=${reportsPerPage}&category=${selectedCategory}&searchstring=${searchString}&status=${selectedStatus}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        const newOrders = response.data;
        if (newOrders.length >= reportsPerPage) {
          setOrders((prevOrders) => [...prevOrders, ...newOrders]);
        } else if (newOrders.length < reportsPerPage) {
          setOrders((prevOrders) => [...prevOrders, ...newOrders]);
          setMoreOrdersToLoad(false);
        }
      }
    } catch (error) {
      handleFetchRequestError(error);
    } finally {
      setIsLoading(false);
    }
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



  const handleStatusChange = (id, newStatus) => {
    const updatedData = orders.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setOrders(updatedData);
  };


  useEffect(() => {
    setOrders([]);
    setCurrentPage(1);
    setMoreOrdersToLoad(true);
  }, [selectedCategory, selectedStatus, searchString]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    fetchOrders(currentPage);  
  }, [searchString, selectedCategory, selectedStatus, currentPage]);  


  const order_categories = [
    { display: 'All', value: 'all' },
    { display: 'Today', value: 'today' },
    { display: 'This Week', value: 'week' },
  ];

  const status_categories = [
    { display: 'All', value: 'all' },
    { display: 'Pending', value: 'pending' },
    { display: 'Confirmed', value: 'confirmed' },
    { display: 'Rejected', value: 'rejected' },
    { display: 'Cancelled', value: 'cancelled' },
    { display: 'Shipped', value: 'shipped' },
    { display: 'Delivered', value: 'delivered' },
  ];

  const handleCategoryChange = (selectedValue) => {
    setSelectedCategory(selectedValue);    
  };

  const handleStatusCategoryChange = (selectedValue) => {
    setSelectedStatus(selectedValue);    
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

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackBar(false);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  return (
      <div className="col-xl-12">
        <div className="card card-h-100">
          <div className="card-body">
            {/* Your search and filter UI */}
            <div className="row users-table-top">
              <div className="col-xl-2">
                <h4 className="card-title mb-4">Your Orders</h4>
              </div>             

              <div className="col-xl-3 search-users-select-cat-container">
                <CustomDropDown
                  options={order_categories}
                  onCategoryChange={handleCategoryChange}
                  selectedParentValue = {'All'}
                  title={'Select Time'}                                    
                />
              </div>

              <div className="col-xl-3 search-users-select-cat-container">
                <CustomDropDown
                  options={status_categories}
                  onCategoryChange={handleStatusCategoryChange}
                  selectedParentValue = {'All'}
                  title={'Select Status'}                                    
                />
              </div>

              <div className="col-xl-3 user-search-container">
                <CustomizedInputBase 
                  searchString={searchString}
                  setSearchString={setSearchString}
                  placeholder="Search Orders"
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
                    {orders.map((row, index) => (
                      <TableRow key={row.id} hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'status' ?
                              (
                                <>                                  
                                  <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', alignItems: 'center' }}>
                                    {row[column.id]}
                                    {!['rejected','cancelled','delivered'].includes(row[column.id].toLowerCase()) &&
                                    <PositionedMenu 
                                        id={row['id']}
                                        onStatusChange={handleStatusChange}
                                    />
                                  }
                                  </div>
                                </>
                              ) : 
                              row[column.id] || 'error'
                          }
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

            {isLoading && (
              <div className="progress-circle-container">
                <Stack sx={{ color: 'grey.500' }} direction="row">
                  <CircularProgress color="primary" />
                </Stack>
              </div>
            )}

          {!dataFetchError && moreOrdersToLoad ? (
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
            !dataFetchError && !moreOrdersToLoad ? (
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

export default OrdersTable;