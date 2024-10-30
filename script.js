document.addEventListener("DOMContentLoaded", function() {
    // Time Zone Converter
    const timezoneSelect = document.getElementById("timezone-select");
    const timeDisplay = document.getElementById("time-display");
    
    function updateTime() {
      const timezone = timezoneSelect.value;
      const currentTime = new Date().toLocaleString("en-US", { timeZone: timezone });
      timeDisplay.textContent = `Current time: ${currentTime}`;
    }
    
    timezoneSelect.addEventListener("change", updateTime);
    updateTime();
  
    // Script Customization
    const scriptTextarea = document.getElementById("script-textarea");
    const scriptDisplay = document.getElementById("script-display");
    const saveScriptButton = document.getElementById("save-script");
  
    saveScriptButton.addEventListener("click", () => {
      const scriptText = scriptTextarea.value;
      localStorage.setItem("customScript", scriptText);
      displaySavedScript();
    });
  
    function displaySavedScript() {
      const savedScript = localStorage.getItem("customScript") || "No script saved.";
      scriptDisplay.textContent = `Saved Script: ${savedScript}`;
    }
  
    displaySavedScript();
  
    // Callback Notes
    const callbackTextarea = document.getElementById("callback-textarea");
    const callbackDisplay = document.getElementById("callback-display");
    const saveCallbackButton = document.getElementById("save-callback");
  
    saveCallbackButton.addEventListener("click", () => {
      const callbackText = callbackTextarea.value;
      localStorage.setItem("callbackNotes", callbackText);
      displaySavedCallback();
    });
  
    function displaySavedCallback() {
      const savedCallback = localStorage.getItem("callbackNotes") || "No callback notes saved.";
      callbackDisplay.textContent = `Saved Callback Notes: ${savedCallback}`;
    }
  
    displaySavedCallback();
  });
  