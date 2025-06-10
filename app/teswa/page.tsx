'use client';
import { useState } from 'react';

export default function Home() {
  const [numbers, setNumbers] = useState('');
  const [message, setMessage] = useState('');

  const sendMessages = () => {
    const list = numbers
      .split(',')
      .map((num) => num.trim().replace(/^0/, '62')) // ubah 08xx ke 628xx
      .filter((n) => n);

    list.forEach((num) => {
      const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  };

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Blast Manual</h1>
      <textarea
        placeholder="Masukkan nomor, pisahkan dengan koma (cth: 0812xxx, 0856xxx)"
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        className="w-full h-24 p-2 border mb-4"
      />
      <textarea
        placeholder="Pesan WhatsApp"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-32 p-2 border mb-4"
      />
      <button
        onClick={sendMessages}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Kirim WhatsApp
      </button>
    </main>
  );
}
