import Link from "next/link";

export const NavBar = () => {
    return (
        <nav className=" bg-[var(--color-surface-card)] border-b border-[var(--color-border-strong)] shadow shadow-[rgba(57,51,43,0.08)]">
            <div className=" h-14 flex justify-between items-center px-14 ">
                <div className=" flex gap-2 text-base items-center font-semibold">
                    <span>魔力宝贝账号管理器 测试版</span>
                    <span className=" badge border border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-muted)] w-fit">
                        v 0.0.9
                    </span>
                </div>
                <div className="hidden md:flex md:items-center text-sm">
                    <Link
                        href="/"
                        className=" px-5 border-r border-[#d8d3c0] hover:text-[var(--color-primary)]"
                    >
                        首页
                    </Link>
                    <Link
                        href="/about"
                        className=" px-5 border-r border-[#d8d3c0] hover:text-[var(--color-primary)]"
                    >
                        关于我们
                    </Link>
                    <span className="px-5 ">萌新Q群：231443506</span>
                </div>
            </div>
        </nav>
    );
};
