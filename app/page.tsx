'use client';

import { useState, useCallback } from "react";
import { SubAccountCard } from "@/components/SubAccountCard";
import { MainAccountCard } from "@/components/MainAccountCard";
import { subAccountService } from "@/services/subAccountService";
import { Modal } from "@/components/Modal";
import type { ISubAccount, IMainAccount } from "@/libs/db";

type MainAccountWithId = IMainAccount & { id: number };

const createSubAccount = async (mainId: number, name: string, note: string): Promise<number | null> => {
  try {
    const newSubAccountId = await subAccountService.createSubAccount(mainId, name, note);
    return newSubAccountId;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function Home() {

  const [currentMainAccount, setCurrentMainAccount] = useState<MainAccountWithId | null>(null);
  const [subAccounts, setSubAccounts] = useState<Array<ISubAccount>>([]);
  const [createSubAccountModalFlag, setCreateSubAccountModalFlag] = useState(false);
  const [newSubAccount, setNewSubAccount] = useState({ name: "", note: "" });

  const loadSubAccounts = useCallback(async (mainAccountId: number) => {
    const list = await subAccountService.getSubAccountsByMainId(mainAccountId);
    setSubAccounts(list);
  }, []);

  const handleMainAccountChange = useCallback((account: MainAccountWithId | null) => {
    setCurrentMainAccount(account);
    if (!account?.id) {
      setSubAccounts([]);
      return;
    }
    void loadSubAccounts(account.id);
  }, [loadSubAccounts]);

  const currentMainAccountId = currentMainAccount?.id ?? null;

  const refreshSubAccounts = useCallback(async () => {
    if (!currentMainAccountId) {
      setSubAccounts([]);
      return;
    }
    await loadSubAccounts(currentMainAccountId);
  }, [currentMainAccountId, loadSubAccounts]);

  return (
    <div className=" space-y-6">
      <MainAccountCard currentMainAccount={currentMainAccount} onSelectMainAccount={handleMainAccountChange} />
      <div className=" space-y-6">
        {
          subAccounts.length > 0 && subAccounts.map((subAccount) => (
            <SubAccountCard
              key={subAccount.id ?? subAccount.name}
              subAccount={subAccount}
              onSubAccountMutate={refreshSubAccounts}
            />
          ))
        }
      </div>
      {
        (currentMainAccount && subAccounts.length < 10) && (
          <div className=" flex justify-center">
            <button
              className="app-btn-primary w-full rounded-xl max-w-xl"
              onClick={() => setCreateSubAccountModalFlag(true)}
            >
              新建子账号
            </button>
          </div>
        )
      }
      {
        // create subaccount modal
        createSubAccountModalFlag && (
          <Modal isShow={createSubAccountModalFlag} setModalShow={setCreateSubAccountModalFlag}>
            <p className=" text-[var(--color-text-muted)]">新建子账号</p>
            <div className=" space-y-3 mt-5">
              <p className=" text-sm text-[var(--color-text-muted)]">子账号名称</p>
              <input type="text" className=" app-input" value={newSubAccount.name} onChange={(e) => setNewSubAccount({ ...newSubAccount, name: e.target.value })} />
              <p className=" text-sm text-[var(--color-text-muted)]">备注</p>
              <input type="text" className=" app-input" value={newSubAccount.note} onChange={(e) => setNewSubAccount({ ...newSubAccount, note: e.target.value })} />
              <button
                className=" app-btn-primary w-full"
                onClick={async () => {
                  if (!currentMainAccount) return;
                  const newSubAccountId = await createSubAccount(
                    currentMainAccount.id,
                    newSubAccount.name,
                    newSubAccount.note,
                  );
                  if (newSubAccountId) {
                    await refreshSubAccounts();
                    setCreateSubAccountModalFlag(false);
                    setNewSubAccount({ name: "", note: "" });
                  } else {
                    alert("创建失败");
                  }
                }}
              >
                创建
              </button>
            </div>
          </Modal>
        )
      }
    </div>
  );
}
