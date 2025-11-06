

type TabItem = {
    label: string;
    href: string;
};

export const NavBar = () => {
    return (
        <nav className=" h-16 px-20 grid grid-cols-3 bg-[var(--color-surface-card)] border-b border-[var(--color-border-strong)] shadow-md shadow-[rgba(57,51,43,0.08)]">
            <div className=" flex items-center">
                <div className=" mr-3 font-semibold ">魔力宝贝账号管理工具 测试版</div>
                <div className="badge border border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-muted)]">v 0.0.9</div>
            </div>
            <div></div>
            <div className=" flex items-center justify-end gap-5 text-[var(--color-text-muted)] text-sm">
                Q群：231443506
            </div>
        </nav>
    );
}
