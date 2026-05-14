import React from "react";

const ProfileModal = ({ open, onClose, userName, email, onLogout }) => {
  if (!open) return null;

  const firstLetter = userName?.charAt(0).toUpperCase();

  return (
    <div className="absolute top-14 right-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 z-50">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
          {firstLetter}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{userName}</h3>

          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="border-t pt-4 flex flex-col gap-2">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition"
        >
          Close
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
