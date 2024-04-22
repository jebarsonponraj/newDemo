"use client";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";

const Particle = () => {
    const particleOptions = {
        preset: "stars",
        particles: {
            size: {
                value: 1,
            },
            move: {
                speed: 0.5,
                direction: "random",
            },
        },
    };

    const customInit = async (Engine) => {
        const test = await loadStarsPreset(Engine);
        return test;
    };

    return (
        <>
            <main className="particles z-10">
                <Particles options={particleOptions} init={customInit} />
            </main>
        </>
    );
};

export default Particle;