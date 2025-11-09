import NotificationBell from "./components/NotificationBell";

export default function NotificationInboxRow() {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <NotificationBell />
      <div className="relative">
        <button className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors">
          <i className="fas fa-comment text-white text-sm sm:text-base"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
            3
          </span>
        </button>
      </div>
    </div>
  );
}
