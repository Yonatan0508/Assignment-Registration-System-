import logo from "./logo.svg";
import "./App.css";
import registerIcon from "./images/register-app-icon.png";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser } from "./shared/authApi";

import React, { useState } from "react";
function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
async function handleRegister(form) {
  try {
    const userPayload = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    };

    const result = await registerUser(userPayload);
    console.log("Registration success:", result);
    alert(` ${result.gpt_response.response_from_gpt_server.message}`);
  } catch (err) {
    alert(" Error: " + (err.response?.data?.detail || err.message));
  }
}
  const validateForm = () => {
    let newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="register-box">
      <div className="left-panel">
        <img src={registerIcon} className="App-logo" alt="logo" />
        <p>Welcome aboard my friend</p>
        <p>just a couple of clicks and we start</p>
      </div>
      <div className="right-panel">
        <h2 className="title">Register</h2>
        <Box display="flex" flexDirection="column" gap={2} width="300px">
          <TextField
            label="Full Name"
            sx={{
              "& .MuiFormHelperText-root": {
                color: "#d32f2f",
                fontSize: "0.8rem"
              },
              "& .MuiOutlinedInput-root.Mui-error fieldset": {
                borderColor: "#ff5b5b"
              }
            }}
            variant="outlined"
            helperText={errors.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            error={Boolean(errors.fullName)}
          />
          <TextField
            label="Email"
            type="email"
            sx={{
              "& .MuiFormHelperText-root": {
                color: "#d32f2f",
                fontSize: "0.8rem"
              },
              "& .MuiOutlinedInput-root.Mui-error fieldset": {
                borderColor: "#ff5b5b"
              }
            }}
            variant="outlined"
            helperText={errors.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            error={Boolean(errors.email)}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            helperText={errors.password}
            error={Boolean(errors.password)}
            onChange={e => setForm({ ...form, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  />
                </InputAdornment>
              )
            }}
          />{" "}
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            onChange={e =>
              setForm({ ...form, confirmPassword: e.target.value })}
          />
          <Box display="flex" alignItems="center" width="100%">
            <Box flex="1" height="1px" bgcolor="#ccc" />
            <Box px={1} fontWeight="600" color="#888">
              OR
            </Box>
            <Box flex="1" height="1px" bgcolor="#ccc" />
          </Box>{" "}
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            width="300px"
            mt={2}
            mb={2}
          >
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              style={{
                borderRadius: "20px",
                textTransform: "none",
                flex: 1
              }}
            >
              Google
            </Button>

            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              style={{
                borderRadius: "20px",
                textTransform: "none",
                flex: 1
              }}
            >
              Facebook
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (validateForm()) {
                alert("Form submitted successfully!");
				handleRegister(form);
              }
            }}
          >
            Register
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default App;
