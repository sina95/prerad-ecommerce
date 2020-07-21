import axios from "axios";
import toastr from "toastr";
import * as actionTypes from "./actionTypes";
import { localhost, TOASTR_OPTIONS } from "../../constants.js";
import jwtDecode from "jwt-decode";
import { authAxios } from "../../utils";

toastr.options = TOASTR_OPTIONS;

export const authStart = (username) => {
  return {
    type: actionTypes.AUTH_START,
    payload: username,
  };
};

export const authSuccess = () => {
  return {
    type: actionTypes.AUTH_SUCCESS,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    payload: error,
  };
};

export const setAuthorizationToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("jwtRefreshToken");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("refreshExpirationDate");
  // setAuthorizationToken(false);

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const renewAuthorizationToken = () => {
  return (dispatch) => {
    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    const refreshExpirationDate = new Date(
      localStorage.getItem("refreshExpirationDate")
    );
    const expirationTime = (expirationDate - new Date()) / 1000 - 30;
    console.log(expirationTime);

    setInterval(() => {
      const refresh = localStorage.getItem("jwtRefreshToken");
      axios
        .post(`${localhost}/dj-rest-auth/token/refresh/`, { refresh })
        .then((res) => {
          const token = res.data.access;
          const expirationDate = new Date(jwtDecode(token).exp * 1000);
          // localStorage.removeItem("jwtToken");
          // localStorage.removeItem("expirationDate");
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("expirationDate", expirationDate);
          setAuthorizationToken(token + "ii");
          console.log(token);
        });
    }, expirationTime * 1000);
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    console.log(expirationTime);
    setTimeout(() => {
      dispatch(logout());
      console.log("timeout");
    }, expirationTime * 1000);
  };
};

// export const refreshTokenTimeout = (refresh) => {
//   return (dispatch) => {
//     const expirationDate = new Date(localStorage.getItem("expirationDate"));
//     const refreshExpirationDate = new Date(
//       localStorage.getItem("refreshExpirationDate")
//     );
//     const expirationTime = (expirationDate - new Date()) / 1000 - 290;
//     // const refresh = localStorage.getItem("jwtRefreshToken");
//     renewAuthorizationToken(refresh);
//     // console.log(expirationTime);
//     setInterval(() => {
//       const refresh = localStorage.getItem("jwtRefreshToken");
//       // console.log(refresh);
//       renewAuthorizationToken(refresh);
//       console.log("pass");
//       // dispatch(logout());
//     }, expirationTime * 1000);
//   };
// };

function doesHttpOnlyCookieExist(cookiename) {
  var d = new Date();
  d.setTime(d.getTime() + 1000);
  var expires = "expires=" + d.toUTCString();

  document.cookie =
    "name=" + cookiename + ";domain=127.0.0.1:8000;path=/;" + expires;
  if (document.cookie.indexOf(cookiename + "=") == -1) {
    return true;
  } else {
    return false;
  }
}

export const authLogin = (username, password) => {
  const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (dispatch) => {
    dispatch(authStart(username));
    authAxios()
      .post(
        `${localhost}/dj-rest-auth/login/`,
        expression.test(username)
          ? {
              username: username,
              email: username,
              password: password,
            }
          : { username: username, password: password }
      )
      .then((res) => {
        dispatch(authSuccess());
        toastr.success(`Logged in as <b>${username}</b>.`);
        localStorage.setItem("token", "yes");
        // dispatch(renewAuthorizationToken());
        // dispatch(checkAuthTimeout((expirationDate - new Date()) / 1000 - 290));
      })
      .catch((err) => {
        dispatch(authFail(err.response));
        if (
          err.response.status === 400 &&
          err.response.data.non_field_errors[0] ===
            "Unable to log in with provided credentials."
        ) {
          toastr.error("Log in failed, please check your credentials again.");
        }
        dispatch(authFail(err.response.data));
      });
  };
};

// export const logout = () => {
//   return (dispatch) => {
//     localStorage.removeItem("jwtToken");
//     setAuthorizationToken(false);
//     dispatch(authSuccess({}));
//   };
// };

export const checkAuthorizationToken = (token) => {
  return (dispatch) => {
    axios
      .post(`${localhost}/dj-rest-auth/token/verify/`, { token })
      .then((res) => {
        dispatch(renewAuthorizationToken(res.data.token));
      })
      .catch((err) => {
        if (
          err.response.status === 400 &&
          err.response.data.non_field_errors[0] === "Signature has expired."
        ) {
          dispatch(logout());
          // dispatch(fetchProducts())
        }
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${localhost}/dj-rest-auth/registration/`, {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      })
      .then((res) => {
        toastr.success("Welcome! Verification mail is sent to you!");
      })
      .catch((err) => {
        if (
          err.response.status === 400 &&
          err.response.data.username[0] ===
            "A user with that username already exists."
        ) {
          toastr.error("A user with that username already exists.");
        }
        dispatch(authFail(err.response.data.non_field_errors));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    // console.log(token);
    if (token === undefined || token === null) {
      dispatch(logout());
    } else dispatch(authSuccess(token));
    // const expirationDate = new Date(localStorage.getItem("expirationDate"));
    // const refreshExpirationDate = new Date(
    //   localStorage.getItem("refreshExpirationDate")
    // );
    // if (expirationDate <= new Date()) {
    //   dispatch(logout());
    // } else {
    //   dispatch(authSuccess(token));
    // dispatch(
    //   checkAuthTimeout(expirationDate.getTime() - new Date().getTime())
    // );
  };
};

// export const authRefresh = () => {
//   return (dispatch) => {
//     dispatch(authStartRefresh());
//     axios
//       .post(`${localhost}/token/refresh/`, {
//         refresh: localStorage.getItem("refresh_token"),
//       })
//       .then((res) => {
//         const token = res.data.access_token;
//         localStorage.setItem("token", token);
//         // localStorage.removeItem("token");

//         dispatch(authSuccess(token));
//         // dispatch(checkAuthTimeout(3600));
//       })
//       .catch((err) => {
//         dispatch(authFail(err));
//       });
//   };
// };

export default class authService {
  init = () => {
    this.setInterceptors();
    console.log("test");
  };

  setInterceptors = () => {
    axios.defaults.headers.common["Token"] = localStorage.getItem("jwtToken");
    axios.defaults.headers.common["Device"] = "device";
  };
}
