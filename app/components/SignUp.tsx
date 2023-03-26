"use client";

import { useState, useEffect, useContext } from 'react';
import { Alert, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { AuthenticationContext } from '../context/AuthContext';
import useInput from '../../hooks/useInput';
import useAuth from '../../hooks/useAuth';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function SignUp() {
  const { loading, error } = useContext(AuthenticationContext);
  const { signup } = useAuth();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [firstName, onFirstNameChange] = useInput();
  const [lastName, onLastNameChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();
  const [phone, onPhoneChange] = useInput();
  const [city, onCityChange] = useInput();

  const [disable, setDisable] = useState(true);

  const handleClick = () => {
    signup({ email, password, firstName, lastName, phone, city }, handleClose);
  }

  useEffect(() => {
    if (firstName && lastName && email && password && phone && city) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [firstName, lastName, email, password, phone, city])

  return (
    <div>
      <button
        className="border p-1 px-4 rounded mr-3"
        onClick={handleOpen}
      >
        Sign up
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <div className="p-2 h-[460px]">
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
              <p className="text-sm">
                Create Account
              </p>
            </div>
            <div className='m-auto'>
              <h2 className="text-2xl font-light text-center">
                Create Your Open Table Account
              </h2>
              {
                loading ? (
                  <div className="px-24 py-12 flex justify-center">
                    <CircularProgress color="primary" />
                  </div>
                ) : (
                  <>
                    <div className="my-3 flex justify-between text-sm">
                      <input
                        type="text"
                        className="border rounded p-2 py-3 w-[49%]"
                        placeholder="First Name"
                        value={firstName}
                        onChange={onFirstNameChange}
                      />
                      <input
                        type="text"
                        className="border rounded p-2 py-3 w-[49%]"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={onLastNameChange}
                      />
                    </div>
                    <div className="my-3 flex justify-between text-sm">
                      <input
                        type="text"
                        className="border rounded p-2 py-3 w-full"
                        placeholder="Email"
                        value={email}
                        onChange={onEmailChange}
                      />
                    </div>
                    <div className="my-3 flex justify-between text-sm">
                      <input
                        type="text"
                        className="border rounded p-2 py-3 w-[49%]"
                        placeholder="Phone"
                        value={phone}
                        onChange={onPhoneChange}
                      />
                      <input
                        type="text"
                        className="border rounded p-2 py-3 w-[49%]"
                        placeholder="City"
                        value={city}
                        onChange={onCityChange}
                      />
                    </div>
                    <div className="my-3 flex justify-between text-sm">
                      <input
                        type="password"
                        className="border rounded p-2 py-3 w-full"
                        placeholder="Password"
                        value={password}
                        onChange={onPasswordChange}
                      />
                    </div>
                    <button
                      className='uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400'
                      disabled={disable}
                      onClick={handleClick}
                    >
                      Create Account
                    </button>
                  </>
                )
              }
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}