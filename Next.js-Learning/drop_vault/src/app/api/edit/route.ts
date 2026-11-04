import authOptions from "@/lib/auth";
import uploadOnCloudnary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email || !session.user?.id) {
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        const formData = await req.formData();

        const name = formData.get("name");
        const file = formData.get("image");

        if (typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { message: "Valid name is required" },
                { status: 400 }
            );
        }

        const updateData: {
            name: string;
            image?: string;
        } = {
            name: name.trim()
        };

        if (file !== null) {
            if (!(file instanceof File)) {
                return NextResponse.json(
                    { message: "Invalid image file" },
                    { status: 400 }
                );
            }

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif"
            ];

            if (
                !allowedTypes.includes(file.type) ||
                file.size > 5 * 1024 * 1024
            ) {
                return NextResponse.json(
                    { message: "Invalid image type or size" },
                    { status: 400 }
                );
            }

            const imageUrl = await uploadOnCloudnary(file);
            console.log("Uploaded image URL:", imageUrl);

            if (!imageUrl) {
                return NextResponse.json(
                    { message: "Image upload failed" },
                    { status: 500 }
                );
            }

            updateData.image = imageUrl;
        }

        const user = await User.findByIdAndUpdate(
            session.user.id,
            updateData,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Profile updated successfully", user },
            { status: 200 }
        );

    } catch (error) {
        console.error("Edit profile error:", error);

        return NextResponse.json(
            { message: "Something went wrong while updating profile" },
            { status: 500 }
        );
    }
}