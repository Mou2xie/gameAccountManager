import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from "@/components/Modal";
import { mainAccountService } from '@/services/mainAccountService';
import type { IMainAccount } from '@/libs/db';

type MainAccountWithId = IMainAccount & { id: number };

type MainAccountCardProps = {
    currentMainAccount: MainAccountWithId | null;
    onSelectMainAccount: (account: MainAccountWithId | null) => void;
};

export const MainAccountCard = ({ currentMainAccount, onSelectMainAccount }: MainAccountCardProps) => {

    const [mainAccountsList, setMainAccountsList] = useState<MainAccountWithId[]>([]);
    const [newMainAccount, setNewMainAccount] = useState("");
    const [createMainAccountModalFlag, setCreateMainAccountModalFlag] = useState(false);  // create new account modal state

    useEffect(() => {
        // fetch all main accounts
        const fetchMainAccounts = async () => {
            const mainAccounts = await mainAccountService.getAllMainAccounts();
            setMainAccountsList(
                mainAccounts.filter(
                    (account): account is MainAccountWithId => account.id !== undefined,
                ),
            );
        }
        fetchMainAccounts();
    }, []);

    const handleCreateMainAccount = () => {
        mainAccountService.createMainAccount(newMainAccount).then((newAccountId) => {
            newAccountId && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(
                    accounts.filter(
                        (account): account is MainAccountWithId => account.id !== undefined,
                    ),
                );
                setCreateMainAccountModalFlag(false);
                setNewMainAccount("");
                alert("主账号创建成功");
            });
        });
    }

    const handleDeleteMainAccount = () => {
        if (!currentMainAccount) return;
        const confirmed = window.confirm(`确定删除主账号「${currentMainAccount.account}」吗？`);
        if (!confirmed) {
            return;
        }
        mainAccountService.deleteMainAccount(currentMainAccount.id).then((res) => {
            res && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(
                    accounts.filter(
                        (account): account is MainAccountWithId => account.id !== undefined,
                    ),
                );
                onSelectMainAccount(null);
            });
            alert("删除成功");
        });
    }

    return (
        <div className=" app-card flex flex-wrap items-center justify-between gap-6">
            <div className=" flex items-center gap-3">
                <p className=" text-sm font-medium text-[var(--color-text-muted)]">当前主账号</p>
                <div className=" relative min-w-[220px]">
                    <select
                        className=" app-select w-full pr-10"
                        value={currentMainAccount?.id || ""}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedAccount = mainAccountsList.find(account => account.id === selectedId) || null;
                            onSelectMainAccount(selectedAccount);
                        }}>
                        <option value="">选择主账号</option>
                        {
                            mainAccountsList.map(({ id, account }) => <option key={id} value={id}>{account}</option>)
                        }
                    </select>
                    <span className=" pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)] opacity-70">
                        ▾
                    </span>
                </div>
            </div>
            <div className=" flex items-center gap-4">
                {
                    currentMainAccount && (
                        <>
                            <button
                                className=" icon-button hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]"
                                onClick={handleDeleteMainAccount}
                                title="删除主账号"
                            >
                                <Trash2 className=" w-4 h-4" />
                            </button>
                        </>
                    )
                }
                <button className=" app-btn-primary cursor-pointer" onClick={() => setCreateMainAccountModalFlag(true)}>新建主账号</button>
            </div>

            {/* create main account modal */}
            <Modal isShow={createMainAccountModalFlag} setModalShow={setCreateMainAccountModalFlag}>
                <p className=" text-[var(--color-text-muted)]">新建主账号</p>
                <div className=" flex flex-col gap-3 mt-5">
                    <input
                        type="text"
                        placeholder="输入主账号"
                        className=" app-input"
                        onChange={(e) => setNewMainAccount(e.target.value)}
                    />
                    <button
                        className=" app-btn-primary w-full"
                        disabled={!newMainAccount.trim()}
                        onClick={handleCreateMainAccount}
                    >
                        创建
                    </button>
                </div>
            </Modal>

        </div>
    );
}
