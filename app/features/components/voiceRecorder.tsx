"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
type Props = {
    onProcessingChange?: (value: boolean) => void;
    onProductsNotFound?: (products: string[]) => void;
    onClearMissingProducts?: () => void;
};

export default function VoiceRecorder({
    onProcessingChange,
    onProductsNotFound,
    onClearMissingProducts,
}: Props) {

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const [recording, setRecording] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [seconds, setSeconds] = useState(0);
const [missingProducts, setMissingProducts] = useState<string[]>([]);
    useEffect(() => {

        if (!recording) return;

        const timer = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [recording]);

    const formatTime = (value: number) => {

        const min = Math.floor(value / 60);

        const sec = value % 60;

        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    };

    const startRecording = async () => {
onClearMissingProducts?.();
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const recorder = new MediaRecorder(stream);

        recorderRef.current = recorder;

        chunks.current = [];

        recorder.ondataavailable = (e) => {
            chunks.current.push(e.data);
        };

        recorder.start();

        setSeconds(0);

        setRecording(true);

    };

    const stopRecording = async () => {

        setRecording(false);

        recorderRef.current?.stop();

recorderRef.current!.onstop = async () => {

    try {

        setProcessing(true);
onProcessingChange?.(true);
        const blob = new Blob(chunks.current, {
            type: "audio/webm",
        });

        const formData = new FormData();
        formData.append(
            "audio",
            blob,
            "voice.webm",
        );

        const response = await axios.post(
            "http://localhost:3200/voice-assistant/audio",
            formData,
            {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        const url = window.URL.createObjectURL(response.data);

        const a = document.createElement("a");

        a.href = url;
        a.download = "quote.pdf";

        a.click();

        window.URL.revokeObjectURL(url);

    }
    catch (error: any) {

         if (
        error.response?.status === 404 &&
        error.response?.data?.missingProducts
    ) {

        onProductsNotFound?.(
            error.response.data.missingProducts
        );

        return;
    }

    }
    finally {

setProcessing(false);
onProcessingChange?.(false);
    }

};

    };

    return (

        <div className="flex flex-col items-center">

            <motion.div
                animate={
                    recording
                        ? {
                              scale: [1, 1.15, 1],
                          }
                        : {}
                }
                transition={{
                    repeat: Infinity,
                    duration: 1.3,
                }}
                className="
                    relative
                    flex
                    items-center
                    justify-center
                    w-36
                    h-36
                    rounded-full
                    bg-gradient-to-br
                    from-[#6C4DFF]
                    to-[#5A35FF]
                    shadow-xl
                "
            >

                {recording && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-400"
                        animate={{
                            scale: [1, 1.35],
                            opacity: [0.6, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                        }}
                    />
                )}

                {processing ? (
                    <Loader2
                        className="animate-spin text-white"
                        size={42}
                    />
                ) : recording ? (
                    <Square
                        fill="white"
                        className="text-white"
                        size={38}
                    />
                ) : (
                    <Mic
                        className="text-white"
                        size={42}
                    />
                )}

            </motion.div>

            <h3 className="mt-8 text-lg font-semibold">

                {processing
                    ? "Processing..."
                    : recording
                    ? "Listening..."
                    : "Ready to record"}

            </h3>

            <p className="text-gray-500 mt-2">

                {processing
                    ? "Generating your quote..."
                    : recording
                    ? formatTime(seconds)
                    : "Tap the microphone to start"}

            </p>

            <button
                disabled={processing}
                onClick={
                    recording
                        ? stopRecording
                        : startRecording
                }
                className="
                    mt-8
                    rounded-full
                    px-8
                    py-3
                    bg-[#6C4DFF]
                    text-white
                    font-medium
                    hover:bg-[#5A35FF]
                    transition
                    disabled:opacity-50
                "
            >
                {processing
                    ? "Please wait..."
                    : recording
                    ? "Stop Recording"
                    : "Start Recording"}
            </button>

        </div>

    );

}