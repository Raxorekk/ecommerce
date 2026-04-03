import React from "react";
import "../globals.css";

const page = () => {
  return (
    <div className="flex flex-col items-center min-h-screen px-6 pt-20">
      <div className="flex flex-col items-center max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground mb-10">Sign in to PCStore</p>
      </div>
      <div className="max-w-sm w-full">
        <form className="flex flex-col max-w-sm space-y-5">
          <div className="flex flex-col">
            <label className="text-muted-foreground mb-2 text-sm tracking-wider uppercase font-body">
              EMAIL
            </label>
            <input
              className="w-full rounded-md bg-[#272C34] placeholder:text-muted-foreground placeholder:text-sm px-4 py-3 text-sm"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-muted-foreground mb-2 text-sm tracking-wider uppercase font-body">
              PASSWORD
            </label>
            <input
              className="w-full rounded-md bg-[#272C34] placeholder:text-muted-foreground placeholder:text-lg px-4 py-3 text-sm"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <button
            className="w-full rounded-md font-semibold text-sm text-primary-foreground blue-button uppercase tracking-wider"
            type="submit"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
