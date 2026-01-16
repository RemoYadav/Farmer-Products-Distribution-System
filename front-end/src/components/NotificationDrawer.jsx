import { useNotifications } from "../context/NotificationContext";

const NotificationDrawer = () => {
  const { open, setOpen, notifications, markAllRead } = useNotifications();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0  bg-white z-50 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold mr-2">Notifications</h3>
          <button
            onClick={markAllRead}
            className="text-sm text-green-600 hover:underline"
          >
            Mark all read
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 overflow-y-auto ">
            <div className="flex justify-between">
                <button
            onClick={markAllRead}
            className="text-sm text-green-600 hover:underline"
          >
            {/* Clear all */}
          </button> <button
            onClick={markAllRead}
            className="text-sm text- hover:underline"
          >
            {/* Preview all */}
          </button></div>
          {notifications.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              No new notifications
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 rounded-lg border transition
              ${!n.isRead
                ? "bg-green-100 border-green-400"
                : "bg-white-50 border-grey-300"}`}
            >
              <p className="text-sm">{n.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
