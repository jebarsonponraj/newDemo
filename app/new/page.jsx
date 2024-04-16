"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import DropDown from "../../components/DropDown";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";
import roomOne from "../../public/generated-pic.png";
import roomTwo from "../../public/generated-pic-2.jpg";
import roomThree from "../../public/generatedpic.png";
import { useDropzone } from "react-dropzone";

const CreatePage = () => {
    const [theme, setTheme] = useState("Modern");
    const [room, setRoom] = useState("Living Room");
    const [renderAmount, setRenderAmount] = useState(1);
    const [originalPhoto, setOriginalPhoto] = useState(null);
    const [restoredImage, setRestoredImage] = useState(null);
    const [photoName, setPhotoName] = useState(null);
    const [restoredLoaded, setRestoredLoaded] = useState(false);
    const [sideBySide, setSideBySide] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setUploadedFiles(acceptedFiles);
            if (acceptedFiles.length !== 0) {
                const image = acceptedFiles[0];
                const imageName = image.name;
                const reader = new FileReader();
                reader.onload = () => {
                    const imageUrl = reader.result;
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

    const handleRenderAmount = (action) => {
        if (action === "add" && renderAmount < 4) {
            setRenderAmount((prevRenderAmount) => prevRenderAmount + 1);
        } else if (action === "subtract" && renderAmount > 1) {
            setRenderAmount((prevRenderAmount) => prevRenderAmount - 1);
        }
    };

    async function generatePhoto(fileUrl) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        // setLoading(true);
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
          setRestoredImage(newPhoto[1]);
          console.log(newPhoto[1]);
        }
        // setTimeout(() => {
        //   setLoading(false);
        // }, 1300);
      }

      const handleRenderButtonClick = () => {
        if (originalPhoto) {
            generatePhoto(originalPhoto);
        } else {
            // Handle the case where originalPhoto is null
            console.log("No original photo available.");
        }
    };
    

    return (
        <div className="w-full flex gap-5 px-10 pt-10 justify-around">
            <div className="flex flex-col gap-7">
                <div
                    className="flex flex-col items-center justify-center border-dotted border-2 border-gray-400 p-6"
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <p>Drag and drop files here or click to browse.</p>
                        <ul className="mt-4">
                            {uploadedFiles.map((file) => (
                                <li key={file.name}>{file.name}</li>
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
                {/* Dropdown for theme */}
                <div className="flex flex-col gap-1">
                    <label className="text-white">Theme:</label>
                    <DropDown
                        theme={theme}
                        setTheme={(newTheme) => setTheme(newTheme)}
                        themes={themes}
                    />
                </div>

                {/* Dropdown for room */}
                <div className="flex flex-col gap-1">
                    <label className="text-white">Type of Room:</label>
                    <DropDown
                        theme={room}
                        setTheme={(newRoom) => setRoom(newRoom)}
                        themes={rooms}
                    />
                </div>
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p>Amount of renders</p>
                        <p className="text-gray-400 text-sm">
                            Each render costs 1 credit
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md"
                            onClick={() => handleRenderAmount("subtract")}
                        >
                            -
                        </button>
                        <p className="text-white w-3">{renderAmount}</p>
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md"
                            onClick={() => handleRenderAmount("add")}
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-black text-white px-4 py-2 rounded-md"
                        onClick={handleRenderButtonClick}
                    >
                        Render
                    </button>
                </div>
            </div>
            <div className="w-[3px] bg-gray-300 mx-5"></div>
            <div className=" grid grid-cols-2 gap-7">
                <Image src={roomOne} width={300} height={400} alt="room one" />
                <Image src={roomTwo} width={300} height={400} alt="room two" />
                <Image
                    src={roomThree}
                    width={300}
                    height={400}
                    alt="room three"
                />
                <Image src={roomTwo} width={300} height={400} alt="room two" />
            </div>
        </div>
    );
};

export default CreatePage;
