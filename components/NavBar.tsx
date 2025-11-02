import Link from "next/link";

type TabItem = {
    label: string;
    href: string;
};

const tabs: TabItem[] = [
    // { label: '账号列表', href: '/' },
];

export const NavBar = () => {
    return (
        <nav className=" h-16 px-20 grid grid-cols-3 border">
            <div className=" flex items-center">
                <div className=" mr-3">魔力宝贝账号管理工具</div>
                <div className="badge badge-neutral badge-outline">v 0.0.9</div>
            </div>
            {
                tabs.length > 0 && (
                    <div className=" flex justify-center items-center gap-8">
                        {
                            tabs.map((tab) => (
                                <Link key={tab.href} href={tab.href}>{tab.label}</Link>
                            ))
                        }
                    </div>
                )
            }
            <div></div>
        </nav>
    );
}