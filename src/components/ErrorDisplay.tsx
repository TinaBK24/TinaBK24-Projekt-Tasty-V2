interface ErrorDisplayProps {
    errorMessage: string;
    onRetry?: () => void; // Функція для повторної спроби
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry }) => {
    return (
        <section className="flex flex-col justify-center items-center h-48 p-4">
            <p className="text-lg text-red-600 mb-4">Error: {errorMessage}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Retry
                </button>
            )}
        </section>
    );
}

export default ErrorDisplay;