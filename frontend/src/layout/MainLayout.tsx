import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import LeftSideBar from "./components/LeftSideBar";

const MainLayout = () => {
    // Detect mobile screen size
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
                {/* Left Sidebar */}
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
                    <LeftSideBar/>
                </ResizablePanel>
                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>
                {/* Main Content */}
                <ResizablePanel defaultSize={isMobile?80:60}>
                    <Outlet/>
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>
                {/*Right Sidebar */}
                <ResizablePanel defaultSize={20} minSize={0} maxSize={25}>
                    friends activity   
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default MainLayout;

