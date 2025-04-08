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

