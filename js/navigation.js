import { STEP_NAMES, BUTTON_TEXT } from './constants.js';
import { validateCurrentStep } from './validation.js';
import { updateCartTotals } from './cart.js';
const wrapper = document.querySelector('.wrapper');
let currentStep = STEP_NAMES.BASIC_DETAILS;
let sections;
let steps;
let nextButton;
let prevButton;
let finishButton;
let actionsDiv;
let ulElement;

export function initNavigation() {
  sections = document.querySelectorAll(".content section");
  steps = document.querySelectorAll(".steps li");
  nextButton = document.querySelector(".actions a[href='#next']");
  prevButton = document.querySelector(".actions a[href='#previous']");
  finishButton = document.querySelector(".actions a[href='#finish']");
  actionsDiv = document.querySelector(".actions.clearfix");
  ulElement = document.querySelector('.actions ul[role="menu"]');

  
  
  showStep(currentStep);
}

export function getCurrentStep() {
  return currentStep;
}

export function setCurrentStep(step) {
  currentStep = step;
}

export function navigateToStep(stepIndex) {
  if (stepIndex === currentStep) return;

  if (stepIndex < currentStep) {
    currentStep = stepIndex;
    showStep(currentStep);
    return;
  }

  for (let i = 0; i < stepIndex; i++) {
    if (i <= currentStep) {
      const tempStep = currentStep;
      currentStep = i;
      if (!validateCurrentStep()) {
        currentStep = tempStep;
        return false;
      }
      currentStep = tempStep;
    }
  }

  currentStep = stepIndex;
  showStep(currentStep);
  return true;
}

export function showStep(step) {
  sections.forEach((section, index) => {
    section.style.display = index === step ? "block" : "none";
    section.setAttribute("aria-hidden", index !== step);
  });

  steps.forEach((stepItem, index) => {
    const img = stepItem.querySelector("img:first-of-type");
    if (img) {
      if (index === step) {
        img.src = `../images/step-${index + 1}-active.png`;
      } else {
        img.src = `../images/step-${index + 1}.png`;
      }
    }

    stepItem.classList.toggle("current", index === step);
    stepItem.classList.toggle("done", index < step);
    stepItem.setAttribute("aria-selected", index === step);
    stepItem.setAttribute("aria-disabled", index > step);
  });

  // Reset the actions div styling to maintain consistent height
  actionsDiv.style.marginTop = "";
  nextButton.style.position = "";
  nextButton.style.margin = "";
  ulElement.style.display = "";
  ulElement.style.justifyContent = "";

  // Apply specific styles based on current step
  if (step === STEP_NAMES.BASIC_DETAILS || step === STEP_NAMES.CHANGE_PASSWORD) {
    // Ensure consistent height for pages 1 and 2
    actionsDiv.style.height = "auto";
    actionsDiv.style.marginTop = "10px";
  } else if (step === STEP_NAMES.CART) {
    actionsDiv.style.marginTop = "30px";
  }

  if (step === STEP_NAMES.BASIC_DETAILS) {
    prevButton.parentElement.classList.add("disabled");
    prevButton.style.opacity = "0.5";
    prevButton.style.cursor = "not-allowed";
    prevButton.style.display = "flex";
  } else {
    prevButton.parentElement.classList.remove("disabled");
    prevButton.style.opacity = "1";
    prevButton.style.cursor = "pointer";
    prevButton.style.display = "flex";
  }

  if (step === STEP_NAMES.BILL) {
    nextButton.innerHTML = BUTTON_TEXT.CHECKOUT;
    nextButton.classList.add("finish-btn");
    nextButton.style.width = "234px";
    prevButton.classList.add("d-none");
    ulElement.style.display = "contents";
    wrapper.style.marginTop = "6px";

    // Update cart totals when showing the last step
    updateCartTotals();
  } else {
    nextButton.innerHTML = BUTTON_TEXT.CONTINUE;
    nextButton.classList.remove("finish-btn");
    nextButton.style.width = "132px";
    prevButton.classList.remove("d-none");
    wrapper.style.marginTop = "";
  }
}

export function getFormElements() {
  return {
    sections,
    steps,
    nextButton,
    prevButton,
    finishButton,
    actionsDiv,
    ulElement
  };
}
