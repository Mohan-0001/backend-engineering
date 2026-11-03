"use client"
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      console.log(result.data);
      router.replace("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black text-white px-4'>
      <div className='w-full max-w-md border border-white rounded-2xl bg-gray-900 p-8'>
        <h1 className='text-3xl font-bold text-center mb-6'>Register</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-zinc-300'>Name</label>
            <input
              type="text"
              placeholder='Enter your name'
              onChange={(e) => setName(e.target.value)}
              className='p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-zinc-300'>Email</label>
            <input
              type="email"
              placeholder='Enter your email'
              className='p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-zinc-300'>Password</label>
            <input
              type="password"
              placeholder='Enter your password'
              className='p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition mt-2'
            onSubmit={handleSubmit}
          >
            Register
          </button>
          <p onClick={(e) => router.push('/login')} className='text-center text-sm text-zinc-400 mt-2'>
            Already have an account? <span className='text-white underline cursor-pointer'>login</span>
          </p>
        </form>

        <div className='flex items-center gap-[5px] justify-center my-4'>
          <hr className='flex-grow border-gray-500' />
          <span>OR</span>
          <hr className='flex-grow border-gray-500' />
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/" })} className='w-full py-3 bg-zinc-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-700 transition gap-3.5'>
          <FcGoogle />
          <span>Sign Up With Google</span>
        </button>

      </div>
    </div>
  )
}

export default Register