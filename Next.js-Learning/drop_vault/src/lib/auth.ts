import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "./db";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    return null;
                }

                await connectDb();

                const user = await User.findOne({ email });

                if (!user) {
                    return null;
                }

                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image || null,
                };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    callbacks: {

        // google signIn Callback
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDb();

                let dbUser = await User.findOne({
                    email: user.email,
                });

                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }

                user.id = dbUser._id.toString();
            }

            return true;
        },

        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
            }

            if (trigger === "update" && token.id) {
                await connectDb();

                const dbUser = await User.findById(token.id)
                    .select("name image");

                if (dbUser) {
                    token.name = dbUser.name;
                    token.picture = dbUser.image;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.image = token.picture as string | null;
            }

            return session;
        }
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

pages: {
    signIn: "/login",
    },

secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions