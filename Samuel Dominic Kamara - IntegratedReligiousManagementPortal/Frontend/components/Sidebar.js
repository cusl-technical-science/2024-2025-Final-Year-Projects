import Link from "next/link";

const Sidebar = ({ className }) => (
    <div className={`bg-gray-800 text-white p-6 fixed h-full w-64 ${className} flex-shrink-0`}>
        <h2 className="text-xl font-bold mb-6">
            <Link href="/" passHref>
                <span className="cursor-pointer hover:bg-gray-700 p-2 block rounded">IRM Dashboard</span>
            </Link>
        </h2>
        <ul>
            <li className="mb-4">
                <Link href="/affiliateMembers" passHref>
                    <span className="cursor-pointer hover:bg-gray-700 p-2 block rounded">Affiliate Member</span>
                </Link>
            </li>
            <li className="mb-4">
                <Link href="/announcements" passHref>
                    <span className="cursor-pointer hover:bg-gray-700 p-2 block rounded">Announcement</span>
                </Link>
            </li>
            <li className="mb-4">
                <Link href="/events" passHref>
                    <span className="cursor-pointer hover:bg-gray-700 p-2 block rounded">Event</span>
                </Link>
            </li>
        </ul>
    </div>
);

export default Sidebar;
