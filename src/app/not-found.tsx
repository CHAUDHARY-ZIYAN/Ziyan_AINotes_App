import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-blue-50 p-4 rounded-full inline-block mb-6">
                    <FileQuestion className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                    Please check the URL or return to the dashboard.
                </p>
                <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
