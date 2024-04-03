import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress'; 
import MoreVertIcon from '@mui/icons-material/MoreVertOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import axios from 'axios';

export default function PositionedMenu({ id, onStatusChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const handleStatusChange = async (loanId, newStatus) => {
    await updateLoanStatus(loanId, newStatus);
    handleClose();   
    setAnchorEl(null);

    onStatusChange(loanId, newStatus);
  };

  const updateLoanStatus = async (orderId, newStatus) => {
    try {
      const authToken = localStorage.getItem('access_token');
      setInProgress(true);

      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, {status:newStatus},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
        );
      
      console.log('Loan status updated successfully');

      if (response.data.status === 200) {
        console.log('Loan status updated successfully');
      } else {
        console.error('Failed to update loan status');
      }
    } catch (error) {
      console.error('An error occurred while updating loan status:', error);
    } finally {
      setInProgress(false);
    }
  };

  const [inProgress, setInProgress] = React.useState(false);

  const order_status = [
    {display:'Pending',value:'pending'},
    {display:'Rejected',value:'rejected'},
    {display:'Confirmed',value:'confirmed'},
    {display:'Shipped',value:'shipped'},
    {display:'Delivered',value:'delivered'},
    ]

  return (
    <div>
      <ThemeProvider theme={customActionsTheme}>
        <IconButton
          aria-label="edit"
          size="small"
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color="edit"
        >
          <KeyboardArrowDownIcon fontSize="small" size={20}/>
        </IconButton>
      </ThemeProvider>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
      {/*{order_status.map((status,index) =>}
        <MenuItem onClick={() => handleStatusChange(id, status.value)}>status.display</MenuItem>        
      */}
        <MenuItem onClick={() => handleStatusChange(id, 'pending')}>Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange(id, 'rejected')}>Rejected</MenuItem>
        <MenuItem onClick={() => handleStatusChange(id, 'confirmed')}>Confirmed</MenuItem>
        <MenuItem onClick={() => handleStatusChange(id, 'shipped')}>Shipped</MenuItem>
        <MenuItem onClick={() => handleStatusChange(id, 'delivered')}>Delivered</MenuItem>

        {inProgress && (
          <MenuItem style={{ display: 'flex', gap: '3px', justifyContent: 'center', alignItems: 'center' }}>
           <CircularProgress size={20} />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
