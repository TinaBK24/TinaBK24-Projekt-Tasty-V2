const Loading = () => {
    return (
        <section className="flex justify-center items-center h-48">
            <p className="text-lg text-gray-600">Loading...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </section>
    );
}

export default Loading;