"use client";

import { useState, useContext, useEffect } from 'react';
import { Alert, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { AuthenticationContext } from '../context/AuthContext';
import useAuth from '../../hooks/useAuth';
import useInput from '../../hooks/useInput';

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

export default function SignIn() {
  const { loading, error } = useContext(AuthenticationContext);
  const { signin } = useAuth();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();

  const [disable, setDisable] = useState(true);

  const handleClick = () => {
    signin({ email, password }, handleClose);
  }

  useEffect(() => {
    if (email && password) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [email, password])

  return (
    <div>
      <button
        className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
        onClick={handleOpen}
      >
        Sign in
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2 h-[400px]">
            {error && (
              <Alert severity="error" className="mb-4">
                { error }
              </Alert>
            )}
            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
              <p className="text-sm">
                Sign In
              </p>
            </div>
            <div className='m-auto'>
              <h2 className="text-2xl font-light text-center">
                Log Into Your Account
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
                        className="border rounded p-2 py-3 w-full"
                        placeholder="Email"
                        value={email}
                        onChange={onEmailChange}
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
                      Sign in
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