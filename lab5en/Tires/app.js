const firebaseURL = 'https://smzat-40306-default-rtdb.europe-west1.firebasedatabase.app/'; // Replace with your actual Firebase URL

document.getElementById("create").onclick = () => {
  const time = document.getElementById("time").value;
  const data = getFormData();

  fetch(`${firebaseURL}/reservations/${formatTimeKey(time)}.json`, {
    method: "PUT",
    body: JSON.stringify(data)
  }).then(() => {
    alert("Reservation created.");
    loadReservations();
  });
};

document.getElementById("update").onclick = () => {
  const time = document.getElementById("time").value;
  const data = getFormData();

  fetch(`${firebaseURL}/reservations/${formatTimeKey(time)}.json`, {
    method: "PATCH",
    body: JSON.stringify(data)
  }).then(() => {
    alert("Reservation updated.");
    loadReservations();
  });
};

document.getElementById("delete").onclick = () => {
  const time = document.getElementById("time").value;
  const key = formatTimeKey(time);

  fetch(`${firebaseURL}/reservations/${key}.json`, {
    method: "DELETE"
  }).then(() => {
    alert("Reservation via key"+key+" deleted.");
    loadReservations();
  });
};

function getFormData() {
  return {
    name: document.getElementById("name").value,
    car: document.getElementById("car").value,
    phone: document.getElementById("phone").value,
    time: document.getElementById("time").value
  };
}

function formatTimeKey(timeString) {
  return timeString.replace(/[:.]/g, "-");
}

function loadReservations() {
  fetch(`${firebaseURL}/reservations.json`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("reservations");
      list.innerHTML = "";
      if (!data) return;
      for (const key in data) {
        const r = data[key];
        const item = document.createElement("li");
        item.textContent = `${r.time} - ${r.name} (${r.car}) - ${r.phone}`;
        item.onclick = () => {
          document.getElementById("time").value = r.time;
          document.getElementById("name").value = r.name;
          document.getElementById("car").value = r.car;
          document.getElementById("phone").value = r.phone;
        };
        list.appendChild(item);
      }
    });
}

loadReservations();
