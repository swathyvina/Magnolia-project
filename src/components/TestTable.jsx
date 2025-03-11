import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';
import { Typography, Box } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTests, deleteTest } from '../hooks/API.tsx';

const columns = [
  { id: 'test_id', label: 'Test ID', minWidth: 100 },
  { id: 'test_name', label: 'Name', minWidth: 170 },
  { id: 'short_name', label: 'Short Name', minWidth: 100 },
  { id: 'uom', label: 'UOM', minWidth: 100 },
  { id: 'created_on', label: 'Created On', minWidth: 170 },
];

const TestTable = () => {
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
    fetchTestsData();
  }, []);

  const fetchTestsData = async () => {
    try {
      const res = await fetchTests(token);
      if (res?.data?.length > 0 && res.data[0]?.response) {
        setTests(res.data[0].response);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleDelete = async (testId) => {
    try {
      const isDeleted = await deleteTest(testId, token);
      if (isDeleted) {
        setTests((prevTests) => prevTests.filter((test) => test._id !== testId));
      }
    } catch (error) {
      console.error('Error deleting lab test:', error);
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.test_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event, testId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTestId(testId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTestId(null);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <Typography variant="h4" sx={{ color: 'grey', fontSize: '25px' }}>
        TEST LIST
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search by ID or Name"
            variant="filled"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '200px' }}
          />
          <Button
            variant="contained"
            startIcon={<MenuIcon />}
            onClick={fetchTestsData}
            sx={{
              backgroundColor: '#dd3d4e',
              color: 'white',
              borderRadius: '25px',
            }}
          >
            SHOW
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/addtest')}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '25px',
            border: '2px solid #c82333',
          }}
        >
          ADD NEW
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth, fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((test) => (
                <TableRow hover key={test._id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{test[column.id] || 'N/A'}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, test._id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredTests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/addtest/${selectedTestId}`)}>
          <EditIcon /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedTestId)}>
          <DeleteIcon /> Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default TestTable;


