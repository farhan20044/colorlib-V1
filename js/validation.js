import { STEP_NAMES, VALIDATE_MESSAGE } from './constants.js';
import { getCurrentStep } from './navigation.js';
import { validateSection3 } from './cart.js';

export function validateCurrentStep() {
  const currentStep = getCurrentStep();
  const sections = document.querySelectorAll(".content section");
  const currentSection = sections[currentStep];
  const inputs = currentSection.querySelectorAll("input");
  let isValid = true;

  // Remove existing error messages
  currentSection.querySelectorAll(".error-message").forEach((el) => el.remove());
  inputs.forEach((input) => input.classList.remove("is-invalid"));

  // For cart validation (step 3)
  if (currentStep === STEP_NAMES.CART) {
    return validateSection3();
  }

  inputs.forEach((input) => {
    // Skip reference code as it's optional
    if (input.id === "refcode") return;

    if (input.hasAttribute("required") && !input.value.trim()) {
      input.classList.add("is-invalid");
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = VALIDATE_MESSAGE.REQUIRED;
      errorMsg.style.color = "red";
      errorMsg.style.fontSize = "12px";
      errorMsg.style.marginTop = "0px";
      input.parentNode.appendChild(errorMsg);
      isValid = false;
    }

    if (input.id === "email" && input.value.trim() && !validateEmail(input.value)) {
      input.classList.add("is-invalid");
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = VALIDATE_MESSAGE.EMAIL_INVALID;
      errorMsg.style.color = "red";
      errorMsg.style.fontSize = "12px";
      errorMsg.style.marginTop = "0px";
      input.parentNode.appendChild(errorMsg);
      isValid = false;
    }

    // For names, state, country (only letters)
    if (
      (input.id === "name" || input.id === "fullname" || input.id === "state" || input.id === "country") &&
      input.value.trim() &&
      !/^[A-Za-z ]+$/.test(input.value)
    ) {
      input.classList.add("is-invalid");
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = VALIDATE_MESSAGE.LETTERS_ONLY;
      errorMsg.style.color = "red";
      errorMsg.style.fontSize = "12px";
      errorMsg.style.marginTop = "0px";
      input.parentNode.appendChild(errorMsg);
      isValid = false;
    }

    if (input.id === "phone" && input.value.trim() && !/^[0-9+\-\s()]+$/.test(input.value)) {
      input.classList.add("is-invalid");
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = VALIDATE_MESSAGE.NUMBERS_ONLY;
      errorMsg.style.color = "red";
      errorMsg.style.fontSize = "12px";
      errorMsg.style.marginTop = "0px";
      input.parentNode.appendChild(errorMsg);
      isValid = false;
    }
  });

  // Password validation (step 2)
  if (currentStep === STEP_NAMES.CHANGE_PASSWORD) {
    const currentPass = currentSection.querySelector("#current-pass")?.value;
    const enterCurrentPass = currentSection.querySelector("#enter-current-pass")?.value;
    const newPass = currentSection.querySelector("#new-pass")?.value;
    const confirmPass = currentSection.querySelector("#confirm-pass")?.value;

    // Check if current password fields match
    if (currentPass && enterCurrentPass && currentPass !== enterCurrentPass) {
      isValid = false;
      currentSection.querySelectorAll("#current-pass, #enter-current-pass").forEach((input) => {
        input.classList.add("is-invalid");
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = VALIDATE_MESSAGE.PASSWORDS_MATCH;
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "12px";
        errorMsg.style.marginTop = "0px";
        input.parentNode.appendChild(errorMsg);
      });
    }

    if (newPass && confirmPass && newPass !== confirmPass) {
      isValid = false;
      currentSection.querySelectorAll("#new-pass, #confirm-pass").forEach((input) => {
        input.classList.add("is-invalid");
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = VALIDATE_MESSAGE.NEW_PASSWORDS_MATCH;
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "12px";
        errorMsg.style.marginTop = "0px";
        input.parentNode.appendChild(errorMsg);
      });
    }

    if (currentPass && newPass && currentPass === newPass) {
      isValid = false;
      const input = currentSection.querySelector("#new-pass");
      input.classList.add("is-invalid");
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = VALIDATE_MESSAGE.PASSWORD_DIFFERENT;
      errorMsg.style.color = "red";
      errorMsg.style.fontSize = "12px";
      errorMsg.style.marginTop = "0px";
      input.parentNode.appendChild(errorMsg);
    }
  }

  return isValid;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function setupInputValidation() {
  // Clear errors when user starts typing
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.remove("is-invalid");
      const errorMessage = this.parentNode.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  });

  // Prevent non-alphabetic in name, state, and city fields
  document.querySelectorAll("#name, #fullname, #state, #city, #country").forEach((field) => {
    field.addEventListener("keypress", (e) => {
      const char = String.fromCharCode(e.which);
      if (!/[A-Za-z ]/.test(char)) {
        e.preventDefault();
      }
    });

    // Also prevent paste of non-alphabetic characters
    field.addEventListener("paste", (e) => {
      const pasteData = e.clipboardData.getData("text");
      if (!/^[A-Za-z ]+$/.test(pasteData)) {
        e.preventDefault();
      }
    });
  });

  // Restrict phone input to numbers and special characters
  document.querySelector("#phone")?.addEventListener("keypress", (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9+\-\s()]/.test(char)) {
      e.preventDefault();
    }
  });

  document.querySelector("#phone")?.addEventListener("paste", (e) => {
    const pasteData = e.clipboardData.getData("text");
    if (!/^[0-9+\-\s()]+$/.test(pasteData)) {
      e.preventDefault();
    }
  });
}
