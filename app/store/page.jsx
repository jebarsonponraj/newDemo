"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export default function Store() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchImages() {
            try {
                // Fetch images from Supabase table
                const { data: imagesData, error } = await supabase
                    .from("images")
                    .select("url");
                if (error) throw error;

                // Extract image URLs from the fetched data
                const imageURLs = imagesData.map((image) => image.url);
                setImages(imageURLs);
            } catch (error) {
                console.error("Error fetching images:", error.message);
            }
        }

        fetchImages();
    }, []);

    return (
        <div className="container mx-auto">
            <Link href="/">
                <button className="absolute top-0 left-0 m-4 bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600">
                    Back
                </button>
            </Link>
            <h1 className="mt-10 text-2xl text-center">Generated Images</h1>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {images.map((imageUrl, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden rounded-lg"
                    >
                        <Image
                            width={512}
                            height={576}
                            src={imageUrl}
                            alt="Generated Image"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
