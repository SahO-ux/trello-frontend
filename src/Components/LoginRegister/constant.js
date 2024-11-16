export const initialUserInfo = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const passwordCriteria = {
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})/,
  REGEX_MSG:
    "Must Contain 10 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
};
