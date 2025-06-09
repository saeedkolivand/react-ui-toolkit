"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto py-6 mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} React UI Toolkit Example</p>
      <p className="mt-1">Built with Next.js and React UI Toolkit</p>
    </footer>
  );
}
