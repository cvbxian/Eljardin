import React from "react";

export default function Home() {
  const features = [
    { title: "Reserve a Table", desc: "Book instantly with real-time availability." },
    { title: "Fast Service", desc: "Prepared and served with care and speed." },
    { title: "5-Star Experience", desc: "Enjoy premium ambiance and dining." },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/restaurant.jpg')" }}
    >
      <div className="bg-white/70 rounded-xl p-8 max-w-5xl mx-auto shadow-lg">
        <h1 className="text-4xl font-bold text-green-900 mb-4 text-center">
          Welcome to El Jardín
        </h1>
        <p className="text-gray-700 text-center mb-10">
          Experience nature-inspired dining & seamless booking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-green-100 p-6 rounded-lg shadow-md text-center hover:bg-green-200 transition-colors"
            >
              <h2 className="font-bold text-green-900 mb-2">{feature.title}</h2>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
