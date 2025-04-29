import { initNavigation, navigateToStep, getCurrentStep, setCurrentStep, showStep } from "./navigation.js"
import { validateCurrentStep, setupInputValidation } from "./validation.js"
import { updateCartTotals, setupQuantityHandlers, setupShippingOptions } from "./cart.js"
import { uploadFormData } from "./api.js"
import { STEP_NAMES } from "./constants.js"

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  initNavigation()

  // Setup validation handlers
  setupInputValidation()

  // Setup cart functionality
  setupQuantityHandlers()
  setupShippingOptions()

  // Initialize cart totals
  updateCartTotals()

  // Event listeners for navigation buttons
  const nextButton = document.querySelector(".actions a[href='#next']")
  const prevButton = document.querySelector(".actions a[href='#previous']")
  const steps = document.querySelectorAll(".steps li")

  nextButton.addEventListener("click", async (event) => {
    event.preventDefault()
    const currentStep = getCurrentStep()

    if (currentStep === STEP_NAMES.BILL) {
      await uploadFormData()
    } else if (validateCurrentStep()) {
      navigateToStep(currentStep + 1)
    }
  })

  prevButton.addEventListener("click", (event) => {
    event.preventDefault()
    const currentStep = getCurrentStep()
    // Only allow going back if not on the first step
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      showStep(getCurrentStep())
    }
  })

  // Add click event listeners to step navigation items
  steps.forEach((stepItem, index) => {
    const stepLink = stepItem.querySelector("a")
    stepLink.addEventListener("click", (e) => {
      e.preventDefault()
      navigateToStep(index)
    })
  })
})
