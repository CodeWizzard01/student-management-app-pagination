"use client";

import StudentList from '../components/StudentList';
import { ModeToggle } from '../components/ModeToggle';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex-1 text-left">
          Student Management System
        </h1>
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-end">
          <ModeToggle />
        </div>
      </header>

      <main className="max-w-full mx-auto">
        <div className="dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <StudentList />
        </div>
      </main>

      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
        <p>Student Management Application © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
