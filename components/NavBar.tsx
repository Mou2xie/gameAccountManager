

type TabItem = {
    label: string;
    href: string;
};

export const NavBar = () => {
    return (
        <nav className=" bg-[var(--color-surface-card)] border-b border-[var(--color-border-strong)] shadow-md shadow-[rgba(57,51,43,0.08)]">
            <div className=" mx-auto flex flex-col gap-4 px-4 py-4 md:h-16 md:grid md:grid-cols-3 md:items-center md:gap-0 md:px-20 md:py-0">
                <div className=" flex flex-col gap-2 text-base font-semibold sm:flex-row sm:items-center">
                    <span>魔力宝贝账号管理器 测试版</span>
                    <span className=" badge border border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-muted)] w-fit">
                        v 0.0.9
                    </span>
                </div>
                <div className=" hidden md:block" />
                <div className=" flex items-center text-sm text-[var(--color-text-muted)] md:justify-end">
                    萌新Q群：231443506
                </div>
            </div>
        </nav>
    );
}
