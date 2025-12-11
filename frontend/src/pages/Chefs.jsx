import React from 'react';
import { Star } from 'lucide-react';

export default function Chefs() {
    const chefs = [
        {
            id: 1,
            name: 'Ninong Ry',
            title: 'Head Chef',
            specialty: 'Filipino Cuisine',
            location: 'Sorsogon',
            experience: '22 years',
            rating: 4.9,
            bio: 'The Best Cook in Phillipines.',
            image: '/src/images/chefs/ninong ry.jpg'
        },
        {
            id: 2,
            name: 'Chef Boy Logro',
            title: 'Executive Chef',
            specialty: 'Filipino Desserts & Pastries',
            location: 'Sorsogon',
            experience: '18 years',
            rating: 4.8,
            bio: 'Basta Masarap to Magluto.',
            image: '/src/images/chefs/boy-logro.jpg'
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Our Team</h1>
                <p className="text-gray-600 text-lg">Meet the talented chefs and staff behind El Jardin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {chefs.map((chef) => (
                    <div key={chef.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                        <img
                            src={chef.image}
                            alt={chef.name}
                            className="w-full h-64 object-cover object-top"
                        />
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-1">{chef.name}</h3>
                            <p className="text-amber-600 font-semibold mb-1">{chef.title}</p>
                            <p className="text-sm text-gray-500 mb-3">📍 {chef.location}</p>
                            
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.floor(chef.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold">{chef.rating}</span>
                            </div>

                            <div className="bg-gray-50 rounded p-3 mb-3">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Specialty:</strong> {chef.specialty}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Experience:</strong> {chef.experience}
                                </p>
                            </div>

                            <p className="text-gray-700 text-sm italic">{chef.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
