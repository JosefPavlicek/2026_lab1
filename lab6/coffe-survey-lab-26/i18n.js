const translations = {
  en: {
    title: "Coffee Survey",
    q1: "How would you rate the coffee you just tasted?",
    q2: "Which brewing method do you usually prefer? (Max 3)",
    q3: "Would you be willing to pay more for Fair Trade coffee?",
    q4: "If yes, how much more would you be willing to pay?",
  },
  cz: {
    title: "Kávový dotazník",
    q1: "Jak hodnotíte kávu, kterou jste právě ochutnal?",
    q2: "Jaký způsob přípravy obvykle preferujete? (maximálně 3)",
    q3: "Byl byste ochotný si za svou kávu připlatit, pokud by splňovala označení „Fair trade“?",
    q4: "Jakou částku byste byl ochoten připlatit?",
  }
};

function translate(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key] || el.textContent;
  });
}

window.onload = () => translate(document.documentElement.lang || 'en');
