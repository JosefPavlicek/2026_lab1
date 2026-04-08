const firebaseURL = 'https://......'; // Replace with your Firebase project URL

const brewingOptions = [
  'Ristretto', 'Espresso', 'Double Espresso', 'Lungo/Americano',
  'Espresso macchiato', 'Cappuccino', 'Flat white', 'Caffe Latte',
  'Turkish coffee', 'Filtered coffee', 'Instant coffee'
];

const fairTradeOptions = ['Definitely yes', 'Rather yes', 'Rather not', 'Definitely not', 'I dont know'];

const priceOptions = [
  '< 5%', '5% (+2 CZK)', '10% (+4.5 CZK)', '15% (+7 CZK)',
  '20% (+9 CZK)', '25% (+11 CZK)', '30% (+13.5 CZK)',
  '35% (+16 CZK)', '40% (+18 CZK)', '> 40%'
];

const q2Container = document.getElementById("q2");
const q3Container = document.getElementById("q3");
const q4Container = document.getElementById("q4");
const q4Wrapper = document.getElementById("q4-wrapper");

function renderCheckboxGroup(container, options, name, max = 3) {
  container.innerHTML = '';
  options.forEach((opt, idx) => {
    const id = `${name}_${idx}`;
    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" id="${id}" value="${opt}" name="${name}" />
      <label class="form-check-label" for="${id}">${opt}</label>
    `;
    container.appendChild(div);
  });

  // enforce max selection
  container.addEventListener("change", () => {
    const checkboxes = container.querySelectorAll("input[type=checkbox]");
    const checked = Array.from(checkboxes).filter(ch => ch.checked);
    checkboxes.forEach(ch => {
      if (checked.length >= max && !ch.checked) {
        ch.disabled = true;
      } else {
        ch.disabled = false;
      }
    });
  });
}

function renderRadioGroup(container, options, name) {
  container.innerHTML = '';
  options.forEach((opt, idx) => {
    const id = `${name}_${idx}`;
    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
      <input class="form-check-input" type="radio" id="${id}" value="${opt}" name="${name}" />
      <label class="form-check-label" for="${id}">${opt}</label>
    `;
    container.appendChild(div);
  });
}

renderCheckboxGroup(q2Container, brewingOptions, "q2", 3);
renderRadioGroup(q3Container, fairTradeOptions, "q3");
renderRadioGroup(q4Container, priceOptions, "q4");

document.getElementById("q3").addEventListener("change", (e) => {
  const value = document.querySelector("input[name=q3]:checked")?.value;
  if (value === 'Definitely yes' || value === 'Rather yes') {
    q4Wrapper.style.display = "block";
  } else {
    q4Wrapper.style.display = "none";
  }
});

document.getElementById("submitBtn").onclick = () => {
  const q1 = document.querySelector("input[name=q1]:checked")?.value;
  const q2 = Array.from(document.querySelectorAll("input[name=q2]:checked")).map(cb => cb.value);
  const q3 = document.querySelector("input[name=q3]:checked")?.value;
  const q4 = document.querySelector("input[name=q4]:checked")?.value || null;

  if (!q1 || q2.length === 0 || !q3 || (q4Wrapper.style.display === "block" && !q4)) {
    alert("Please answer all required questions.");
    return;
  }

  const data = { q1, q2, q3, q4 };

  fetch(`${firebaseURL}/responses.json`, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(() => {
    alert("Thank you! Your response has been recorded.");
    window.location.reload();
  });
};

document.getElementById("langSwitch").onclick = () => {
  const current = document.documentElement.lang;
  const nextLang = current === 'en' ? 'cz' : 'en';
  document.documentElement.lang = nextLang;
  translate(nextLang);
};
