import React from 'react'
import logo from "../../assets/TravalMateLogo2.png"
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./SigninModal.css"
import google from "../../assets/google.png"
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { GoogleLogin, useGoogleLogin, useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';


const SigninModal = () => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [hasAccount, setHasAccount] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
          try {
            setShow(false);
            const res = await axios.get(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              }
            );
            // setUser(res.data); // Set the user data
            console.log(res.data);
          } catch (e) {
            console.log(e);
          }
        },
      });

      useGoogleOneTapLogin({
        onSuccess: (credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential);
          setUser(decoded); // Set the user data
          console.log(decoded);
        },
        onError: () => {
          console.log('Login Failed');
        },
      });
    
    const signInWithEmailAndPassword = () => {
        setShow(false);
        console.log("Sign in function called");
    }

    const signUpWithEmailAndPassword = () =>{
        setShow(false);
        console.log("Sign up function called");
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <a className='nav-signin' onClick={handleShow}>SignUp</a>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton></Modal.Header>

                <Modal.Body className="text-start" style={{ padding: '20px' }}>
                    <div className="d-flex justify-content-left align-items-left">
                        <img
                            src={logo}
                            alt="Icon"
                            style={{ height: "98px", paddingBottom: "33px" }}
                        />
                    </div>
                    <h2 className='fw-bold' style={{ paddingBottom: "25px" }}>Hello, adventurer!</h2>


                    <Form >
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                style={{ borderRadius: '10px', marginBottom: "25px", width: "463px", height: "50px", borderWidth: "2px" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                style={{ borderRadius: '10px', marginBottom: "25px", width: "463px", height: "50px", borderWidth: "2px" }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <p>{hasAccount ? "Don't have an account ?" : "Already have an account ?"} <span onClick={() => setHasAccount(!hasAccount)} style={{ fontWeight: "bold", color: "rgba(16, 77, 108,1)" }}>{hasAccount ? " SignUp" : " SignIn"}</span></p>


                    <div className="d-flex justify-content-center">
                        <Button
                            variant="outline-dark"
                            className="d-flex align-items-center justify-content-start"
                            style={{ borderRadius: '50px', marginBottom: "7px", width: "250px", height: "50px", borderWidth: "2px" }}
                            onClick={hasAccount ? signInWithEmailAndPassword : signUpWithEmailAndPassword}
                        >
                            <span className="text-center flex-grow-1">{hasAccount ? "Sign in" : "Sign up"}</span>
                        </Button>
                    </div>

                    <div className="d-flex align-items-center justify-content-center">
                        <hr className="flex-grow-1" />
                        <span className="mx-2">or</span>
                        <hr className="flex-grow-1" />
                    </div>
                    
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="outline-dark"
                            className="d-flex align-items-center justify-content-start"
                            style={{ borderRadius: '50px', marginBottom: "25px", marginTop: "7px", width: "250px", height: "50px", borderWidth: "2px" }}
                            onClick={signInWithGoogle}
                        >
                            <img src={google} style={{ width: "30px", marginLeft: "15px" }} />
                            <span className="text-center flex-grow-1">Continue with Google</span>
                        </Button>

                    </div>

                    <p className="text-center" style={{ fontSize: '0.8em', color: "rgba(159, 184, 196, 1)", marginTop: "20px" }}>
                        By proceeding, you agree to our <a href="#" style={{ color: "rgba(159, 184, 196, 1)" }}>Terms of Use</a> and confirm you have read our <a href="#" style={{ color: "rgba(159, 184, 196, 1)" }}>Privacy and Cookie Statement</a>.
                    </p>
                    <p className="text-center" style={{ fontSize: '0.8em', color: "rgba(159, 184, 196, 1)" }}>
                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" style={{ color: "rgba(159, 184, 196, 1)" }}>Privacy Policy</a> and <a href="https://policies.google.com/terms" style={{ color: "rgba(159, 184, 196, 1)" }}>Terms of Service</a> apply.
                    </p>

                </Modal.Body>
            </Modal>

        </>
    )
}

export default SigninModal