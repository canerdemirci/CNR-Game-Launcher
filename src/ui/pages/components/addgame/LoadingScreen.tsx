import { MainLayout } from "../../../components/MainLayout"
import StickLoading from "../../../components/StickLoading"

export default function LoadingScreen() {
    return (
        <MainLayout>
            <div className="w-full h-full flex justify-center items-center">
                <StickLoading />
            </div>
        </MainLayout>
    )
}