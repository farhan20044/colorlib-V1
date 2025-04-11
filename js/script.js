document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const sections = document.querySelectorAll(".content section");
    const steps = document.querySelectorAll(".steps li");
    const nextButton = document.querySelector(".actions a[href='#next']");
    const prevButton = document.querySelector(".actions a[href='#previous']");
    const finishButton = document.querySelector(".actions a[href='#finish']");
    const actionItems = document.querySelectorAll(".actions li");
    const clearFix = document.getElementsByClassName("clearfix");

    // Show the current step & hide others
    function showStep(step) {
        sections.forEach((section, index) => {
            section.style.display = index === step ? "block" : "none";
            section.classList.toggle("last-step-active", index === step && index === sections.length - 1);
        });

        steps.forEach((stepItem, index) => {
            const img = stepItem.querySelector("img:first-of-type");
            if (img) {
                img.src = `../images/step-${index + 1}${index === step ? '-active' : ''}.png`;
            }

            stepItem.classList.toggle("current", index === step);
            stepItem.classList.toggle("done", index < step);
        });

        if (step === 0) {
            prevButton.parentElement.style.visibility = "hidden";
        } else {
            prevButton.parentElement.style.visibility = "visible";
        }

        if (step === sections.length - 1) {
            nextButton.parentElement.style.display = "none";
            prevButton.parentElement.style.display = "none";
            finishButton.parentElement.style.display = "block";
            const actionsDiv = document.querySelector('.actions.clearfix');
            actionsDiv.style.display = "flex";
            actionsDiv.style.alignItems = "center";
            actionsDiv.style.justifyContent = "center";

        } else {
            nextButton.parentElement.style.display = "block";
            finishButton.parentElement.style.display = "none";
        }

    }




    steps.forEach((step, index) => {
        const link = step.querySelector("a");
        link.addEventListener("click", function (e) {
            e.preventDefault();
        });
    });

    // Validate all required fields in current step
    function validateCurrentStep() {
        const currentSection = sections[currentStep];
        const inputs = currentSection.querySelectorAll("input");
        let isValid = true;

        // Clear previous errors
        currentSection.querySelectorAll(".error-message").forEach(el => el.remove());
        inputs.forEach(input => input.classList.remove("is-invalid"));

        // Check each input
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add("is-invalid");
                // Add error message
                const errorMsg = document.createElement("div");
                errorMsg.className = "error-message";
                errorMsg.textContent = "This field is required";
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
                isValid = false;
            }

            // validation for email (I only added @ & .com)
            if (input.id === "email" && input.value.trim() && !validateEmail(input.value)) {
                input.classList.add("is-invalid");
                const errorMsg = document.createElement("div");
                errorMsg.className = "error-message";
                errorMsg.textContent = "Please enter a valid email";
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
                isValid = false;
            }

            // for names (only letters)
            if ((input.id === "fname" || input.id === "lname") && input.value.trim() && !/^[A-Za-z ]+$/.test(input.value)) {
                input.classList.add("is-invalid");
                const errorMsg = document.createElement("div");
                errorMsg.className = "error-message";
                errorMsg.textContent = "Only letters allowed";
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
                isValid = false;
            }

            if (input.id === "phone" && input.value.trim() && !/^[0-9]+$/.test(input.value)) {
                input.classList.add("is-invalid");
                const errorMsg = document.createElement("div");
                errorMsg.className = "error-message";
                errorMsg.textContent = "Only numbers allowed";
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
                isValid = false;
            }
        });

        // (section 2) password validations
        if (currentStep === 1) {
            const currentPass = currentSection.querySelector("#current-pass")?.value;
            const newPass = currentSection.querySelector("#new-pass")?.value;
            const confirmPass = currentSection.querySelector("#confirm-pass")?.value;

            // Check if passwords match (only if they're not empty)
            if (newPass && confirmPass && newPass !== confirmPass) {
                isValid = false;

                // field highlight if empty
                currentSection.querySelectorAll("#new-pass, #confirm-pass").forEach(input => {
                    input.classList.add("is-invalid");
                    const errorMsg = document.createElement("div");
                    errorMsg.className = "error-message";
                    errorMsg.textContent = "Passwords don't match";
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                });
            }

            // Check if new password is same as current password
            if (currentPass && newPass && currentPass === newPass) {
                isValid = false;
                const input = currentSection.querySelector("#new-pass");
                input.classList.add("is-invalid");
                const errorMsg = document.createElement("div");
                errorMsg.className = "error-message";
                errorMsg.textContent = "New password must be different from current password";
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        }

        // Scroll to first invalid field
        const firstInvalid = currentSection.querySelector(".is-invalid");
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return isValid;
    }

    // Email validation @ & .com 
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    nextButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (validateCurrentStep()) {
            if (currentStep < sections.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    prevButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    finishButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (validateCurrentStep()) {
            document.getElementById("wizard").submit();
        }
    });


    // step indicators clickable
    steps.forEach((step, index) => {
        step.addEventListener("click", function () {
            if (index < currentStep) {
                currentStep = index;
                showStep(currentStep);
            } else if (index === currentStep + 1) {
                if (validateCurrentStep()) {
                    currentStep = index;
                    showStep(currentStep);
                }
            }
            // Don't allow jumping ahead more than one step
        });
    });


    // Clear errors when user starts typing
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function () {
            this.classList.remove("is-invalid");
            // Remove the error message if it exists
            const errorMessage = this.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains("error-message")) {
                errorMessage.remove();
            }
        });
    });

    // Prevent non-alphabetic in name
    document.querySelectorAll("#fname, #lname").forEach(field => {
        field.addEventListener("keypress", function (e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-z ]/.test(char)) {
                e.preventDefault();
            }
        });

        field.addEventListener("keypress", function (e) {
            const char = String.fromCharCode(e.which);
            if (!/^[A-Za-z ]+$/.test(char)) {
                e.preventDefault();
            }
        });
    });

    document.querySelector("#phone").addEventListener("keypress", function (e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9+-\s()]/.test(char)) {
            e.preventDefault();
        }
    });

    document.querySelector("#phone").addEventListener("paste", function (e) {
        const pasteData = e.clipboardData.getData("text");
        if (!/^[0-9+-\s()]+$/.test(pasteData)) {
            e.preventDefault();
        }
    });

    // Initialize first step
    showStep(currentStep);

    // Product data - prices and names for section 3 
    const products = [
        { name: "Cherry", price: 35 },
        { name: "Mango", price: 20 }
    ];

    const shippingOptions = {
        free: 0,
        local: 5
    };

    //update cart totals
    function updateCartTotals() {
        let subtotal = 0;

        // Calculate subtotal from all products
        document.querySelectorAll("#wizard-p-2 #shop_table tbody tr").forEach((row, index) => {
            const quantityInput = row.querySelector(".qty");
            const quantity = parseInt(quantityInput.value) || 0;
            subtotal += quantity * products[index].price;
        });

        // Calculate service fee (5% of subtotal)
        const serviceFee = subtotal * 0.05;

        // Get selected shipping option
        let shippingFee = 0;
        const selectedShipping = document.querySelector("#wizard-p-3 input[name='shipping']:checked");
        if (selectedShipping) {
            const shippingType = selectedShipping.nextSibling.textContent.trim().toLowerCase();
            shippingFee = shippingType.includes('free') ? shippingOptions.free : shippingOptions.local;
        }

        // Calculate total
        const total = subtotal + serviceFee + shippingFee;

        // Update the totals in Section 4
        document.querySelector("#wizard-p-3 .cart-subtotal:not(.shipping) td span.amount").textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector("#wizard-p-3 .cart-subtotal.service td span.amount").textContent = `$${serviceFee.toFixed(2)}`;

        // Update shipping display
        const shippingDisplay = document.querySelector("#wizard-p-3 .shipping td");
        if (shippingDisplay) {
            shippingDisplay.innerHTML = `
                <div class="checkbox">
                    <label>
                        <input type="radio" name="shipping" ${shippingFee === 0 ? 'checked' : ''} data-fee="0">
                        Free Shipping
                        <span class="checkmark"></span>
                    </label>
                    <label>
                        <input type="radio" name="shipping" ${shippingFee === 5 ? 'checked' : ''} data-fee="5">
                        Local pickup: $${shippingOptions.local.toFixed(2)}
                        <span class="checkmark"></span>
                    </label>
                </div>
                <span>Calculate shipping</span>
            `;

            // Add event listeners to shipping options
            document.querySelectorAll("#wizard-p-3 input[name='shipping']").forEach(radio => {
                radio.addEventListener("change", function () {
                    updateCartTotals();
                });
            });
        }

        document.querySelector("#wizard-p-3 .order-total td span.amount").textContent = `$${total.toFixed(2)}`;
    }

    // Update individual row total
    function updateRowTotal(input) {
        const row = input.closest("tr");
        const price = products[Array.from(document.querySelectorAll("#wizard-p-2 #shop_table tbody tr")).indexOf(row)].price;
        const quantity = parseInt(input.value) || 0;
        const total = price * quantity;

        row.querySelector(".total-price span.amount").textContent = `$${total.toFixed(2)}`;
    }

    // Setup quantity change handlers
    function setupQuantityHandlers() {
        document.querySelectorAll("#wizard-p-2 .quantity").forEach(quantityEl => {
            const input = quantityEl.querySelector(".qty");
            const plus = quantityEl.querySelector(".plus");
            const minus = quantityEl.querySelector(".minus");
            // plus
            plus.addEventListener("click", function (e) {
                e.preventDefault();
                input.value = parseInt(input.value) + 1;
                updateRowTotal(input);
                updateCartTotals();
            });

            // Minus 
            minus.addEventListener("click", function (e) {
                e.preventDefault();
                const currentVal = parseInt(input.value);
                if (currentVal > 0) {
                    input.value = currentVal - 1;
                    updateRowTotal(input);
                    updateCartTotals();
                }
            });

            // Direct input change
            input.addEventListener("change", function () {
                if (parseInt(this.value) < 0) {
                    this.value = 0;
                }
                updateRowTotal(this);
                updateCartTotals();
            });
        });
    }

    // Section 3 validation
    function validateSection3() {
        let isValid = true;
        const section = document.getElementById("wizard-p-2");

        // Clear previous errors
        section.querySelectorAll(".error-message").forEach(el => el.remove());

        // Check if at least one product has quantity > 0
        const quantities = Array.from(document.querySelectorAll("#wizard-p-2 .qty")).map(input => parseInt(input.value) || 0);
        if (!quantities.some(qty => qty > 0)) {
            isValid = false;

            // Highlight all quantity inputs
            document.querySelectorAll("#wizard-p-2 .qty").forEach(input => {
                input.classList.add("is-invalid");
            });
        }

        return isValid;
    }

    // Wrap the original showStep function
    const originalShowStep = showStep;
    showStep = function (step) {
        originalShowStep(step);

        // When showing section 4, update the totals
        if (step === 3) {
            updateCartTotals();
        }
    };

    // Wrap the original validateCurrentStep function
    const originalValidateCurrentStep = validateCurrentStep;
    validateCurrentStep = function () {
        if (currentStep === 2) {
            return validateSection3();
        }
        return originalValidateCurrentStep();
    };

    // Initialize quantity handlers
    setupQuantityHandlers();

    // Initialize shipping options
    document.querySelectorAll("#wizard-p-3 input[name='shipping']").forEach(radio => {
        radio.addEventListener("change", function () {
            updateCartTotals();
        });
    });

    updateCartTotals();
});