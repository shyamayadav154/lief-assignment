import { type ReactNode } from "react";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

function ResizablePanel({ children }: { children: ReactNode }) {
    const [ref, { height }] = useMeasure();

    return (
        <motion.div
            animate={{ height: height || "auto" }}
            className="relative overflow-hidden"
        >
            <div
                ref={ref}
                className={`${height ? "absolute" : "relative"} w-full`}
            >
                {children}
            </div>
        </motion.div>
    );
}

export default ResizablePanel;
