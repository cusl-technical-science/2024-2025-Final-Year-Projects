import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Reduced sidebar width */}
            <Sidebar className="w-1/6" /> {/* Sidebar set to 16.67% width */}
            <div className="flex flex-col flex-grow ml-64"> {/* Add margin-left to prevent content overlap */}
                <Navbar />
                <main className="p-8 overflow-y-auto max-w-4xl mx-auto"> {/* Center the content */}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
