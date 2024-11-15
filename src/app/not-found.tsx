import Link from "next/link";

const NotFound: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <p className="text-2xl font-semibold text-primary mt-4">Page Not Found</p>
                <p className="text-gray-500 mt-2">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
                <Link
                    href="/"
                    className="mt-6 inline-block bg-primary  text-white font-semibold py-2 px-4 rounded-full"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
