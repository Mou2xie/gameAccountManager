'use client';

import { useState, useEffect } from "react";
import { SubAccountCard } from "@/components/SubAccountCard";
import { MainAccountCard } from "@/components/MainAccountCard";
import { subAccountService } from "@/services/subAccountService";
import { Modal } from "@/components/Modal";

type MainAccount = {
  id: number;
  account: string;
}

type SubAccount = {
  id: number;
  mainId: number;
  name: string;
  note: string;
}

const createSubAccount = async (mainId: number, name: string, note: string): Promise<SubAccount | null> => {
  try {
    const newSubAccount = await subAccountService.createSubAccount(mainId, name, note);
    return newSubAccount;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function Home() {

  const [currentMainAccount, setCurrentMainAccount] = useState<MainAccount | null>(null);
  const [subAccounts, setSubAccounts] = useState<Array<SubAccount>>([]);
  const [createSubAccountModalFlag, setCreateSubAccountModalFlag] = useState(false);
  const [newSubAccount, setNewSubAccount] = useState({ name: "", note: "" });

  // Fetch sub-accounts whenever the current main account changes
  useEffect(() => {
    currentMainAccount ?
      subAccountService.getSubAccountsByMainId(currentMainAccount?.id).then((res) => {
        setSubAccounts(res);
      }) : setSubAccounts([]);
  }, [currentMainAccount]);

  return (
    <div className=" space-y-5">
      <MainAccountCard currentMainAccount={currentMainAccount} setCurrentMainAccount={setCurrentMainAccount} />
      <div>
        {
          subAccounts.length > 0 && subAccounts.map((subAccount) => (
            <SubAccountCard key={subAccount.id} subAccount={subAccount} />
          ))
        }
      </div>
      {
        (currentMainAccount && subAccounts.length < 10) && (
          <div className=" w-1/2 h-12 mx-auto border border-gray-400 rounded-xl flex justify-center items-center text-gray-400 cursor-pointer"
            onClick={() => {
              setCreateSubAccountModalFlag(true);
            }}>
            新建子账号
          </div>
        )
      }
      {
        // create subaccount modal
        createSubAccountModalFlag && (
          <Modal isShow={createSubAccountModalFlag} setModalShow={setCreateSubAccountModalFlag}>
            <p className=" text-gray-500">新建子账号</p>
            <div className=" space-y-3 mt-5">
              <p className=" text-sm text-gray-400">子账号名称</p>
              <input type="text" className=" input focus:outline-none" value={newSubAccount.name} onChange={(e) => setNewSubAccount({ ...newSubAccount, name: e.target.value })} />
              <p className=" text-sm text-gray-400">备注</p>
              <input type="text" className=" input focus:outline-none" value={newSubAccount.note} onChange={(e) => setNewSubAccount({ ...newSubAccount, note: e.target.value })} />
              <button className=" block btn btn-outline btn-info" onClick={() => {
                if (!currentMainAccount) return;
                createSubAccount(currentMainAccount.id, newSubAccount.name, newSubAccount.note).then((newSubAccount) => {
                  if (newSubAccount) {
                    // refresh subaccount list
                    subAccountService.getSubAccountsByMainId(currentMainAccount.id).then((res) => {
                      setSubAccounts(res);
                      setCreateSubAccountModalFlag(false);
                      setNewSubAccount({ name: "", note: "" });
                    });
                  } else {
                    alert("创建失败");
                  }
                });
              }}>创建</button>
            </div>
          </Modal>
        )
      }
    </div>
  );
}
