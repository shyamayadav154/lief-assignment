import { Loader2 } from "lucide-react";

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="text-orange-500 h-10 w-10 animate-spin" />
        </div>
    );
}

export default LoadingSpinner;
