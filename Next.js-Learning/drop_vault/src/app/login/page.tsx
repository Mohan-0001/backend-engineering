"use client"
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { signIn, useSession } from 'next-auth/react';
import { FaLessThanEqual } from 'react-icons/fa';

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const session = useSession();
    console.log(session);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/",
        });

        if (result?.ok) {
            router.replace("/");
        } else {
            console.log("Login failed:", result?.error);
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn("google", {
            callbackUrl: "/",
        });
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-black text-white px-4'>
            <div className='w-full max-w-md border border-white rounded-2xl bg-gray-900 p-8'>
                <h1 className='text-3xl font-bold text-center mb-6'>LogInr</h1>
                <form onSubmit={handleSignIn} className='flex flex-col gap-4'>
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
                    >
                        Login
                    </button>
                    <p onClick={(e) => router.push('/register')} className='text-center text-sm text-zinc-400 mt-2'>
                        Want to Create an account? <span className='text-white underline cursor-pointer'>register</span>
                    </p>
                </form>

                <div className='flex items-center gap-[5px] justify-center my-4'>
                    <hr className='flex-grow border-gray-500' />
                    <span>OR</span>
                    <hr className='flex-grow border-gray-500' />
                </div>

                <button onClick={handleGoogleSignIn} className='w-full py-3 bg-zinc-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-700 transition gap-3.5'>
                    <FcGoogle />
                    <span>Sign In With Google</span>
                </button>

            </div>
        </div>
    )
}

export default Login