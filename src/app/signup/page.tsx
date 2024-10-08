"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { signup } from "../../redux/Auth/authSlice";
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
      setFormError("All fields are required.");
      return;
    }
    setFormError(null);
    setSuccessMessage(null); // Clear any previous success messages
    const resultAction = await dispatch(signup({ username: name, email, password }));
  
    if (signup.fulfilled.match(resultAction)) {
      setSuccessMessage("Signup successful! Redirecting to login...");
      setTimeout(() => router.push('/login'), 2000); // Redirect after 2 seconds
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {formError && (
            <div className="mb-4 text-red-600">{formError}</div>
          )}
          {status === "failed" && !formError && (
            <div className="mb-4 text-red-600">{error}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-600">{successMessage}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            disabled={status === "loading" || !name || !email || !password}
          >
            {status === "loading" ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Signup;
