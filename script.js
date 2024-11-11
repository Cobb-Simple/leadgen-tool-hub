document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const submitButton = document.getElementById("submitButton");
    const clearButton = document.getElementById("clearButton"); // Added clear button
    const phoneNumberInput = document.getElementById("phoneNumber");
    const resultsDiv = document.getElementById("results");
    const timezoneTimeDisplay = document.getElementById("timezoneTimeDisplay");
    const timezoneDropdown = document.getElementById("timezoneDropdown");

    let currentInterval; // Variable to store the current interval ID

    // Function to display the selected timezone time
    function displayTimeBySelectedTimezone(timeZone) {
        if (currentInterval) {
            clearInterval(currentInterval);
        }
        timezoneTimeDisplay.textContent = '';

        function updateTime() {
            const currentTime = new Date();
            const timeString = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: timeZone,
                hour12: true
            }).format(currentTime);
            timezoneTimeDisplay.textContent = `Current Time (${timeZone}): ${timeString}`;
        }

        updateTime();
        currentInterval = setInterval(updateTime, 1000);
    }

    timezoneDropdown.addEventListener("change", () => {
        const selectedTimeZone = timezoneDropdown.value;
        const fullTimeZone = mapTimezoneToFullTimezone(selectedTimeZone);
        displayTimeBySelectedTimezone(fullTimeZone);
    });

    submitButton.addEventListener("click", handleSubmit);

    function handleSubmit() {
        const phoneNumber = phoneNumberInput.value.trim();

        if (phoneNumber) {
            const data = { phoneNumber: phoneNumber };
            const webhookUrl = 'https://hooks.zapier.com/hooks/catch/5890552/29nbc0m/';

            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (response.ok) {
                        fetchDataFromAppsScript();
                    } else {
                        throw new Error("Network response was not ok.");
                    }
                })
                .catch(error => {
                    console.error("Error sending data:", error);
                    resultsDiv.innerHTML = `<p>Error sending data. Please try again.</p>`;
                });
        } else {
            resultsDiv.innerHTML = `<p>Please enter a Contact ID.</p>`;
        }
    }

    async function fetchDataFromAppsScript() {
        const appsScriptUrl = "https://script.google.com/macros/s/AKfycbySivX6oOIeDz7VNkr_YsVr4u3fmMeqPDKO7g5DDEtnSflSKv7Ec31MpyXzz01caVPg/exec"; 
        try {
            const response = await fetch(appsScriptUrl);
            if (!response.ok) throw new Error("Network response was not ok.");

            const data = await response.json();
            displayFetchedData(data);
            displayTimeBySelectedTimezone(data.timeZone);
        } catch (error) {
            console.error("Error fetching data from Apps Script:", error);
            resultsDiv.innerHTML = `<p>Error fetching data. Please try again.</p>`;
        }
    }

    function displayFetchedData(details) {
        resultsDiv.innerHTML = `
            <p>First Name: ${details.firstName}</p>
            <p>Last Name: ${details.lastName}</p>
            <p>Contact ID: ${details.contactID}</p>
            <p>Phone Number: ${details.phoneNumber}</p>
            <p>Partner Location: ${details.partnerLocation}</p>
            <p>Time Zone: ${details.timeZone}</p>
            <p>Location Guide: ${details.locationGuide}</p>
            <p>Company Name: ${details.companyName}</p>
        `;
    }

    // Map shorthand timezone values to full timezone identifiers
    function mapTimezoneToFullTimezone(timezone) {
        switch (timezone) {
            case "EST":
                return "US/Eastern";
            case "CST":
                return "US/Central";
            case "MST":
                return "US/Mountain";
            case "PST":
                return "US/Pacific";
            default:
                return "UTC";
        }
    }

    // Initialize display for default selected timezone
    if (timezoneDropdown.value) {
        const fullTimeZone = mapTimezoneToFullTimezone(timezoneDropdown.value);
        displayTimeBySelectedTimezone(fullTimeZone);
    }

    // Clear button functionality to clear resultsDiv content
    clearButton.addEventListener("click", () => {
        resultsDiv.innerHTML = "";
    });
});
