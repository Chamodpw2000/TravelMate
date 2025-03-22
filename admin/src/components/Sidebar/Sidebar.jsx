import React, { useState } from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import TopNavbar from '../TopNavbar/TopNavbar';

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <TopNavbar/>
      <button className="btn btn-primary d-lg-none" onClick={handleShow}>
        ☰ Menu
      </button>

      <Offcanvas show={show} onHide={handleClose} className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Link to="/hotels" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Hotels</p>
              </div>
            </Link>
            <Link to="/guides" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Guides</p>
              </div>
            </Link>
            <Link to="/destinations" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Destinations</p>
              </div>
            </Link>
            <Link to="/restaurants" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Restaurants</p>
              </div>
            </Link>
            <Link to="/users" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Users</p>
              </div>
            </Link>
            <Link to="/transportmodes" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Transport Modes</p>
              </div>
            </Link>
            <Link to="/manage-hotel-bookings" style={{ textDecoration: 'none' }} onClick={handleClose}>
              <div className="sidebar-item">
                <p>Manage Hotel Bookings</p>
              </div>
            </Link>
            <Link to="/manage-guide-bookings" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Guid Bookings</p>
            </div>
          </Link>
          <Link to="/manage-transport-bookings" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Transport Bookings</p>
            </div>
          </Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-none d-lg-block" style={{ backgroundColor: '#b0c4de', width: '250px', height: '100vh', position: 'fixed' }}>
        <Nav className="flex-column p-4">
          <Link to="/hotels" style={{ textDecoration: 'none', marginTop:'80px'}}>
            <div className="sidebar-item">
              <p>Manage Hotels</p>
            </div>
          </Link>
          <Link to="/guides" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Guides</p>
            </div>
          </Link>
          <Link to="/destinations" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Destinations</p>
            </div>
          </Link>
          <Link to="/restaurants" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Restaurants</p>
            </div>
          </Link>
          <Link to="/users" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Users</p>
            </div>
          </Link>
          <Link to="/transportmodes" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Transport Modes</p>
            </div>
          </Link>
          <Link to="manage-hotel-bookings" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Hotel Bookings</p>
            </div>
          </Link>

          <Link to="/manage-guide-bookings" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Guid Bookings</p>
            </div>
          </Link>
          <Link to="/manage-transport-bookings" style={{ textDecoration: 'none' }}>
            <div className="sidebar-item">
              <p>Manage Transport Bookings</p>
            </div>
          </Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
