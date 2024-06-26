"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { CompareSlider } from "../../components/CompareSlider";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";
import Toggle from "../../components/Toggle";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import Particle from "../../components/Particle";
import { useDropzone } from "react-dropzone";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function DreamPage() {
    const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
    const [restoredImage, setRestoredImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
    const [sideBySide, setSideBySide] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState<string | null>(null);
    const [theme, setTheme] = useState<themeType>("Modern");
    const [room, setRoom] = useState<roomType>("Living Room");
    const [renderAmount, setRenderAmount] = useState(1);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            setUploadedFiles([]); // Initialize uploadedFiles with an empty array
            if (acceptedFiles.length !== 0) {
                const image = acceptedFiles[0];
                const imageName = image.name;
                const reader = new FileReader();
                reader.onload = () => {
                    const imageUrl = reader.result as string; // Cast imageUrl to string
                    setPhotoName(imageName);
                    setOriginalPhoto(imageUrl);
                    generatePhoto(imageUrl);
                };
                reader.readAsDataURL(image);
            }
        },
    });

    const clearUploadedFiles = () => {
        setUploadedFiles([]);
    };

    async function generatePhoto(fileUrl: string) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setLoading(true);
        const res = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl: fileUrl, theme, room }),
        });

        let newPhoto = await res.json();
        if (res.status !== 200) {
            setError(newPhoto);
        } else {
          console.log(newPhoto)
            setRestoredImage(newPhoto[1]);
            insertSupabase(newPhoto[1]);
            insertSupabase(newPhoto[2])
            insertSupabase(newPhoto[3])
            insertSupabase(newPhoto[4]);
        }
        setTimeout(() => {
            setLoading(false);
        }, 1300);
    }

    async function insertSupabase(restoredImageUrl: string) {
        try {
            const { data, error } = await supabase
                .from("images")
                .insert([{ url: restoredImageUrl }]);
            if (error) throw error;
            console.log("Supabase insert success:", data);
        } catch (error) {
            console.error("Supabase insert error:", error.message);
        }
    }

    const handleRenderAmount = (action) => {
        if (action === "add" && renderAmount < 4) {
            setRenderAmount((prevRenderAmount) => prevRenderAmount + 1);
        } else if (action === "subtract" && renderAmount > 1) {
            setRenderAmount((prevRenderAmount) => prevRenderAmount - 1);
        }
    };

    return (
        <>
        <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            {/* <Link href="/store">
                <button className="z-50 absolute top-0 right-0 m-4 bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600">
                    Generated Images
                </button>
            </Link> */}
            <main className="z-50 flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
                <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-100 sm:text-6xl mb-5">
                    Generate your <span className="text-blue-600">dream</span>{" "}
                    room
                </h1>
                <ResizablePanel>
                    <AnimatePresence mode="wait">
                        <motion.div className="flex justify-between items-center w-full flex-col mt-4">
                            {!restoredImage && (
                                <>
                                    <div className="space-y-4 w-full max-w-sm">
                                        <div className="flex mt-3 items-center space-x-3">
                                            <Image
                                                src="/number-1-white.svg"
                                                width={30}
                                                height={30}
                                                alt="1 icon"
                                                />
                                            <p className="text-left font-medium">
                                                Choose your room theme.
                                            </p>
                                        </div>
                                        <DropDown
                                            theme={theme}
                                            setTheme={(newTheme) =>
                                                setTheme(
                                                    newTheme as typeof theme
                                                )
                                            }
                                            themes={themes}
                                            />
                                    </div>
                                    <div className="space-y-4 w-full max-w-sm">
                                        <div className="flex mt-10 items-center space-x-3">
                                            <Image
                                                src="/number-2-white.svg"
                                                width={30}
                                                height={30}
                                                alt="1 icon"
                                                />
                                            <p className="text-left font-medium">
                                                Choose your room type.
                                            </p>
                                        </div>
                                        <DropDown
                                            theme={room}
                                            setTheme={(newRoom) =>
                                                setRoom(newRoom as typeof room)
                                            }
                                            themes={rooms}
                                            />
                                    </div>
                                    {/* Amount of render */}
                                    {/* <div className="flex mt-10 items-center space-x-3">
                      <Image
                      src="/number-3-white.svg"
                      width={30}
                      height={30}
                      alt="1 icon"
                      />
                      <p className="text-left font-medium">
                      Enter the amount of renders
                      </p>
                      <div className="flex gap-4 items-center">
                      <button
                      className="bg-white text-black px-4 py-2 rounded-md"
                      onClick={() => handleRenderAmount("subtract")}
                      >
                      -
                      </button>
                      <p className="text-white w-3">{renderAmount}</p>
                      <button
                      className="bg-white text-black px-4 py-2 rounded-md"
                      onClick={() => handleRenderAmount("add")}
                      >
                      +
                      </button>
                      </div>
                    </div> */}
                                    <div className="mt-4 w-full max-w-sm">
                                        <div className="flex mt-6 w-96 items-center space-x-3">
                                            <Image
                                                src="/number-3-white.svg"
                                                width={30}
                                                height={30}
                                                alt="1 icon"
                                            />
                                            <p className="text-left font-medium">
                                                Upload a picture of your room.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {restoredImage && (
                                <div>
                                    Here's your remodeled{" "}
                                    <b>{room.toLowerCase()}</b> in the{" "}
                                    <b>{theme.toLowerCase()}</b> theme!{" "}
                                </div>
                            )}
                            <div
                                className={`${
                                    restoredLoaded
                                    ? "visible mt-6 -ml-8"
                                    : "invisible"
                                }`}
                                >
                                <Toggle
                                    className={`${
                                        restoredLoaded
                                        ? "visible mb-6"
                                        : "invisible"
                                    }`}
                                    sideBySide={sideBySide}
                                    setSideBySide={(newVal) =>
                                        setSideBySide(newVal)
                                    }
                                    />
                            </div>
                            {restoredLoaded && sideBySide && (
                                <CompareSlider
                                    original={originalPhoto!}
                                    restored={restoredImage!}
                                />
                            )}
                            {!originalPhoto && (
                                <div
                                    className="flex flex-col items-center justify-center border-dotted border-2 border-gray-400 p-6"
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <div className="text-center">
                                        <p>
                                            Drag and drop files here or click to
                                            browse.
                                        </p>
                                        <ul className="mt-4">
                                            {uploadedFiles.map((file) => (
                                                <li key={file.name}>
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                        {uploadedFiles.length > 0 && (
                                            <button
                                            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={clearUploadedFiles}
                                            >
                                                Clear Uploaded Files
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            {originalPhoto && !restoredImage && (
                                <Image
                                alt="original photo"
                                src={originalPhoto}
                                className="rounded-2xl h-96"
                                    width={475}
                                    height={475}
                                    />
                                )}
                            {restoredImage && originalPhoto && !sideBySide && (
                                <div className="flex sm:space-x-4 sm:flex-row flex-col">
                                    <div>
                                        <h2 className="mb-1 font-medium text-lg">
                                            Original Room
                                        </h2>
                                        <Image
                                            alt="original photo"
                                            src={originalPhoto}
                                            className="rounded-2xl relative w-full h-96"
                                            width={475}
                                            height={475}
                                            />
                                    </div>
                                    <div className="sm:mt-0 mt-8">
                                        <h2 className="mb-1 font-medium text-lg">
                                            Generated Room
                                        </h2>
                                        <a
                                            href={restoredImage}
                                            target="_blank"
                                            rel="noreferrer"
                                            >
                                            <Image
                                                alt="restored photo"
                                                src={restoredImage}
                                                className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
                                                width={475}
                                                height={475}
                                                onLoadingComplete={() =>
                                                    setRestoredLoaded(true)
                                                }
                                                />
                                        </a>
                                    </div>
                                </div>
                            )}
                            {loading && (
                                <button
                                disabled
                                className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                                >
                                    <span className="pt-4">
                                        <LoadingDots
                                            color="white"
                                            style="large"
                                            />
                                    </span>
                                </button>
                            )}
                            {error && (
                                <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                                role="alert"
                                >
                                    <span className="block sm:inline">
                                        {error}
                                    </span>
                                </div>
                            )}
                            <div className="flex space-x-2 justify-center">
                                {originalPhoto && !loading && (
                                    <button
                                    onClick={() => {
                                        setOriginalPhoto(null);
                                        setRestoredImage(null);
                                        setRestoredLoaded(false);
                                        setError(null);
                                    }}
                                        className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                                    >
                                        Generate New Room
                                    </button>
                                )}
                                {restoredLoaded && (
                                    <button
                                    onClick={() => {
                                        downloadPhoto(
                                            restoredImage!,
                                            appendNewToName(photoName!)
                                        );
                                    }}
                                    className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                                    >
                                        Download Generated Room
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </ResizablePanel>
            </main>
        </div>
        <Particle />
                                </>
    );
}