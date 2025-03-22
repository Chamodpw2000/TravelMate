import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/TravalMate Logo.png';
import './NavbarComponent.css';
import SigninModal from '../signinModal/SigninModal';
import { motion } from 'framer-motion';

const BookingsModal = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <>
      <Nav.Link onClick={handleShow} className="nav-item">My Bookings</Nav.Link>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>My Bookings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="booking-buttons">
            <Button 
              variant="primary" 
              className="booking-btn"
              onClick={() => handleNavigation('/mybookings/available')}
            >
              Hotel Bookings
            </Button>
            <Button 
              variant="primary" 
              className="booking-btn"
              onClick={() => handleNavigation('/myguidbookings/available')}
            >
              Guide Bookings
            </Button>
            <Button 
              variant="primary" 
              className="booking-btn"
              onClick={() => handleNavigation('/myVehicleBooking/available')}
            >
              Transportation Bookings
            </Button>
            <Button 
              variant="primary" 
              className="booking-btn"
              onClick={() => handleNavigation('/package-bookings')}
            >
              Package Bookings
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const NavbarComponent = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar expand="lg" className={`custom-navbar ${scrolled ? 'scrolled' : ''}`} fixed="top">
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar.Brand href="/" className="brand-logo">
            <div style={{
              backgroundColor: '#DDE8EE',
              padding: '0px',
              borderRadius: '20px 0px 20px 0px',
              display: 'inline-flex',
              alignItems: 'center',
              marginRight: '10px'
            }}>
              <img src={logo} alt="Logo" style={{ width: '50px' }} />
            </div>
            <span className="brand-text">Travel Mate</span>
          </Navbar.Brand>
        </motion.div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Nav.Link href="#" className="nav-item">Explore</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Nav.Link href="#" className="nav-item">Packages</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Nav.Link href="#" className="nav-item">Services</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Nav.Link href="/details" className="nav-item">More</Nav.Link>
            </motion.div>
            {localStorage.getItem("user") && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <BookingsModal />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <SigninModal />
            </motion.div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
