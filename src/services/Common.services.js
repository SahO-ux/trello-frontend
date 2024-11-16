import ReactDOMServer from "react-dom/server";
import { IconCloseBold } from "../Components/Common/Icons";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import styles for toastr

const visibleToastCount = () => {
  let toastCount = Array.from(document.querySelectorAll(".toast")).filter(
    (toast) => toast.offsetParent !== null
  );
  return toastCount?.length;
};

export function checkAndHideClearButton() {
  const toastContainer = document.getElementById("toast-container");
  let clearButton = toastContainer?.querySelector(".btn-clear-toast");
  clearButton?.remove();
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const visibleCloseBtn = () => {
  return document.querySelector(".btn-clear-toast");
};

export function checkAndShowClearButton() {
  let checkVisible = document.getElementsByClassName("toast-clear-button");
  let toastContainer = document.getElementById("toast-container");
  if (visibleToastCount() > 1 && checkVisible?.length < 1) {
    toastContainer.classList.add("top-50");
    const clearIcon = ReactDOMServer.renderToStaticMarkup(
      <IconCloseBold className={"text-white ml-2"} />
    );
    const clearButton = `<div class="btn-clear-toast"><button class="toast-clear-button btn bg-grey-300 font-14 font-weight-normal text-white">Close all ${clearIcon}</button></div>`;
    toastContainer.insertAdjacentHTML("afterbegin", clearButton);
    let clearAllButton = toastContainer.querySelector(".btn-clear-toast");
    if (clearAllButton) {
      clearAllButton.addEventListener("click", function () {
        toastContainer.remove();
        checkAndHideClearButton();
      });
    }
  } else {
    checkAndHideClearButton();
  }
}

export const getStorage = (key) => {
  const value = localStorage.getItem(key);
  return value;
};

export const setStorage = (key, data) => {
  const value = localStorage.setItem(key, data);
  return value;
};

export function objToQueryParams(obj) {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(
        encodeURIComponent(p) +
          "=" +
          encodeURIComponent(
            typeof obj[p] === "string" ? obj[p] : JSON.stringify(obj[p])
          )
      );
    }
  return str.join("&");
}

export const toastrUtil = {
  show: function (message, type, title, timeOut, customOptions) {
    let isShowBtn = visibleToastCount() >= 1 && !visibleCloseBtn();

    let totalTimeOut = 1000 * 3 * 60;
    let remainingTime = totalTimeOut;
    let countdownInterval;

    function updateCountdown() {
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        return;
      }
      remainingTime -= 1000;
    }

    const commonOptions = {
      showMethod: "slideDown",
      hideMethod: "slideUp",
      timeOut: timeOut || 5000,
      onShown: function () {
        isShowBtn && checkAndShowClearButton();
        countdownInterval = setInterval(updateCountdown, 1000);
      },
      onHidden: function () {
        clearInterval(countdownInterval);
        remainingTime = totalTimeOut;
        setTimeout(() => {
          checkAndHideClearButton();
        }, 1000);
      },
    };

    if (type === "success") {
      toastr.success(message, title, commonOptions);
    } else if (type === "error") {
      toastr.error(message, title, customOptions || commonOptions);
    } else if (type === "info") {
      toastr.info(message, title, commonOptions);
    } else if (type === "warning") {
      toastr.warning(message, title, customOptions || commonOptions);
    } else {
      toastr.info(message, title, commonOptions);
    }
  },
};
