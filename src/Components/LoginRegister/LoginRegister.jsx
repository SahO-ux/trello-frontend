import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import _ from "lodash";
import axios from "axios";

import { setLogin } from "../../state";
import { initialUserInfo, passwordCriteria } from "./constant";
import {
  getStorage,
  isValidEmail,
  setStorage,
  toastrUtil,
} from "../../services/Common.services";

const LoginRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signupOrLogin, setSignupOrLogin] = useState("signup");

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getStorage("token")) return navigate("/home");
  }, []);

  const register = async () => {
    // Handle Validations
    const { firstName, lastName, email, password, confirmPassword } = userInfo;
    if (!firstName?.trim())
      return toastrUtil.show("First Name is required", "error");
    if (!lastName?.trim())
      return toastrUtil.show("Last Name is required", "error");
    if (!isValidEmail(email?.trim()))
      return toastrUtil.show("Please enter valid email", "error");
    if (!passwordCriteria.PASSWORD_REGEX.test(password))
      return toastrUtil.show(passwordCriteria.REGEX_MSG, "error");
    if (!_.isEqual(password, confirmPassword))
      return toastrUtil.show(
        "Password & Confirm Password must be same",
        "error"
      );

    const params = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      password: password?.trim(),
    };

    const url = `${process.env.REACT_APP_API_URL}auth/register`.trim();
    const query = {
      method: "post",
      url,
      data: params,
    };
    setIsLoading(true);
    axios(query)
      .then((res) => {
        setUserInfo(initialUserInfo);
        setIsLoading(false);
        toastrUtil.show("User registered successfully", "success");
        setSignupOrLogin("login");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toastrUtil.show(error?.response?.data?.msg, "error");
      });
  };

  const login = async () => {
    try {
      const params = {
        email: userInfo?.email?.trim(),
        password: userInfo?.password,
      };
      const query = {
        method: "post",
        url: `${process.env.REACT_APP_API_URL}auth/login`,
        data: params,
      };

      setIsLoading(true);
      axios(query)
        .then((res) => {
          toastrUtil.show("You have successfully logged in", "success");
          setIsLoading(false);

          if (res?.data?.token) {
            setStorage("token", JSON.stringify(res?.data.token));
            dispatch(
              setLogin({
                user: res?.data.user,
                token: res?.data.token,
              })
            );
            navigate("/home");
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toastrUtil.show(err?.response?.data?.msg, "error");
        });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Task Manager</span>
          <div className="ml-auto">
            <button
              onClick={() => setSignupOrLogin("login")}
              className={`btn ${
                signupOrLogin !== "signup" ? "btn-light" : "btn-outline-light"
              } me-2`}
            >
              Login
            </button>
            <button
              onClick={() => setSignupOrLogin("signup")}
              className={`btn ${
                signupOrLogin === "signup" ? "btn-light" : "btn-outline-light"
              }`}
            >
              Signup
            </button>
          </div>
        </div>
      </nav>

      {/* Signup Form */}
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-sm p-4" style={{ width: "400px" }}>
          <h4 className="card-title text-center mb-4">
            {signupOrLogin === "signup" ? "Signup" : "Login"}
          </h4>
          {signupOrLogin === "signup" && (
            <>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  onChange={(e) =>
                    setUserInfo((prevVal) => {
                      return {
                        ...prevVal,
                        firstName: e?.target?.value,
                      };
                    })
                  }
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  onChange={(e) =>
                    setUserInfo((prevVal) => {
                      return {
                        ...prevVal,
                        lastName: e?.target?.value,
                      };
                    })
                  }
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              onChange={(e) =>
                setUserInfo((prevVal) => {
                  return {
                    ...prevVal,
                    email: e?.target?.value,
                  };
                })
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={(e) =>
                setUserInfo((prevVal) => {
                  return {
                    ...prevVal,
                    password: e?.target?.value,
                  };
                })
              }
              placeholder="Enter your password"
              required
            />
          </div>

          {signupOrLogin === "signup" && (
            <div className="mb-3">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirm-password"
                onChange={(e) =>
                  setUserInfo((prevVal) => {
                    return {
                      ...prevVal,
                      confirmPassword: e?.target?.value,
                    };
                  })
                }
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            disabled={isLoading}
            onClick={() => {
              if (signupOrLogin === "signup") register();
              else login();
            }}
            className="btn btn-primary w-100"
          >
            {signupOrLogin === "signup" ? "Signup" : "Login"}
          </button>

          <div className="text-center mt-3">
            {signupOrLogin === "signup" && (
              <p>
                Already have an account?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSignupOrLogin("login")}
                >
                  Login
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
