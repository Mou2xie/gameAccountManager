import Link from "next/link";

type TabItem = {
    label: string;
    href: string;
};

export const NavBar = () => {
    return (
        <nav className=" h-16 px-20 grid grid-cols-3 bg-white shadow-md shadow-gray-100">
            <div className=" flex items-center">
                <div className=" mr-3">魔力宝贝账号管理工具</div>
                <div className="badge badge-neutral badge-outline">v 0.0.9</div>
            </div>
            <div></div>
            <div className=" flex items-center justify-end gap-5 text-gray-500 text-sm">
                <Link href="/" className=" hover:text-gray-800">加入QQ群</Link>
                <Link href="/" className=" hover:text-gray-800">使用说明</Link>
            </div>
        </nav>
    );
}