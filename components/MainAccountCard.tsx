import React from 'react';
import { useEffect, useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { Modal } from "@/components/Modal";
import { mainAccountService } from '@/services/mainAccountService';

type MainAccount = {
    id: number;
    account: string;
}

type MainAccountCardProps = {
    currentMainAccount: MainAccount | null;
    setCurrentMainAccount: React.Dispatch<React.SetStateAction<MainAccount | null>>;
}

export const MainAccountCard = ({ currentMainAccount, setCurrentMainAccount }: MainAccountCardProps) => {

    const [mainAccountsList, setMainAccountsList] = useState<Array<MainAccount>>([]);
    const [newMainAccount, setNewMainAccount] = useState("");
    const [createMainAccountModalFlag, setCreateMainAccountModalFlag] = useState(false);  // create new account modal state
    const [editMainAccountFlag, setEditMainAccountFlag] = useState<boolean>(false);  // edit account state

    useEffect(() => {
        // fetch all main accounts
        const fetchMainAccounts = async () => {
            const mainAccounts = await mainAccountService.getAllMainAccounts();
            setMainAccountsList(mainAccounts);
        }
        fetchMainAccounts();
    }, []);

    const handleCreateMainAccount = () => {
        mainAccountService.createMainAccount(newMainAccount).then((newAccount) => {
            newAccount && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(accounts);
                setCreateMainAccountModalFlag(false);
                setNewMainAccount("");
                alert("主账号创建成功");
            });
        });
    }

    const handleEditMainAccount = () => {
        if (!currentMainAccount) return;
        mainAccountService.updateMainAccount(currentMainAccount.id, currentMainAccount.account).then((res) => {
            res && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(accounts);
                setEditMainAccountFlag(false);
                alert("修改成功");
            });
        });
    }

    const handleDeleteMainAccount = () => {
        if (!currentMainAccount) return;
        mainAccountService.deleteMainAccount(currentMainAccount.id).then((res) => {
            res && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(accounts);
                setCurrentMainAccount(null);
            });
            alert("删除成功");
        });
    }

    return (
        <div className=" app-card flex flex-wrap items-center justify-between gap-6">
            <div className=" flex flex-col gap-2">
                <p className=" text-sm font-medium text-gray-500">当前账号</p>
                <div className=" relative min-w-[220px]">
                    <select
                        className=" app-select w-full pr-10"
                        value={currentMainAccount?.id || ""}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedAccount = mainAccountsList.find(account => account.id === selectedId) || null;
                            setCurrentMainAccount(selectedAccount);
                        }}>
                        <option value="">选择主账号</option>
                        {
                            mainAccountsList.map(({ id, account }) => <option key={id} value={id}>{account}</option>)
                        }
                    </select>
                    <span className=" pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        ▾
                    </span>
                </div>
            </div>
            <div className=" flex items-center gap-4">
                {
                    currentMainAccount && (
                        <>
                            <button
                                className=" icon-button"
                                onClick={() => setEditMainAccountFlag(true)}
                                title="重命名主账号"
                            >
                                <SquarePen className=" w-4 h-4" />
                            </button>
                            <button
                                className=" icon-button"
                                onClick={handleDeleteMainAccount}
                                title="删除主账号"
                            >
                                <Trash2 className=" w-4 h-4" />
                            </button>
                        </>
                    )
                }
                <button className=" app-btn-primary" onClick={() => setCreateMainAccountModalFlag(true)}>新建账号</button>
            </div>

            {/* create main account modal */}
            <Modal isShow={createMainAccountModalFlag} setModalShow={setCreateMainAccountModalFlag}>
                <p className=" text-gray-500">新建主账号</p>
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

            {/* edit main account modal */}
            <Modal isShow={editMainAccountFlag} setModalShow={setEditMainAccountFlag}>
                <p className=" text-gray-500">重命名当前账号</p>
                <div className=" flex flex-col gap-3 mt-5">
                    <input
                        type="text"
                        className=" app-input"
                        value={currentMainAccount?.account || ""}
                        onChange={(e) => setCurrentMainAccount({ ...currentMainAccount!, account: e.target.value })}
                    />
                    <button className=" app-btn-primary w-full" onClick={handleEditMainAccount}>保存</button>
                </div>
            </Modal>
        </div>
    );
}
