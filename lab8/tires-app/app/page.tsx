"use client";

import { useEffect, useState } from "react";

function formatTimeKey(t: string) {
  return t.replace(/[:.]/g, "-");
}

export default function Page() {
  const [data, setData] = useState<any>({});
  const [form, setForm] = useState({
    time: "",
    name: "",
    car: "",
    phone: ""
  });

  async function load() {
    const res = await fetch("/api/reservations");
    const json = await res.json();
    setData(json || {});
  }

  useEffect(() => { load(); }, []);

  // Funkce pro kliknutí na řádek v seznamu
  const handleSelect = (reservation: any) => {
    setForm({
      time: reservation.time || "",
      name: reservation.name || "",
      car: reservation.car || "",
      phone: reservation.phone || ""
    });
  };

  async function create() {
    await fetch("/api/reservations", {
      method: "POST",
      body: JSON.stringify({
        key: formatTimeKey(form.time),
        data: form
      })
    });
    load();
  }

  async function update() {
    await fetch("/api/reservations/" + formatTimeKey(form.time), {
      method: "PATCH",
      body: JSON.stringify(form)
    });
    load();
  }

  async function remove() {
    await fetch("/api/reservations/" + formatTimeKey(form.time), {
      method: "DELETE"
    });
    load();
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tire Reservation</h1>

      {/* Přidány atributy 'value' pro synchronizaci se stavem */}
      <input 
        type="datetime-local" 
        value={form.time}
        onChange={e => setForm({...form, time: e.target.value})} 
        className="border p-2 w-full mb-2"
      />
      <input 
        placeholder="Name" 
        value={form.name}
        onChange={e => setForm({...form, name: e.target.value})} 
        className="border p-2 w-full mb-2"
      />
      <input 
        placeholder="Car" 
        value={form.car}
        onChange={e => setForm({...form, car: e.target.value})} 
        className="border p-2 w-full mb-2"
      />
      <input 
        placeholder="Phone" 
        value={form.phone}
        onChange={e => setForm({...form, phone: e.target.value})} 
        className="border p-2 w-full mb-2"
      />

      <div className="flex gap-2 mb-4">
        <button onClick={create} className="rounded bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700 active:scale-95">Create</button>
        <button onClick={update} className="rounded bg-yellow-500 text-white px-4 py-2 shadow transition hover:bg-yellow-600 active:scale-95">Update</button>
        <button onClick={remove} className="rounded bg-red-500 text-white px-4 py-2 shadow transition hover:bg-red-700 active:scale-95">Delete</button>
      </div>

      <div className="bg-gray-50 rounded p-2">
        <h2 className="font-semibold mb-2">Seznam rezervací (kliknutím upravte):</h2>
        <ul>
          {Object.entries(data).map(([k, r]: any) => (
            <li 
              key={k} 
              onClick={() => handleSelect(r)} 
              className="border p-2 mb-2 cursor-pointer hover:bg-blue-50 transition bg-white rounded shadow-sm flex justify-between"
            >
              <span>{r.time.replace("T", " ")}</span>
              <span className="font-medium">{r.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
