import axios from "axios";
import toastr from "toastr";
import * as actionTypes from "./actionTypes";
import { localhost, TOASTR_OPTIONS } from "../../constants.js";
import fp from "fingerprintjs2";

toastr.options = TOASTR_OPTIONS;

export const fingerprintStart = () => {
  return {
    type: actionTypes.FINGERPRINT_START,
  };
};

export const fingerprintSuccess = (data) => {
  return {
    type: actionTypes.FINGERPRINT_SUCCESS,
    payload: data,
  };
};

export const fingerprintFail = (error) => {
  return {
    type: actionTypes.FINGERPRINT_FAIL,
    payload: error,
  };
};

export const cleanData = (f) => {
  for (let key in f) {
    if (f[key] === null || f[key] === undefined || f[key] instanceof Error) {
      delete f[key];
    }
    if (Array.isArray(f[key])) {
      f[key] = f[key].join(", ");
    }
    if (
      (typeof f[key] === "string" || f[key] instanceof String) &&
      f[key].length === 0
    ) {
      delete f[key];
    }
    if (typeof f[key] === "boolean") {
      f[key] = `${f[key]}`;
    }
  }

  return f;
};

export const getFingerprint = () =>
  new Promise((resolve) => {
    var options = {
      fonts: { extendedJsFonts: true },
      excludes: { userAgent: true },
    };
    fp.get(options, (components) => {
      resolve(components);
    });
  });

export const fingerprint = () => {
  return (dispatch) => {
    dispatch(fingerprintStart());
    fetch("https://extreme-ip-lookup.com/json")
      .then((res) => res.json())
      .then((ip) => Promise.all([ip, getFingerprint()]))
      .then(([ip, finger]) => {
        let f = finger
          .map(({ key, value }) => ({ [key]: value }))
          .reduce((acc, curr) => ({
            ...acc,
            ...curr,
          }));

        f = cleanData(f);
        ip = cleanData(ip);
        dispatch(fingerprintSuccess(ip));
        console.log(ip);
        console.log(f);
      })
      .catch((err) => dispatch(fingerprintFail(err.response)));
  };
};
