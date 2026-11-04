
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

function EditPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!userLoading && !user) {
            router.replace("/login");
        }
    }, [user, userLoading, router]);

    if (userLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (!user) return null;

    return <EditForm />;
}

function EditForm() {
    const { user, setUser } = useUser();
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(user?.name ?? "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Clean up temporary preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Handle image selection
    const handleImageSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, PNG, WEBP or GIF image!");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB!");
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        // Allow selecting the same file again
        e.target.value = "";
    };

    // Save profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading || !user) return;

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("name", name);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const res = await fetch("/api/edit", {
                method: "POST",
                body: formData
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message || "Profile update failed"
                );
            }

            // Update global user context
            setUser(result.user);

            // Redirect to dashboard
            router.replace("/");

        } catch (error) {
            console.error("Profile update error:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong!"
            );
        } finally {
            setLoading(false);
        }
    };

    // Image priority: Preview > Cloudinary > Default
    const displayImage =
        previewUrl || user?.image || "/default-avatar.png";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">

            <div className="w-full max-w-md border-2 border-white rounded-2xl p-8 shadow-lg">

                <h1 className="text-2xl font-semibold text-center mb-8">
                    Edit Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-3">

                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white bg-gray-900">

                            <Image
                                src={displayImage}
                                alt="Profile Preview"
                                fill
                                sizes="112px"
                                className="object-cover"
                                unoptimized
                            />

                        </div>

                        {/* Choose Image Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition disabled:opacity-50"
                        >
                            Choose Image
                        </button>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        <p className="text-xs text-gray-400">
                            JPG, PNG, WEBP or GIF · Max 5MB
                        </p>

                        {selectedFile && (
                            <p className="text-xs text-green-400">
                                New image selected: {selectedFile.name}
                            </p>
                        )}

                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-black border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
                            required
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-white text-black font-semibold rounded-md hover:bg-slate-200 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? "Saving Changes..." : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default EditPage;
