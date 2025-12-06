console.log("Gemini JS Loaded");

const API_KEY = "AIzaSyAM_fY73Vwe0RICSv7PnV_-F-Y0PvcAAxo";

const outputDiv = document.getElementById("output");
const dyslexicToggle = document.getElementById("dyslexicToggle");
const simplifyBtn = document.getElementById("simplifyBtn");
const speakBtn = document.getElementById("speakBtn");
const maleBtn = document.getElementById("maleVoice");
const femaleBtn = document.getElementById("femaleVoice");

dyslexicToggle.addEventListener("change", () => {
  outputDiv.classList.toggle("opendyslexic", dyslexicToggle.checked);
});

simplifyBtn.addEventListener("click", async () => {
  const text = document.getElementById("userText").value;
  if (!text) return alert("Type something first");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Simplify this text in easy English so someone with dyslexia can understand, but do not include formatting like bold, italics, etc.:\n\n${text}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Did not respond";
    outputDiv.textContent = reply;
  } catch (err) {
    console.error(err);
    outputDiv.textContent = "Error";
  }
});

// Unified speak function
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

// Male/female buttons
maleBtn.addEventListener("click", () => speakText("Microsoft Mark - English (United States)"));
femaleBtn.addEventListener("click", () => speakText("Microsoft Zira - English (United States)"));


// Preload voices (some browsers)
speechSynthesis.onvoiceschanged = () => {};
