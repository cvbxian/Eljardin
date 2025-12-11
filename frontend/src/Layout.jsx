import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Calendar,
  Utensils,
  Wine,
  Coffee,
  ChefHat,
  Users,
  ShoppingCart,
  LogOut,
} from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: Utensils, label: "Menu", path: "/menu" },
    { icon: Wine, label: "Drinks", path: "/drinks" },
    { icon: Coffee, label: "Café", path: "/cafe" },
    { icon: ChefHat, label: "Chefs", path: "/chefs" },
    { icon: Users, label: "Guests", path: "/guests" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-green-800 text-white transition-all duration-300 p-4`}
      >
        <button
          onClick={toggleSidebar}
          className="text-white mb-6 text-xl font-bold"
        >
          {sidebarOpen ? "☰" : "➤"}
        </button>

        <nav className="space-y-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-4 hover:bg-green-700 p-2 rounded-lg w-full"
            >
              <item.icon size={22} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 text-red-300 hover:text-red-500"
        >
          <LogOut size={20} />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
