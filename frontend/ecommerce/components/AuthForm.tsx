"use client";
import { handleAuth } from "@/app/actions/auth";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const actionWithVariant = handleAuth.bind(null, type);

  return (
    <form
      className="flex flex-col max-w-sm space-y-5"
      action={actionWithVariant}
    >
      <div className="flex flex-col">
        <label className="auth-label">EMAIL</label>
        <input
          className="w-full auth-input placeholder:text-sm"
          type="email"
          name="email"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col">
        <label className="auth-label">PASSWORD</label>
        <input
          className="w-full auth-input placeholder:text-lg"
          type="password"
          name="password"
          placeholder="••••••••"
        />
      </div>
      {type === "register" && (
        <>
          <div className="flex flex-col">
            <label className="auth-label">PASSWORD CONFIRMATION</label>
            <input
              className="w-full auth-input placeholder:text-lg"
              type="password"
              name="verify_password"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col">
            <label className="auth-label">DATE OF BIRTH</label>
            <input
              className="w-full auth-input placeholder:text-sm"
              type="date"
              name="date_of_birth"
              placeholder=" "
            />
          </div>
          <div className="flex flex-col">
            <label className="auth-label">PHONE NUMBER</label>
            <input
              className="w-full auth-input placeholder:text-sm"
              type="phone"
              name="phone_number"
              placeholder="+48123456789"
            />
          </div>
          <div className="flex flex-col">
            <label className="auth-label">FIRST NAME</label>
            <input
              className="w-full auth-input placeholder:text-sm"
              type="text"
              name="first_name"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col">
            <label className="auth-label">LAST NAME </label>
            <input
              className="w-full auth-input placeholder:text-sm"
              type="text"
              name="last_name"
              placeholder="••••••••"
            />
          </div>
        </>
      )}
      <button
        className="w-full font-semibold text-sm text-primary-foreground uppercase tracking-wider blue-button"
        type="submit"
      >
        {type === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
      </button>
    </form>
  );
}
