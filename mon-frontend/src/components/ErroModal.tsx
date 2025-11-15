import React from "react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 animate-scaleIn">
        <h2 className="text-xl font-semibold text-red-600 mb-3">Erreur</h2>

        <p className="text-gray-700 mb-5">{message}</p>

        <button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow transition"
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
