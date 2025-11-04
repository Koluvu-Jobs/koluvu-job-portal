import NotificationBell from "./components/NotificationBell";

export default function NotificationInboxRow() {
  return (
    <div className="flex items-center gap-4 mr-4">
      <NotificationBell />
      <div className="relative">
        <button className="p-1 rounded-full hover:bg-gray-100">
          <i className="fas fa-comment text-gray-600"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </div>
  );
}
