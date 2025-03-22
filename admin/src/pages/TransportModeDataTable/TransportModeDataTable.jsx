import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransportModeDataTable = () => {
  const navigate = useNavigate();
  const columns = [
    {
      name: 'Name',
      selector: row => row.transportationServiceName,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
    },
    
    {
      name: 'Price per Hour(LKR)',
      selector: row => row.pricePerHour,
    },
    {
      name: 'Contact Number',
      selector: row => row.contactNumber,
    },
    {
      name: 'Rating',
      selector: row => row.rating,
    },
    {
      name: 'View More',
      cell: (row) => (
        <button
          style={{
            backgroundColor: '#0A2E41',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '30px',
            cursor: 'pointer',
          }}
          onClick={() => handleViewMore(row)}
        >
          View More
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchTransportationServices();
  }, []);

  const fetchTransportationServices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/travelmate/allTransportationServices');
      setRecords(response.data);
      setFilteredRecords(response.data);
    } catch (error) {
      console.error('Error fetching transportation services:', error);
    }
  };

  function handleFilter(event) {
    const searchTerm = event.target.value.toLowerCase();
    const newData = records.filter(row => {
      return row.transportationServiceName.toLowerCase().includes(searchTerm);
    });
    setFilteredRecords(newData);
  }

  function handleViewMore(row) {
    navigate(`/view-transportation-service/${row.id}`);
  }

  function handleRowSelected(state) {
    setSelectedRows(state.selectedRows);
  }

  async function handleDeleteSelected() {try {
    for (let row of selectedRows) {
      await fetch("http://localhost:3000/travelmate/deleteTransportationService", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.id }), 
      });
    }
    const updatedRecords = records.filter(row => !selectedRows.includes(row));
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords); 
    setSelectedRows([]); 
  } catch (error) {
    console.error("Error deleting Transportation Service:", error);
  }
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: '1120px',
        height: '640px',
        top: '110px',
        left: '365px',
        border: '1px solid #ccc',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <h1>Transport Modes Data Table</h1>
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          onChange={handleFilter}
          placeholder="Filter by Name"
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px' }}
        />

        <Link to="/add-transportation-service">
          <button
            style={{
              backgroundColor: '#0A2E41',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add a Transport Mode
          </button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredRecords}
        fixedHeader
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />

      <div className="d-flex justify-content-end mt-3">
        <button
          onClick={handleDeleteSelected}
          style={{
            backgroundColor: '#0A2E41',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '30px',
            cursor: 'pointer',
          }}
        >
          Delete Selected Transport Modes
        </button>
      </div>
    </div>
  );
}

export default TransportModeDataTable;
