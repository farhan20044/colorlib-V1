document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0; // Start from the first section
    const sections = document.querySelectorAll(".content section");
    const steps = document.querySelectorAll(".steps li");
    const nextButton = document.querySelector(".actions a[href='#next']");
    const prevButton = document.querySelector(".actions a[href='#previous']");

    function showStep(step) {
        // Hide all sections
        sections.forEach((section) => (section.style.display = "none"));
        // Show the selected section
        sections[step].style.display = "block";

        // Update active step
        steps.forEach((stepItem) => stepItem.classList.remove("current"));
        steps[step].classList.add("current");

        // Enable/disable buttons
        prevButton.parentElement.classList.toggle("disabled", step === 0);
        // nextButton.style.display = step === sections.length - 1 ? "none" : "inline-block";
    }
      

    function validateFields(step) {
        let isValid = true;
        const inputs = sections[step].querySelectorAll("input[required]");
        inputs.forEach((input) => {
            if (!input.value.trim()) {
                input.classList.add("error");
                isValid = false;
            } else {
                input.classList.remove("error");
            }
        });
        return isValid;
    }

    // Event listener for "Continue" button
    nextButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent link from refreshing page

        if (validateFields(currentStep)) {
            if (currentStep < sections.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        } else {
            alert("Please fill in all required fields before continuing!");
        }
    });

    // Event listener for "Back" button
    prevButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Initialize first step
    showStep(currentStep);
});

// validation
document.addEventListener('DOMContentLoaded', function() {
    // Get the continue button
    const continueBtn = document.querySelector('a[href="#next"]');
    
    // Add click event listener
    continueBtn.addEventListener('click', function(e) {
        // Only validate if we're on section 1
        const currentSection = document.querySelector('.body.current');
        if (currentSection.id === 'wizard-p-0') {
            // Get all required inputs in section 1
            const inputs = currentSection.querySelectorAll('input[required]');
            let isValid = true;
            
            // Validate each input
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    
                    // Additional validation for email
                    if (input.type === 'email' && !validateEmail(input.value)) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }
            });
            
            // Prevent moving to next step if validation fails
            if (!isValid) {
                e.preventDefault();
                // Scroll to first invalid input
                const firstInvalid = currentSection.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Clear validation when user starts typing
    // Clear validation when user starts typing
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                // For name fields, check if input is alphabetic
                if (this.id === 'fname' || this.id === 'lname') {
                    const nameRegex = /^[A-Za-z ]*$/; // Allow empty during typing
                    if (nameRegex.test(this.value)) {
                        this.classList.remove('is-invalid');
                    } else {
                        this.classList.add('is-invalid');
                    }
                } else {
                    this.classList.remove('is-invalid');
                }
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Prevent non-alphabetic input in name fields
    const nameFields = document.querySelectorAll('#fname, #lname');
    nameFields.forEach(field => {
        field.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-z ]/.test(char)) {
                e.preventDefault();
            }
        });
        
        // Also prevent pasting non-alphabetic characters
        field.addEventListener('paste', function(e) {
            const pasteData = e.clipboardData.getData('text');
            if (!/^[A-Za-z ]+$/.test(pasteData)) {
                e.preventDefault();
            }
        });
    });
});
