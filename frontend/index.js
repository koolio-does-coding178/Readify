document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Works")
  const outputDiv = document.getElementById("output");
  const simplifyBtn = document.getElementById("simplifyBtn");
  const maleBtn = document.getElementById("maleVoice");
  const femaleBtn = document.getElementById("femaleVoice");

  // Null checks for elements
  if (!outputDiv || !simplifyBtn || !maleBtn || !femaleBtn) {
    console.error("Required elements not found in the DOM");
    return;
  }

  simplifyBtn.addEventListener("click", async () => {
    const text = document.getElementById("userText").value;
    if (!text) return alert("Type something first");

    // Show loading state
    outputDiv.textContent = "Simplifying...";
    simplifyBtn.disabled = true;

    try {
      const res = await fetch("/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      outputDiv.textContent = data.response || "No response received";
    } catch (err) {
      console.error("Error:", err);
      outputDiv.textContent = `Error: ${err.message}. Make sure the backend server is running on port 3000.`;
    } finally {
      simplifyBtn.disabled = false;
    }
  });
  

  function speakText(voiceName = null) {
    const text = outputDiv.textContent;
    if (!text || text.includes("Error") || text.includes("Simplifying")) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";

    if (voiceName) {
      const voices = speechSynthesis.getVoices();
      utter.voice = voices.find(v => v.name.includes(voiceName)) || voices[0];
    }

    speechSynthesis.speak(utter);
  }

  maleBtn.addEventListener("click", () => speakText("Microsoft Mark"));
  femaleBtn.addEventListener("click", () => speakText("Microsoft Zira"));

  speechSynthesis.onvoiceschanged = () => {};
});