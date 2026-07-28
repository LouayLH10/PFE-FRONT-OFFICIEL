"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import VoiceRecorder from "./voiceRecorder";

type Props = {
    open: boolean;
    processing: boolean;
    onClose: () => void;
    onProcessingChange: (value: boolean) => void;
        missingProducts: string[];
    onProductsNotFound: (products: string[]) => void;
};

export default function EstimateQuoteModal({
    open,
    processing,
    onClose,
    onProcessingChange,
    onProductsNotFound,
    missingProducts
}: Props) {

    const handleClose = () => {
        if (processing) return;
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            y: 30,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="
                            fixed
                            left-1/2
                            top-1/2
                            z-50
                            w-[520px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-3xl
                            bg-white
                            shadow-2xl
                            border
                            border-gray-200
                        "
                    >
                        <div className="flex items-center justify-between border-b p-6">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Estimate Quote
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Generate a quote using your voice.
                                </p>
                            </div>

                            <button
                                disabled={processing}
                                onClick={handleClose}
                                className="
                                    rounded-full
                                    p-2
                                    transition
                                    hover:bg-gray-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <X size={22} />
                            </button>

                        </div>

                        <div className="p-10">
                            <VoiceRecorder
    onProcessingChange={onProcessingChange}
        onProductsNotFound={onProductsNotFound}
    onClearMissingProducts={() => onProductsNotFound([])}
/>
                        </div>
{missingProducts.length > 0 && (

    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">

        <h3 className="text-red-700 font-semibold mb-2">
            Products not found
        </h3>

        <p className="text-sm text-gray-600 mb-3">
            The following products were not found in your catalog:
        </p>

        <ul className="space-y-2">

            {missingProducts.map((product) => (

                <li
                    key={product}
                    className="rounded-lg bg-white border border-red-100 px-3 py-2 text-red-600 font-medium"
                >
                    {product}
                </li>

            ))}

        </ul>

    </div>

)}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}