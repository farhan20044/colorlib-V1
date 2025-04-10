document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const sections = document.querySelectorAll(".content section");
    const steps = document.querySelectorAll(".steps li");
    const nextButton = document.querySelector(".actions a[href='#next']");
    const prevButton = document.querySelector(".actions a[href='#previous']");
    const finishButton = document.querySelector(".actions a[href='#finish']");
    const actionItems = document.querySelectorAll(".actions li");

    // Show the current step and hide others
    function showStep(step) {
        sections.forEach((section, index) => {
            section.style.display = index === step ? "block" : "none";
        });

        // Update step indicators
        steps.forEach((stepItem, index) => {
            const img = stepItem.querySelector("img:first-of-type");
            if (img) {
                img.src = `../images/step-${index + 1}${index === step ? '-active' : ''}.png`;
            }
            
            stepItem.classList.toggle("current", index === step);
            stepItem.classList.toggle("done", index < step);
        });

        // Update navigation buttons
        prevButton.parentElement.classList.toggle("disabled", step === 0);
        
        // Show/hide finish button on last step
        if (step === sections.length - 1) {
            nextButton.parentElement.style.display = "none";
            finishButton.parentElement.style.display = "block";
        } else {
            nextButton.parentElement.style.display = "block";
            finishButton.parentElement.style.display = "none";
        }
    }

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
                isValid = false;
            }
            
            // Special validation for email
            if (input.id === "email" && input.value.trim() && !validateEmail(input.value)) {
                input.classList.add("is-invalid");
                isValid = false;
            }
            
            // Special validation for names (only letters)
            if ((input.id === "fname" || input.id === "lname") && input.value.trim() && !/^[A-Za-z ]+$/.test(input.value)) {
                input.classList.add("is-invalid");
                isValid = false;
            }
        });

        // Additional validation for password section (section 2)
        if (currentStep === 1) {
            const currentPass = currentSection.querySelector("#current-pass")?.value;
            const newPass = currentSection.querySelector("#new-pass")?.value;
            const confirmPass = currentSection.querySelector("#confirm-pass")?.value;
            
            // Check if passwords match (only if they're not empty)
            if (newPass && confirmPass && newPass !== confirmPass) {
                isValid = false;
                
                // Highlight the password fields
                currentSection.querySelectorAll("#new-pass, #confirm-pass").forEach(input => {
                    input.classList.add("is-invalid");
                });
                
                // Add specific error message for password mismatch
                const passError = document.createElement("div");
                passError.className = "error-message";
                passError.style.color = "red";
                passError.style.margin = "10px 0";
                passError.textContent = "New password and confirm password do not match";
                
                const heading = currentSection.querySelector("h3");
                if (heading) {
                    heading.insertAdjacentElement("afterend", passError);
                } else {
                    currentSection.insertAdjacentElement("afterbegin", passError);
                }
            }
            
            // Check if new password is same as current password
            if (currentPass && newPass && currentPass === newPass) {
                isValid = false;
                
                // Highlight the password fields
                currentSection.querySelector("#new-pass").classList.add("is-invalid");
                
                // Add specific error message
                const samePassError = document.createElement("div");
                samePassError.className = "error-message";
                samePassError.style.color = "red";
                samePassError.style.margin = "10px 0";
                samePassError.textContent = "New password must be different from current password";
                
                const heading = currentSection.querySelector("h3");
                if (heading) {
                    heading.insertAdjacentElement("afterend", samePassError);
                } else {
                    currentSection.insertAdjacentElement("afterbegin", samePassError);
                }
            }
        }

        // Show general error message if validation fails
        if (!isValid) {
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.margin = "10px 0";
            errorMessage.textContent = "Please fill in all required fields correctly";
            
            // Only add general message if no specific password messages exist
            if (!currentSection.querySelector(".error-message")) {
                const heading = currentSection.querySelector("h3");
                if (heading) {
                    heading.insertAdjacentElement("afterend", errorMessage);
                } else {
                    currentSection.insertAdjacentElement("afterbegin", errorMessage);
                }
            }
            
            // Scroll to first invalid field
            const firstInvalid = currentSection.querySelector(".is-invalid");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        return isValid;
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Next button click handler
    nextButton.addEventListener("click", function (event) {
        event.preventDefault();
        
        if (validateCurrentStep()) {
            if (currentStep < sections.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    // Previous button click handler
    prevButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Finish button click handler
    finishButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (validateCurrentStep()) {
            document.getElementById("wizard").submit();
        }
    });

    // Make step indicators clickable
    steps.forEach((step, index) => {
        step.addEventListener("click", function() {
            // Only allow navigation to steps that are before the current step
            // or to the next step (with validation)
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

    // Clear validation errors when user starts typing
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function() {
            this.classList.remove("is-invalid");
            const errorMessage = this.closest("section")?.querySelector(".error-message");
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });

    // Prevent non-alphabetic characters in name fields
    document.querySelectorAll("#fname, #lname").forEach(field => {
        field.addEventListener("keypress", function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-z ]/.test(char)) {
                e.preventDefault();
            }
        });
        
        field.addEventListener("paste", function(e) {
            const pasteData = e.clipboardData.getData("text");
            if (!/^[A-Za-z ]+$/.test(pasteData)) {
                e.preventDefault();
            }
        });
    });

    // Initialize first step
    showStep(currentStep);
});