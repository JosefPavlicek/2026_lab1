document.getElementById("create").onclick = async () => {
  const time = document.getElementById("time").value;
  const data = getFormData();

  try {
    const response = await fetch("/api/reservations/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: formatTimeKey(time),
        data
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Create failed.");
      return;
    }

    alert("Reservation created.");
    loadReservations();
  } catch (error) {
    console.error("Create error:", error);
    alert("Server error.");
  }
};

document.getElementById("update").onclick = async () => {
  const time = document.getElementById("time").value;
  const data = getFormData();

  try {
    const response = await fetch("/api/reservations/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: formatTimeKey(time),
        data
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Update failed.");
      return;
    }

    alert("Reservation updated.");
    loadReservations();
  } catch (error) {
    console.error("Update error:", error);
    alert("Server error.");
  }
};

document.getElementById("delete").onclick = async () => {
  const time = document.getElementById("time").value;
  const key = formatTimeKey(time);

  try {
    const response = await fetch("/api/reservations/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Delete failed.");
      return;
    }

    alert("Reservation deleted.");
    loadReservations();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Server error.");
  }
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

async function loadReservations() {
  try {
    const response = await fetch("/api/reservations/list");
    const data = await response.json();
    console.log("loadReservations "+data.body);
    const list = document.getElementById("reservations");
    list.innerHTML = "";

    if (!response.ok) {
      alert(data.error || "Loading failed.");
      return;
    }

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
  } catch (error) {
    console.error("Load error:", error);
    alert("Server error.");
  }
}

loadReservations();