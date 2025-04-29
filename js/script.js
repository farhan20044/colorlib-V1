import { BUTTON_TEXT } from "./constants"

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://680835e3942707d722dd9290.mockapi.io/api/formdata/data"
  const SERVICE_FEE = 5.6

  // PRODUCTS
  const PRODUCTS = [
    { name: "Cherry", price: 35 },
    { name: "Mango", price: 20 },
  ]

  const STEP_NAMES = {
    BASIC_DETAILS: 0,
    CHANGE_PASSWORD: 1,
    CART: 2,
    BILL: 3,
  }

  const VALIDATION_MESSAGES = {
    REQUIRED: "This field is required",
    LETTERS_ONLY: "Only letters allowed",
    NUMBERS_ONLY: "Only numbers allowed",
    EMAIL_INVALID: "Please enter a valid email",
    PASSWORDS_MATCH: "Current passwords must match",
    NEW_PASSWORDS_MATCH: "New passwords don't match",
    PASSWORD_DIFFERENT: "New password must be different from current password",
    CART_EMPTY: "Please add at least one product to your cart",
  }

  const BUTTON_TEXT = {
    CONTINUE: "Continue",
    CHECKOUT: "Proceed to Checkout",
    UPLOADING: "Uploading...",
  }

  let currentStep = STEP_NAMES.BASIC_DETAILS
  const sections = document.querySelectorAll(".content section")
  const steps = document.querySelectorAll(".steps li")
  const nextButton = document.querySelector(".actions a[href='#next']")
  const prevButton = document.querySelector(".actions a[href='#previous']")
  const finishButton = document.querySelector(".actions a[href='#finish']")
  const actionsDiv = document.querySelector(".actions.clearfix")
  const ulElement = document.querySelector('.actions ul[role="menu"]')

  // Function to handle step navigation
  function navigateToStep(stepIndex) {
    if (stepIndex === currentStep) return

    if (stepIndex < currentStep) {
      currentStep = stepIndex
      showStep(currentStep)
      return
    }

    for (let i = 0; i < stepIndex; i++) {
      if (i <= currentStep) {
        const tempStep = currentStep
        currentStep = i
        if (!validateCurrentStep()) {
          currentStep = tempStep
          return false
        }
        currentStep = tempStep
      }
    }

    currentStep = stepIndex
    showStep(currentStep)
    return true
  }

  // Show the current step & hide others
  function showStep(step) {
    sections.forEach((section, index) => {
      section.style.display = index === step ? "block" : "none"
      section.setAttribute("aria-hidden", index !== step)
    })

    steps.forEach((stepItem, index) => {
      const img = stepItem.querySelector("img:first-of-type")
      if (img) {
        if (index === step) {
          img.src = `../images/step-${index + 1}-active.png`
        } else {
          img.src = `../images/step-${index + 1}.png`
        }
      }

      stepItem.classList.toggle("current", index === step)
      stepItem.classList.toggle("done", index < step)
      stepItem.setAttribute("aria-selected", index === step)
      stepItem.setAttribute("aria-disabled", index > step)
    })

    // Reset the actions div styling to maintain consistent height
    actionsDiv.style.marginTop = ""
    nextButton.style.position = ""
    nextButton.style.margin = ""
    ulElement.style.display = ""
    ulElement.style.justifyContent = ""

    // Apply specific styles based on current step
    if (step === STEP_NAMES.BASIC_DETAILS || step === STEP_NAMES.CHANGE_PASSWORD) {
      // Ensure consistent height for pages 1 and 2
      actionsDiv.style.height = "auto"
      actionsDiv.style.marginTop = "10px"
    } else if (step === STEP_NAMES.CART) {
      actionsDiv.style.marginTop = "30px"
    }

    if (step === STEP_NAMES.BASIC_DETAILS) {
      prevButton.parentElement.classList.add("disabled")
      prevButton.style.opacity = "0.5"
      prevButton.style.cursor = "not-allowed"
      prevButton.style.display = "flex"
    } else {
      prevButton.parentElement.classList.remove("disabled")
      prevButton.style.opacity = "1"
      prevButton.style.cursor = "pointer"
      prevButton.style.display = "flex"
    }

    if (step === STEP_NAMES.BILL) {
      nextButton.innerHTML = BUTTON_TEXT.CHECKOUT
      nextButton.classList.add("finish-btn")
      nextButton.style.width = "234px"
      prevButton.classList.add("d-none")
      ulElement.style.display = "contents"

      // Update cart totals when showing the last step
      updateCartTotals()
    } else {
      nextButton.innerHTML = BUTTON_TEXT.CONTINUE
      nextButton.classList.remove("finish-btn")
      nextButton.style.width = "132px"
      prevButton.classList.remove("d-none")
    }
  }

  // Validate all required fields in current step
  function validateCurrentStep() {
    const currentSection = sections[currentStep]
    const inputs = currentSection.querySelectorAll("input")
    let isValid = true

    // Remove existing error messages
    currentSection.querySelectorAll(".error-message").forEach((el) => el.remove())
    inputs.forEach((input) => input.classList.remove("is-invalid"))

    // For cart validation (step 3)
    if (currentStep === STEP_NAMES.CART) {
      return validateSection3()
    }

    inputs.forEach((input) => {
      // Skip reference code as it's optional
      if (input.id === "refcode") return

      if (input.hasAttribute("required") && !input.value.trim()) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = VALIDATION_MESSAGES.REQUIRED
        errorMsg.style.color = "red"
        errorMsg.style.fontSize = "12px"
        errorMsg.style.marginTop = "0px"
        input.parentNode.appendChild(errorMsg)
        isValid = false
      }

      if (input.id === "email" && input.value.trim() && !validateEmail(input.value)) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = VALIDATION_MESSAGES.EMAIL_INVALID
        errorMsg.style.color = "red"
        errorMsg.style.fontSize = "12px"
        errorMsg.style.marginTop = "0px"
        input.parentNode.appendChild(errorMsg)
        isValid = false
      }

      // For names, state, country (only letters)
      if (
        (input.id === "name" || input.id === "fullname" || input.id === "state" || input.id === "country") &&
        input.value.trim() &&
        !/^[A-Za-z ]+$/.test(input.value)
      ) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = VALIDATION_MESSAGES.LETTERS_ONLY
        errorMsg.style.color = "red"
        errorMsg.style.fontSize = "12px"
        errorMsg.style.marginTop = "0px"
        input.parentNode.appendChild(errorMsg)
        isValid = false
      }

      if (input.id === "phone" && input.value.trim() && !/^[0-9+\-\s()]+$/.test(input.value)) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = VALIDATION_MESSAGES.NUMBERS_ONLY
        errorMsg.style.color = "red"
        errorMsg.style.fontSize = "12px"
        errorMsg.style.marginTop = "0px"
        input.parentNode.appendChild(errorMsg)
        isValid = false
      }
    })

    // Password validation (step 2)
    if (currentStep === STEP_NAMES.CHANGE_PASSWORD) {
      const currentPass = currentSection.querySelector("#current-pass")?.value
      const enterCurrentPass = currentSection.querySelector("#enter-current-pass")?.value
      const newPass = currentSection.querySelector("#new-pass")?.value
      const confirmPass = currentSection.querySelector("#confirm-pass")?.value

      // Check if current password fields match
      if (currentPass && enterCurrentPass && currentPass !== enterCurrentPass) {
        isValid = false
        currentSection.querySelectorAll("#current-pass, #enter-current-pass").forEach((input) => {
          input.classList.add("is-invalid")
          const errorMsg = document.createElement("div")
          errorMsg.className = "error-message"
          errorMsg.textContent = VALIDATION_MESSAGES.PASSWORDS_MATCH
          errorMsg.style.color = "red"
          errorMsg.style.fontSize = "12px"
          errorMsg.style.marginTop = "0px"
          input.parentNode.appendChild(errorMsg)
        })
      }

      if (newPass && confirmPass && newPass !== confirmPass) {
        isValid = false
        currentSection.querySelectorAll("#new-pass, #confirm-pass").forEach((input) => {
          input.classList.add("is-invalid")
          const errorMsg = document.createElement("div")
          errorMsg.className = "error-message"
          errorMsg.textContent = VALIDATION_MESSAGES.NEW_PASSWORDS_MATCH
          errorMsg.style.color = "red"
          errorMsg.style.fontSize = "12px"
          errorMsg.style.marginTop = "0px"
          input.parentNode.appendChild(errorMsg)
        })
      }

      if (currentPass && newPass && currentPass === newPass) {
        isValid = false
        const input = currentSection.querySelector("#new-pass")
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = VALIDATION_MESSAGES.PASSWORD_DIFFERENT
        errorMsg.style.color = "red"
        errorMsg.style.fontSize = "12px"
        errorMsg.style.marginTop = "0px"
        input.parentNode.appendChild(errorMsg)
      }
    }

    return isValid
  }

  // Email validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Function to reset all form data
  function resetFormData() {
    document.querySelectorAll("input").forEach((input) => {
      if (input.type === "radio") {
        input.checked = input.defaultChecked
      } else if (input.type === "number" && input.classList.contains("qty")) {
        input.value = "1"
      } else {
        input.value = ""
      }
    })

    // Reset product quantities and update totals
    document.querySelectorAll("#wizard-p-2 .qty").forEach((input) => {
      input.value = "1"
      updateRowTotal(input)
    })

    updateCartTotals()
  }

  function collectFormData() {
    const randomUserId = Math.floor(Math.random() * 100) + 1
    const randomReferenceId = Math.floor(Math.random() * 100) + 1

    const cartItems = []
    document.querySelectorAll("#wizard-p-2 #shop_table tbody tr").forEach((row, index) => {
      const productName = row.querySelector(".product-detail a")?.textContent || ""
      const priceText = row.querySelector(".product-detail span:nth-child(3)")?.textContent || "0"
      const price = Number.parseFloat(priceText.replace("$", ""))
      const quantity = Number.parseInt(row.querySelector(".qty")?.value || "0")
      const totalPrice = price * quantity

      cartItems.push({
        productName,
        price,
        quantity,
        totalPrice,
      })
    })

    // Get subtotal and total from the summary section
    const subtotal = document.querySelector(".subtotal-amount")?.textContent || "0"
    const total = document.querySelector(".total-amount")?.textContent || "0"

    const formData = {
      firstName: document.getElementById("name")?.value || "",
      lastName: document.getElementById("fullname")?.value || "",
      email: document.getElementById("email")?.value || "",
      userid: document.getElementById("userid")?.value || randomUserId,
      Country: document.getElementById("country")?.value || "",
      state: document.getElementById("state")?.value || "",
      city: document.getElementById("city")?.value || "",
      phoneNumber: document.getElementById("phone")?.value || "",
      referenceid: document.getElementById("refcode")?.value || randomReferenceId,
      curentPassword: document.getElementById("current-pass")?.value || "",
      password: document.getElementById("new-pass")?.value || "",
      cartItems: cartItems,
      subtotal: subtotal,
      total: total,
    }

    return formData
  }

  // Upload form data to the API
  async function uploadFormData() {
    try {
      const formData = collectFormData()
      nextButton.innerHTML = BUTTON_TEXT.UPLOADING
      nextButton.disabled = true
      nextButton.style.cursor = "not-allowed"
      nextButton.style.pointerEvents = "none"

      console.log("Sending data to API:", JSON.stringify(formData, null, 2))

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Form data uploaded successfully:", result)

      const successMsg = document.createElement("div")
      successMsg.className = "success-message"
      successMsg.textContent = "Form data uploaded successfully!"
      successMsg.style.color = "green"
      successMsg.style.padding = "10px"
      successMsg.style.marginTop = "10px"
      successMsg.style.textAlign = "center"
      successMsg.style.fontWeight = "bold"
      successMsg.style.backgroundColor = "#e8f5e9"
      successMsg.style.borderRadius = "4px"

      const currentSection = sections[currentStep]
      currentSection.appendChild(successMsg)

      setTimeout(() => {
        resetFormData()
        currentStep = 0
        showStep(currentStep)
        nextButton.innerHTML = BUTTON_TEXT.CONTINUE
        nextButton.disabled = false
        nextButton.style.cursor = "pointer"
        nextButton.style.pointerEvents = "auto"
        successMsg.remove()
      }, 2000)

      return true
    } catch (error) {
      console.error("Error uploading form data:", error)

      // Reset button state
      nextButton.innerHTML = BUTTON_TEXT.CHECKOUT
      nextButton.disabled = false
      nextButton.style.cursor = "pointer"
      nextButton.style.pointerEvents = "auto"

      // Show error message
      const errorMsg = document.createElement("div")
      errorMsg.className = "error-message"
      errorMsg.textContent = "Failed to upload data. Please make sure you're connected to the internet."
      errorMsg.style.color = "white"
      errorMsg.style.padding = "10px"
      errorMsg.style.marginTop = "10px"
      errorMsg.style.textAlign = "center"
      errorMsg.style.fontWeight = "bold"
      errorMsg.style.backgroundColor = "#f44336"
      errorMsg.style.borderRadius = "4px"

      const currentSection = sections[currentStep]
      currentSection.appendChild(errorMsg)

      setTimeout(() => {
        errorMsg.remove()
      }, 1000)

      return false
    }
  }

  // Event listeners for navigation buttons
  nextButton.addEventListener("click", async (event) => {
    event.preventDefault()

    if (currentStep === sections.length - 1) {
      await uploadFormData()
    } else if (validateCurrentStep()) {
      navigateToStep(currentStep + 1)
    }
  })

  prevButton.addEventListener("click", (event) => {
    event.preventDefault()
    // Only allow going back if not on the first step
    if (currentStep > 0) {
      currentStep--
      showStep(currentStep)
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

  // Clear errors when user starts typing
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.remove("is-invalid")
      const errorMessage = this.parentNode.querySelector(".error-message")
      if (errorMessage) {
        errorMessage.remove()
      }
    })
  })

  // Prevent non-alphabetic in name, state, and city fields
  document.querySelectorAll("#name, #fullname, #state, #city, #country").forEach((field) => {
    field.addEventListener("keypress", (e) => {
      const char = String.fromCharCode(e.which)
      if (!/[A-Za-z ]/.test(char)) {
        e.preventDefault()
      }
    })

    // Also prevent paste of non-alphabetic characters
    field.addEventListener("paste", (e) => {
      const pasteData = e.clipboardData.getData("text")
      if (!/^[A-Za-z ]+$/.test(pasteData)) {
        e.preventDefault()
      }
    })
  })

  // Restrict phone input to numbers and special characters
  document.querySelector("#phone")?.addEventListener("keypress", (e) => {
    const char = String.fromCharCode(e.which)
    if (!/[0-9+\-\s()]/.test(char)) {
      e.preventDefault()
    }
  })

  document.querySelector("#phone")?.addEventListener("paste", (e) => {
    const pasteData = e.clipboardData.getData("text")
    if (!/^[0-9+\-\s()]+$/.test(pasteData)) {
      e.preventDefault()
    }
  })

  // CART FUNCTIONS

  function updateCartTotals() {
    let subtotal = 0

    document.querySelectorAll("#wizard-p-2 #shop_table tbody tr").forEach((row, index) => {
      const quantityInput = row.querySelector(".qty")
      const quantity = Number.parseInt(quantityInput.value) || 0
      const price = PRODUCTS[index]?.price || 0
      subtotal += quantity * price
    })

    const serviceFee = SERVICE_FEE
    const total = subtotal + serviceFee

    // Update subtotal in cart totals
    const subtotalElement = document.querySelector(".subtotal-amount")
    if (subtotalElement) {
      subtotalElement.textContent = subtotal.toFixed(2)
    }

    // Update total in cart totals
    const totalElement = document.querySelector(".total-amount")
    if (totalElement) {
      totalElement.textContent = total.toFixed(2)
    }
  }

  // Update individual row total
  function updateRowTotal(input) {
    const row = input.closest("tr")
    const index = Array.from(document.querySelectorAll("#wizard-p-2 #shop_table tbody tr")).indexOf(row)
    const price = PRODUCTS[index]?.price || 0
    const quantity = Number.parseInt(input.value) || 0
    const total = price * quantity

    const totalPriceElement = row.querySelector(".total-price span.amount")
    if (totalPriceElement) {
      totalPriceElement.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${total.toFixed(2)}`
    }
  }

  // Setup quantity change handlers
  function setupQuantityHandlers() {
    document.querySelectorAll("#wizard-p-2 .quantity").forEach((quantityEl) => {
      const input = quantityEl.querySelector(".qty")
      const plus = quantityEl.querySelector(".plus")
      const minus = quantityEl.querySelector(".minus")

      plus.addEventListener("click", (e) => {
        e.preventDefault()
        input.value = Number.parseInt(input.value) + 1
        updateRowTotal(input)
        updateCartTotals()
      })

      minus.addEventListener("click", (e) => {
        e.preventDefault()
        const currentVal = Number.parseInt(input.value)
        if (currentVal > 0) {
          input.value = currentVal - 1
          updateRowTotal(input)
          updateCartTotals()
        }
      })

      input.addEventListener("change", function () {
        if (Number.parseInt(this.value) < 0) {
          this.value = 0
        }
        updateRowTotal(this)
        updateCartTotals()
      })
    })
  }

  // Section 3 validation
  function validateSection3() {
    let isValid = true
    const section = document.getElementById("wizard-p-2")

    section.querySelectorAll(".error-message").forEach((el) => el.remove())

    // Check if at least one product has quantity > 0
    const quantities = Array.from(document.querySelectorAll("#wizard-p-2 .qty")).map(
      (input) => Number.parseInt(input.value) || 0,
    )

    if (!quantities.some((qty) => qty > 0)) {
      isValid = false
      const errorMsg = document.createElement("div")
      errorMsg.className = "error-message"
      errorMsg.textContent = VALIDATION_MESSAGES.CART_EMPTY
      errorMsg.style.color = "red"
      errorMsg.style.textAlign = "center"
      errorMsg.style.marginTop = "0px"
      section.appendChild(errorMsg)
    }

    return isValid
  }

  // Initialize shipping options
  document.querySelectorAll("#wizard-p-3 input[name='shipping']").forEach((radio) => {
    radio.addEventListener("change", () => {
      updateCartTotals()
    })
  })

  // Initialize the quantity handlers
  setupQuantityHandlers()

  // Initialize the form
  showStep(currentStep)
  updateCartTotals()
})
