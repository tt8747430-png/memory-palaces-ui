export default function ProgressIllustration() {
    return (
        <div className="relative size-full flex items-center justify-center">
            <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 opacity-40"
            >
                <circle cx="40" cy="40" r="36" stroke="#091A7A" strokeWidth="2" strokeDasharray="6 4"/>
                <path d="M28 42l8 8 16-20" stroke="#091A7A" strokeWidth="3" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </div>
    );
}