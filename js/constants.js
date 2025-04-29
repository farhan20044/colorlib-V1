// Constants and configuration values
export const API_URL = "https://680835e3942707d722dd9290.mockapi.io/api/formdata/data";
export const SERVICE_FEE = 5.6;

// Products
export const products = [
  { name: "Cherry", price: 35 },
  { name: "Mango", price: 20 },
];

export const STEP_NAMES = {
  BASIC_DETAILS: 0,
  CHANGE_PASSWORD: 1,
  CART: 2,
  BILL: 3,
};

export const VALIDATE_MESSAGE = {
  REQUIRED: "This field is required",
  LETTERS_ONLY: "Only letters allowed",
  NUMBERS_ONLY: "Only numbers allowed",
  EMAIL_INVALID: "Please enter a valid email",
  PASSWORDS_MATCH: "Current passwords must match",
  NEW_PASSWORDS_MATCH: "New passwords don't match",
  PASSWORD_DIFFERENT: "New password must be different from current password",
  CART_EMPTY: "Please add at least one product to your cart",
};

export const BUTTON_TEXT = {
  CONTINUE: "Continue",
  CHECKOUT: "Proceed to Checkout",
  UPLOADING: "Uploading...",
};
