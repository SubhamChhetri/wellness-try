import { LoaderCircle } from 'lucide-react';

const Loading: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <LoaderCircle className="w-14 h-14 text-primary animate-spin" />
            </div>
        </div>
    );
};

export default Loading;
