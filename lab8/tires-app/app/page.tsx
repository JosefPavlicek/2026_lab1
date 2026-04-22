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

      <input type="datetime-local" onChange={e => setForm({...form, time: e.target.value})} className="border p-2 w-full mb-2"/>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} className="border p-2 w-full mb-2"/>
      <input placeholder="Car" onChange={e => setForm({...form, car: e.target.value})} className="border p-2 w-full mb-2"/>
      <input placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} className="border p-2 w-full mb-2"/>

      <div className="flex gap-2 mb-4">
        <button onClick={create} className="rounded bg-blue-600 px-4 py-2 text-white shadow transition duration-150 hover:bg-blue-700 active:scale-95 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400">Create</button>
        <button onClick={update} className="bg-yellow-500 text-white px-3 py-1">Update</button>
        <button onClick={remove} className="bg-red-500 text-white px-3 py-1">Delete</button>
      </div>

      <ul>
        {Object.entries(data).map(([k, r]: any) => (
          <li key={k} onClick={() => setForm(r)} className="border p-2 mb-2 cursor-pointer">
            {r.time} - {r.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
