import React from "react";
import AuthForm from "@/components/AuthForm";
import "../globals.css";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center min-h-screen inline-padding nav-margin animate-fade-in-down [animation-duration:300ms]">
      <div className="flex flex-col items-center max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-muted-foreground text-sm mb-10 text-center">
          Join PCStore for exclusive deals and order tracking
        </p>
      </div>
      <div className="max-w-sm w-full">
        <AuthForm authType="register" />
      </div>
      <div className="flex flex-row mt-8 max-w-sm w-full justify-center space-x-2">
        <p className="text-muted-foreground text-sm">
          Already have an account?
        </p>
        <Link
          className="text-light-blue text-sm underline underline-offset-4 hover:opacity-80 transition-opacity duration-150 ease-in-out"
          href="/login"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default page;
