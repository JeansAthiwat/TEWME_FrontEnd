import { LoaderCircle } from 'lucide-react';

export default function LoadingScreen() {
    return <>
        <div className="h-screen flex items-center justify-center">
            <LoaderCircle className="w-30 h-30 text-blue-300 animate-spin"/>
        </div>
    </>

}