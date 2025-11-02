import React from 'react';
import { useEffect, useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { Modal } from "@/components/Modal";
import { mainAccountService } from '@/services/mainAccountService';

type MainAccount = {
    id: number;
    account: string;
}

export const MainAccountCard = ({ setCurrentMainAccount }: { setCurrentMainAccount: React.Dispatch<React.SetStateAction<MainAccount | null>> }) => {

    const [mainAccountsList, setMainAccountsList] = useState<Array<MainAccount>>([]);
    const [mainAccountDisplay, setMainAccountDisplay] = useState<MainAccount | null>(null);  // current displayed account
    const [newMainAccount, setNewMainAccount] = useState("");
    const [createMainAccountModalFlag, setCreateMainAccountModalFlag] = useState(false);  // create new account modal state
    const [editMainAccountFlag, setEditMainAccountFlag] = useState<boolean>(false);  // edit account state

    useEffect(() => {
        // fetch all main accounts
        const fetchMainAccounts = async () => {
            const accounts = await mainAccountService.getAllMainAccounts();
            setMainAccountsList(accounts);
        }
        fetchMainAccounts();
    }, []);

    const handleCreateMainAccount = () => {
        mainAccountService.createMainAccount(newMainAccount).then((res) => {
            res && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(accounts);
                setCreateMainAccountModalFlag(false);
                setNewMainAccount("");
                alert("主账号创建成功");
            });
        });
    }

    const handleEditMainAccount = () => {
        if (!mainAccountDisplay) return;
        mainAccountService.updateMainAccount(mainAccountDisplay.id, mainAccountDisplay.account).then((res) => {
            res && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(accounts);
                setEditMainAccountFlag(false);
                alert("修改成功");
            });
        });
    }

    const handleDeleteMainAccount = () => {
        if (!mainAccountDisplay) return;
        mainAccountService.deleteMainAccount(mainAccountDisplay.id).then((res) => {
            res && mainAccountService.getAllMainAccounts().then((accounts) => {
                setMainAccountsList(accounts);
                setMainAccountDisplay(null);
                alert("删除成功");
            });
        });
    }

    return (
        <div className=" flex justify-between items-center h-20 bg-gray-100 rounded-xl px-10">
            <div className=" flex items-center gap-3">
                <p className=" text-gray-500">当前账号:</p>
                <select defaultValue={mainAccountsList.length === 0 ? '无可用主账号' : '选择主账号'} className="select w-50 focus:outline-none" onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    setCurrentMainAccount(mainAccountsList.find(account => account.id === selectedId) || null);
                    setMainAccountDisplay(mainAccountsList.find(account => account.id === selectedId) || null);
                }}>
                    <option disabled={true}>{mainAccountsList.length === 0 ? '无可用主账号' : '选择主账号'}</option>
                    {
                        mainAccountsList.map(({ id, account }) => <option key={id} value={id}>{account}</option>)
                    }
                </select>
            </div>
            <div className=" flex items-center gap-8">
                {
                    mainAccountDisplay && (
                        <>
                            <div className=" flex items-center gap-1 cursor-pointer" onClick={() => setEditMainAccountFlag(true)}>
                                <SquarePen size={20} className=" text-gray-400" />
                                <span className=" text-gray-400">编辑</span>
                            </div>
                            <div className=" flex items-center gap-1 cursor-pointer" onClick={handleDeleteMainAccount}>
                                <Trash2 size={20} className=" text-gray-400" />
                                <span className=" text-gray-400">删除</span>
                            </div>
                        </>
                    )
                }
                <button className="btn btn-outline btn-secondary" onClick={() => setCreateMainAccountModalFlag(true)}>新建账号</button>
            </div>

            {/* create main account modal */}
            <Modal isShow={createMainAccountModalFlag} setModalShow={setCreateMainAccountModalFlag}>
                <p className=" text-gray-500">新建主账号</p>
                <div className=" flex gap-2 mt-5">
                    <input type="text" placeholder="输入主账号" className=" input w-1/2 focus:outline-none" onChange={(e) => setNewMainAccount(e.target.value)} />
                    <button className=" block btn btn-outline btn-info" disabled={!newMainAccount} onClick={handleCreateMainAccount}>创建</button>
                </div>
            </Modal>

            {/* edit main account modal */}
            <Modal isShow={editMainAccountFlag} setModalShow={setEditMainAccountFlag}>
                <p className=" text-gray-500">重命名当前账号</p>
                <div className=" flex gap-2 mt-5">
                    <input type="text" className=" input w-1/2 focus:outline-none" value={mainAccountDisplay?.account || ""} onChange={(e) => setMainAccountDisplay({ ...mainAccountDisplay!, account: e.target.value })} />
                    <button className=" block btn btn-outline btn-info" onClick={handleEditMainAccount}>保存</button>
                </div>
            </Modal>
        </div>
    );
}