
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t py-3 md:py-4 px-4 md:px-6 bg-white text-xs md:text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-center md:text-left">
          <span className="font-bold text-ath-blue">ATH</span>
          <span className="text-gray-600"> Management System</span>
          <span className="hidden md:inline ml-2 text-gray-500">© 2024 All rights reserved</span>
        </div>
        <div className="text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
}
