import Link from "next/link";

export const NavBar = () => {
    return (
        <nav className=" h-16 px-20 grid grid-cols-3 border">
            <div className=" flex items-center">
                <div className=" mr-3">魔力宝贝账号管理工具</div>
                <div className="badge badge-neutral badge-outline">v 0.0.9</div>
            </div>
            <div className=" flex justify-center items-center gap-8">
                <Link href="/" >账号管理</Link>
                <Link href="/" >账号详情</Link>
                <Link href="/" >标签管理</Link>
            </div>
            <div></div>
        </nav>
    );
}