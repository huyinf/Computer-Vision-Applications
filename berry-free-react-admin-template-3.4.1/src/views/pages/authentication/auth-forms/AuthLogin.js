import { useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import Webcam from 'react-webcam';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
  Switch
} from '@mui/material';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
// import { Cookie } from '@mui/icons-material';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);

  const [useFaceAuth, setUseFaceAuth] = useState(false); // New state for face auth toggle
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(true);

  // Webcam Capture Configuration
  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user", // Front-facing camera
  };

  const navigate = useNavigate();

  const [errorLogin, setErrorLogin] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses based on specific status codes
        switch (response.status) {
          case 404:
            console.error('Login error: User not found');
            setErrorLogin(true);
            break;
          case 401:
            console.error('Login error: Invalid credentials');
            setErrorLogin(true);
            break;
          default:
            console.error('Login error:', data.message || 'Login failed');
            setErrorLogin(true);
        }
        return; // Exit early on error
      }

      // Handle success (e.g., storing token, redirecting)
      console.log('Login successful:', data);
      const token = data.token;

      // Store the JWT token in local storage
      localStorage.setItem('token', token);
      Cookies.set('user', token, { expires: 1 }); // Store token in cookies for session management

      // Navigate to a new page after successful login
      navigate('/dashboard/default');
    } catch (err) {
      console.error('Login error:', err.message);
      setErrorLogin(true); // Set error state to display a message in the UI if needed
    }
  };

  // Function to handle face authentication
  const handleFaceLogin = async (image) => {
    if (image) {
      try {
        const response = await fetch('http://localhost:8080/user/login-face', {
          method: 'POST',
          body: JSON.stringify({ faceImage: image }), // Send the image to the backend
          headers: { 'Content-Type': 'application/json' },
        });

        console.log("send");
        const data = await response.json();

        console.log('get data', data);

        if (!response.ok) {
          setErrorLogin(true);
          return;
        }

        // Handle successful face authentication
        const token = data.token;
        localStorage.setItem('token', token);
        Cookies.set('user', token, { expires: 1 });
        navigate('/dashboard/default');
      } catch (err) {
        setErrorLogin(true);
      }
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setWebcamActive(false); // Stop webcam after capturing
    }
  }, [webcamRef]);


  // Handle 'New Capture' button click
  const handleNewCapture = () => {
    setImage(null); // Clear the current image
    setWebcamActive(true); // Restart the webcam
  };

  // // New function for face login after image capture
  // const handleFaceLoginClick = () => {
  //   if (image) {
  //     handleFaceLogin(image);
  //   }
  // };

  const googleHandler = async () => {
    console.error('Login');
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

            <Button
              variant="outlined"
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`
              }}
              disableRipple
              disabled
            >
              OR
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Email address</Typography>
          </Box>
        </Grid>

        {/* Switch Button for Face Authentication */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={useFaceAuth}
                onChange={() => setUseFaceAuth(!useFaceAuth)}
                color="primary"
              />
            }
            label="Use Face Authentication"
          />
        </Grid>



        {/* Conditional Webcam Capture UI */}
        {useFaceAuth && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Capture your face for authentication:</Typography>

              {/* Webcam component to capture face */}
              {webcamActive && (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              )}

              {/* Show buttons only if webcam is active or an image is captured */}
              {webcamActive ? (
                <Button variant="outlined" onClick={capture} fullWidth>
                  Capture Face
                </Button>
              ) : (
                <>
                  {/* Display captured image */}
                  {image && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">Captured Image:</Typography>
                      <img src={image} alt="Captured face" style={{ width: '100%', maxWidth: '320px' }} />
                    </Box>
                  )}

                  {/* "Choose" and "New Capture" buttons */}
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => console.log('Image chosen:', image)}
                  >
                    Choose
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleNewCapture}
                  >
                    New Capture
                  </Button>

                  {/* New button for signing in with face after capturing the image */}

                  {/* <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleFaceLoginClick} // Updated to call the new function
                  >
                    Sign In with Face
                  </Button> */}
                </>
              )}
            </Box>
          </Grid>
        )}


      </Grid>

      <Formik
        initialValues={{
          email: 'info@codedthemes.com',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {

              // // send request login
              // await useFaceAuth ? handleLogin(values.email, values.password) : handleFaceLogin(image);

              if (useFaceAuth && image) {
                await handleFaceLogin(image); // Use face login if enabled
              } else {
                await handleLogin(values.email, values.password); // Regular login
              }

              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {errorLogin && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <WarningAmberIcon color="error" sx={{ mr: 1 }} />
                <FormHelperText error id="login-error-text">
                  An error occurred during login. Please try again.
                </FormHelperText>
              </Box>
            )}


            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              />
              <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Stack>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
