import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000); // Auto remove after 5s
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      {/* Global Notification Container */}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-4 rounded-xl shadow-lg border pointer-events-auto transform transition-all animate-slide-up flex items-center gap-3 ${
              n.type === 'success' ? 'bg-white border-green-200 text-green-800' :
              n.type === 'error' ? 'bg-white border-red-200 text-red-800' :
              'bg-white border-blue-200 text-blue-800'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              n.type === 'success' ? 'bg-green-500' :
              n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}></div>
            <div>
              <h4 className="font-bold text-sm">{n.title}</h4>
              <p className="text-xs opacity-80">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="ml-2 hover:opacity-50">×</button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
