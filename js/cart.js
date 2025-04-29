import { products, SERVICE_FEE, VALIDATE_MESSAGE } from "./constants.js"

export function updateCartTotals() {
  let subtotal = 0

  document.querySelectorAll("#wizard-p-2 #shop_table tbody tr").forEach((row, index) => {
    const quantityInput = row.querySelector(".qty")
    const quantity = Number.parseInt(quantityInput.value) || 0
    const price = products[index]?.price || 0
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
export function updateRowTotal(input) {
  const row = input.closest("tr")
  const index = Array.from(document.querySelectorAll("#wizard-p-2 #shop_table tbody tr")).indexOf(row)
  const price = products[index]?.price || 0
  const quantity = Number.parseInt(input.value) || 0
  const total = price * quantity

  const totalPriceElement = row.querySelector(".total-price span.amount")
  if (totalPriceElement) {
    totalPriceElement.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${total.toFixed(2)}`
  }
}

// Setup quantity change handlers
export function setupQuantityHandlers() {
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
export function validateSection3() {
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
    errorMsg.textContent = VALIDATE_MESSAGE.CART_EMPTY
    errorMsg.style.color = "red"
    errorMsg.style.textAlign = "center"
    errorMsg.style.marginTop = "0px"
    section.appendChild(errorMsg)
  }

  return isValid
}

export function setupShippingOptions() {
  // Initialize shipping options
  document.querySelectorAll("#wizard-p-3 input[name='shipping']").forEach((radio) => {
    radio.addEventListener("change", () => {
      updateCartTotals()
    })
  })
}
