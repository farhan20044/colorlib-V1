document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 0
  const sections = document.querySelectorAll(".content section")
  const steps = document.querySelectorAll(".steps li")
  const nextButton = document.querySelector(".actions a[href='#next']")
  const prevButton = document.querySelector(".actions a[href='#previous']")
  const finishButton = document.querySelector(".actions a[href='#finish']")
  const actionItems = document.querySelectorAll(".actions li")
  const actionsDiv = document.querySelector(".actions.clearfix")

  // Show the current step & hide others
  function showStep(step) {
    sections.forEach((section, index) => {
      section.style.display = index === step ? "block" : "none"
      section.classList.toggle("last-step-active", index === step && index === sections.length - 1)
    })

    steps.forEach((stepItem, index) => {
      const img = stepItem.querySelector("img:first-of-type")
      if (img) {
        img.src = `../images/step-${index + 1}${index === step ? "-active" : ""}.png`
      }

      stepItem.classList.toggle("current", index === step)
      stepItem.classList.toggle("done", index < step)
    })

    prevButton.parentElement.style.visibility = "visible"

    if (step === 0) {
      prevButton.parentElement.classList.add("disabled")
      prevButton.style.opacity = "0.5"
      prevButton.style.cursor = "not-allowed"
    } else {
      prevButton.parentElement.classList.remove("disabled")
      prevButton.style.opacity = "1"
      prevButton.style.cursor = "pointer"
    }

    if (step === sections.length - 1) {
      prevButton.parentElement.style.display = "none"
      nextButton.innerHTML = "Proceed to Checkout"
      actionsDiv.style.display = "flex"
      actionsDiv.style.alignItems = "center"
      actionsDiv.style.justifyContent = "center"
      nextButton.classList.add("finish-btn")
      nextButton.style.width = "234px"
    } else {
      prevButton.parentElement.style.display = "block"
      nextButton.innerHTML = "Continue"
      actionsDiv.style.display = "inline-flex"
      actionsDiv.style.justifyContent = "space-between"
      nextButton.classList.remove("finish-btn")
      nextButton.style.width = "132px"
    }
  }

  steps.forEach((step, index) => {
    const link = step.querySelector("a")
    link.addEventListener("click", (e) => {
      e.preventDefault()
    })
  })

  // Validate all required fields in current step
  function validateCurrentStep() {
    const currentSection = sections[currentStep]
    const inputs = currentSection.querySelectorAll("input")
    let isValid = true

    currentSection.querySelectorAll(".error-message").forEach((el) => el.remove())
    inputs.forEach((input) => input.classList.remove("is-invalid"))

    inputs.forEach((input) => {
      if (input.id === "city") {
        if (input.value.trim() && !/^[A-Za-z ]+$/.test(input.value.trim())) {
          input.classList.add("is-invalid")
          const errorMsg = document.createElement("div")
          errorMsg.className = "error-message"
          errorMsg.textContent = "Only letters allowed"
          input.parentNode.insertBefore(errorMsg, input.nextSibling)
          isValid = false
        }
        return
      }

      if (!input.value.trim()) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = "This field is required"
        input.parentNode.insertBefore(errorMsg, input.nextSibling)
        isValid = false
      }

      if (input.id === "email" && input.value.trim() && !validateEmail(input.value)) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = "Please enter a valid email"
        input.parentNode.insertBefore(errorMsg, input.nextSibling)
        isValid = false
      }

      // for names, state (only letters)
      if (
        (input.id === "fname" || input.id === "lname" || input.id === "state" || input.id === "country") &&
        input.value.trim() &&
        !/^[A-Za-z ]+$/.test(input.value)
      ) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = "Only letters allowed"
        input.parentNode.insertBefore(errorMsg, input.nextSibling)
        isValid = false
      }

      if (input.id === "phone" && input.value.trim() && !/^[0-9]+$/.test(input.value)) {
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = "Only numbers allowed"
        input.parentNode.insertBefore(errorMsg, input.nextSibling)
        isValid = false
      }
    })

    // (section 2) 
    if (currentStep === 1) {
      const currentPass = currentSection.querySelector("#current-pass")?.value
      const enterCurrentPass = currentSection.querySelector("input[placeholder='Enter Current Password']")?.value
      const newPass = currentSection.querySelector("#new-pass")?.value
      const confirmPass = currentSection.querySelector("#confirm-pass")?.value

      // Check if current password fields match
      if (currentPass && enterCurrentPass && currentPass !== enterCurrentPass) {
        isValid = false
        currentSection
          .querySelectorAll("#current-pass, input[placeholder='Enter Current Password']")
          .forEach((input) => {
            input.classList.add("is-invalid")
            const errorMsg = document.createElement("div")
            errorMsg.className = "error-message"
            errorMsg.textContent = "Current passwords must match"
            input.parentNode.insertBefore(errorMsg, input.nextSibling)
          })
      }

      if (newPass && confirmPass && newPass !== confirmPass) {
        isValid = false
        currentSection.querySelectorAll("#new-pass, #confirm-pass").forEach((input) => {
          input.classList.add("is-invalid")
          const errorMsg = document.createElement("div")
          errorMsg.className = "error-message"
          errorMsg.textContent = "New passwords don't match"
          input.parentNode.insertBefore(errorMsg, input.nextSibling)
        })
      }

      if (currentPass && newPass && currentPass === newPass) {
        isValid = false
        const input = currentSection.querySelector("#new-pass")
        input.classList.add("is-invalid")
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.textContent = "New password must be different from current password"
        input.parentNode.insertBefore(errorMsg, input.nextSibling)
      }
    }

    // Scroll to first invalid field
    const firstInvalid = currentSection.querySelector(".is-invalid")
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    return isValid
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Function to reset all form data
  function resetFormData() {
    document.querySelectorAll("input").forEach((input) => {
      if (input.type === "radio") {
        if (input.defaultChecked) {
          input.checked = true
        } else {
          input.checked = false
        }
      } else if (input.type === "number") {
        if (input.classList.contains("qty")) {
          input.value = "1"
        } else {
          input.value = ""
        }
      } else {
        input.value = ""
      }
    })

    // Reset product quantities and update totals
    document.querySelectorAll("#wizard-p-2 .qty").forEach((input) => {
      input.value = "1"
    })

    document.querySelectorAll("#wizard-p-2 .qty").forEach((input) => {
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
      const price = Number.parseFloat(row.querySelector(".product-detail span:nth-child(3)")?.textContent || "0")
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
    const subtotal =
      document
        .querySelector("#wizard-p-3 .cart-subtotal:not(.shipping) td .woocommerce-Price-amount.amount")
        ?.textContent.replace(/[^0-9.]/g, "") || "0"

    const total =
      document
        .querySelector("#wizard-p-3 .order-total td .woocommerce-Price-amount.amount")
        ?.textContent.replace(/[^0-9.]/g, "") || "0"

    const formData = {
      firstName: document.getElementById("fname")?.value || "",
      lastName: document.getElementById("lname")?.value || "",
      email: document.getElementById("email")?.value || "",
      userid: randomUserId,
      Country: document.getElementById("country")?.value || "",
      state: document.getElementById("state")?.value || "",
      city: document.getElementById("city")?.value || "",
      phoneNumber: document.getElementById("phone")?.value || "",
      referenceid: randomReferenceId,
      curentPassword: document.getElementById("current-pass")?.value || "",
      password: document.getElementById("new-pass")?.value || "",
      cartItems: cartItems,
      subtotal: subtotal,
      total: total,
    }

    return formData
  }

  // Function to upload form data to the API
  async function uploadFormData() {
    try {
      const formData = collectFormData()
      nextButton.innerHTML = "Uploading..."
      nextButton.disabled = true

      console.log("Sending data to API:", JSON.stringify(formData, null, 2))

      const response = await fetch("https://680835e3942707d722dd9290.mockapi.io/api/formdata/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Raw API response:", response)

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
        nextButton.innerHTML = "Continue"
        nextButton.disabled = false
        successMsg.remove()
      }, 2000)

      return true
    } catch (error) {
      console.error("Error uploading form data:", error)

      const errorMsg = document.createElement("div")
      errorMsg.className = "error-message"
      errorMsg.innerHTML = `
      <p>Error uploading form data:</p>
      <p>${error.message}</p>
      <button id="retry-upload" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Retry Upload</button>
      <button id="test-api" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Test API Connection</button>
    `
      errorMsg.style.color = "red"
      errorMsg.style.padding = "10px"
      errorMsg.style.marginTop = "10px"
      errorMsg.style.textAlign = "center"
      errorMsg.style.fontWeight = "bold"
      errorMsg.style.backgroundColor = "#ffebee"
      errorMsg.style.borderRadius = "4px"

      const currentSection = sections[currentStep]
      currentSection.appendChild(errorMsg)

      // Add event listeners for retry and test buttons
      document.getElementById("retry-upload").addEventListener("click", async () => {
        errorMsg.remove()
        await uploadFormData()
      })

      document.getElementById("test-api").addEventListener("click", async () => {
        await testApiConnection()
      })

      // Reset button
      nextButton.innerHTML = "Proceed to Checkout"
      nextButton.disabled = false

      return false
    }
  }

  // Function to test API connection
  async function testApiConnection() {
    try {
      // Create a small test object that matches the expected format
      const testData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        userid: 99,
        Country: "Test Country",
        state: "Test State",
        city: "Test City",
        phoneNumber: "1234567890",
        referenceid: 99,
        curentPassword: "testpass",
        password: "newpass",
        cartItems: [
          {
            productName: "Test Product",
            price: 10,
            quantity: 1,
            totalPrice: 10,
          },
        ],
        subtotal: "10.00",
        total: "15.60",
        timestamp: new Date().toISOString(),
      }

      // Show testing message
      const testingMsg = document.createElement("div")
      testingMsg.className = "testing-message"
      testingMsg.textContent = "Testing API connection..."
      testingMsg.style.color = "blue"
      testingMsg.style.padding = "10px"
      testingMsg.style.marginTop = "10px"
      testingMsg.style.textAlign = "center"
      testingMsg.style.fontWeight = "bold"

      const currentSection = sections[currentStep]
      currentSection.appendChild(testingMsg)

      // Try the endpoint
      const endpoint = "https://680835e3942707d722dd9290.mockapi.io/api/formdata/data"

      console.log("Testing API with data:", JSON.stringify(testData, null, 2))

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      // Remove testing message
      testingMsg.remove()

      if (response.ok) {
        const responseData = await response.json()
        console.log("API test successful, response:", responseData)

        // Show success message with the working endpoint
        const successMsg = document.createElement("div")
        successMsg.className = "success-message"
        successMsg.innerHTML = `
          <p>API connection successful!</p>
          <p>Working endpoint: ${endpoint}</p>
          <p>Response ID: ${responseData.id}</p>
        `
        successMsg.style.color = "green"
        successMsg.style.padding = "10px"
        successMsg.style.marginTop = "10px"
        successMsg.style.textAlign = "center"
        successMsg.style.fontWeight = "bold"
        successMsg.style.backgroundColor = "#e8f5e9"
        successMsg.style.borderRadius = "4px"

        currentSection.appendChild(successMsg)

        // Remove success message after a delay
        setTimeout(() => {
          successMsg.remove()
        }, 5000)
      } else {
        console.error("API test failed:", response.status, response.statusText)

        // Show error message
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.innerHTML = `
          <p>API connection failed with status: ${response.status} ${response.statusText}</p>
          <p>Please check if the API is available and accessible.</p>
          <p>You may need to check CORS settings or API permissions.</p>
        `
        errorMsg.style.color = "red"
        errorMsg.style.padding = "10px"
        errorMsg.style.marginTop = "10px"
        errorMsg.style.textAlign = "center"
        errorMsg.style.fontWeight = "bold"
        errorMsg.style.backgroundColor = "#ffebee"
        errorMsg.style.borderRadius = "4px"

        currentSection.appendChild(errorMsg)

        // Remove error message after a delay
        setTimeout(() => {
          errorMsg.remove()
        }, 5000)
      }
    } catch (error) {
      console.error("Error testing API connection:", error)

      // Show error message
      const errorMsg = document.createElement("div")
      errorMsg.className = "error-message"
      errorMsg.innerHTML = `
        <p>Error testing API connection:</p>
        <p>${error.message}</p>
        <p>This might be a network issue or CORS restriction.</p>
      `
      errorMsg.style.color = "red"
      errorMsg.style.padding = "10px"
      errorMsg.style.marginTop = "10px"
      errorMsg.style.textAlign = "center"
      errorMsg.style.fontWeight = "bold"
      errorMsg.style.backgroundColor = "#ffebee"
      errorMsg.style.borderRadius = "4px"

      const currentSection = sections[currentStep]
      currentSection.appendChild(errorMsg)

      // Remove error message after a delay
      setTimeout(() => {
        errorMsg.remove()
      }, 5000)
    }
  }

  nextButton.addEventListener("click", async (event) => {
    event.preventDefault()

    if (validateCurrentStep()) {
      if (currentStep < sections.length - 1) {
        currentStep++
        showStep(currentStep)
      } else if (currentStep === sections.length - 1) {
        // Upload form data to the API when on the last step
        await uploadFormData()
      }
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

  finishButton.addEventListener("click", (event) => {
    event.preventDefault()
    if (validateCurrentStep()) {
      resetFormData()
      currentStep = 0
      showStep(currentStep)
    }
  })

  // step indicators clickable
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index < currentStep) {
        currentStep = index
        showStep(currentStep)
      } else if (index === currentStep + 1) {
        if (validateCurrentStep()) {
          currentStep = index
          showStep(currentStep)
        }
      }
    })
  })

  // Clear errors when user starts typing
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.remove("is-invalid")
      const errorMessage = this.nextElementSibling
      if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.remove()
      }
    })
  })

  // Prevent non-alphabetic in name, state, and city fields
  document.querySelectorAll("#fname, #lname, #state, #city, #country").forEach((field) => {
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

  document.querySelector("#phone").addEventListener("keypress", (e) => {
    const char = String.fromCharCode(e.which)
    if (!/[0-9+-\s()]/.test(char)) {
      e.preventDefault()
    }
  })

  document.querySelector("#phone").addEventListener("paste", (e) => {
    const pasteData = e.clipboardData.getData("text")
    if (!/^[0-9+-\s()]+$/.test(pasteData)) {
      e.preventDefault()
    }
  })

  // CART
  const products = [
    { name: "Cherry", price: 35 },
    { name: "Mango", price: 20 },
  ]

  const shippingOptions = {
    free: 0,
    local: 5,
  }

  function updateCartTotals() {
    let subtotal = 0

    document.querySelectorAll("#wizard-p-2 #shop_table tbody tr").forEach((row, index) => {
      const quantityInput = row.querySelector(".qty")
      const quantity = Number.parseInt(quantityInput.value) || 0
      subtotal += quantity * products[index].price
    })

    const serviceFee = 5.6

    const total = subtotal + serviceFee

    const subtotalElement = document.querySelector(
      "#wizard-p-3 .cart-subtotal:not(.shipping) td .woocommerce-Price-amount.amount",
    )
    if (subtotalElement) {
      subtotalElement.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${subtotal.toFixed(2)}`
    }

    const serviceFeeElement = document.querySelector(
      "#wizard-p-3 tr.cart-subtotal:nth-child(3) td .woocommerce-Price-amount.amount",
    )
    if (serviceFeeElement) {
      serviceFeeElement.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${serviceFee.toFixed(2)}`
    }

    const totalElement = document.querySelector("#wizard-p-3 .order-total td .woocommerce-Price-amount.amount")
    if (totalElement) {
      totalElement.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${total.toFixed(2)}`
    }
  }

  // Update individual row total
  function updateRowTotal(input) {
    const row = input.closest("tr")
    const price = products[Array.from(document.querySelectorAll("#wizard-p-2 #shop_table tbody tr")).indexOf(row)].price
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
      document.querySelectorAll("#wizard-p-2 .qty").forEach((input) => {
        input.classList.add("is-invalid")
      })
    }

    return isValid
  }

  // Wrap the original showStep function
  const originalShowStep = showStep
  showStep = (step) => {
    originalShowStep(step)

    if (step === 3) {
      updateCartTotals()
    }
  }

  // Wrap the original validateCurrentStep function
  const originalValidateCurrentStep = validateCurrentStep
  validateCurrentStep = () => {
    if (currentStep === 2) {
      return validateSection3()
    }
    return originalValidateCurrentStep()
  }

  setupQuantityHandlers()

  // Initialize shipping options
  document.querySelectorAll("#wizard-p-3 input[name='shipping']").forEach((radio) => {
    radio.addEventListener("change", () => {
      updateCartTotals()
    })
  })

  showStep(currentStep)
  updateCartTotals()
})
