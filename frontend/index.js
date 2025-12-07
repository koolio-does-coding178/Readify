document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Works")
  const outputDiv = document.getElementById("output");
  const dyslexicToggle = document.getElementById("dyslexicToggle");
  const simplifyBtn = document.getElementById("simplifyBtn");
  const maleBtn = document.getElementById("maleVoice");
  const femaleBtn = document.getElementById("femaleVoice");

  dyslexicToggle.addEventListener("change", () => {
    outputDiv.classList.toggle("opendyslexic", dyslexicToggle.checked);
  });

  simplifyBtn.addEventListener("click", async () => {
    const text = document.getElementById("userText").value;
    if (!text) return alert("Type something first");

    try {
      const res = await fetch("http://localhost:3000/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      outputDiv.textContent = data.response || "No response";
    } catch (err) {
      console.error(err);
      outputDiv.textContent = "Error";
    }
  });

  function speakText(voiceName = null) {
    const text = outputDiv.textContent;
    if (!text) return;

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
