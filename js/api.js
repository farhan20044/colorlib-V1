import { API_URL, BUTTON_TEXT } from "./constants.js"
import { setCurrentStep, showStep } from "./navigation.js"
import { updateCartTotals, updateRowTotal } from "./cart.js"

export function resetFormData() {
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

export function collectFormData() {
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

// Upload form data to the mookAPI
export async function uploadFormData() {
  try {
    const formData = collectFormData()
    const nextButton = document.querySelector(".actions a[href='#next']")

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

    const currentSection = document.querySelector(".content section[style*='block']")
    currentSection.appendChild(successMsg)

    setTimeout(() => {
      resetFormData()
      setCurrentStep(0)
      showStep(0)
      nextButton.innerHTML = BUTTON_TEXT.CONTINUE
      nextButton.disabled = false
      nextButton.style.cursor = "pointer"
      nextButton.style.pointerEvents = "auto"
      successMsg.remove()
    }, 2000)

    return true
  } catch (error) {
    console.error("Error uploading form data:", error)
    const nextButton = document.querySelector(".actions a[href='#next']")

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

    const currentSection = document.querySelector(".content section[style*='block']")
    currentSection.appendChild(errorMsg)

    setTimeout(() => {
      errorMsg.remove()
    }, 1000)

    return false
  }
}
