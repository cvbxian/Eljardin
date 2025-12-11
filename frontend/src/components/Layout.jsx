import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Calendar,
  Utensils,
  Wine,
  Coffee,
  ChefHat,
  Users,
  ShoppingCart,
  LogOut,
  Home as HomeIcon,
} from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
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
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-green-800 text-white transition-all duration-300 p-4 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={toggleSidebar}
            className="text-white text-xl font-bold"
          >
            {sidebarOpen ? "☰ Menu" : "☰"}
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-4 hover:bg-green-700 p-3 rounded-lg w-full transition-colors"
            >
              <item.icon size={22} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-3 text-red-300 hover:text-red-500 hover:bg-green-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}