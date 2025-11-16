'use client';

import { useState, useCallback, useEffect } from "react";
import { SubAccountCard } from "@/components/SubAccountCard";
import { MainAccountCard } from "@/components/MainAccountCard";
import { subAccountService } from "@/services/subAccountService";
import { initCardTimeScheduler } from "@/services/cardTimeScheduler";
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
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    document.body.classList.add("home-background");
    return () => {
      document.body.classList.remove("home-background");
    };
  }, []);

  useEffect(() => {
    initCardTimeScheduler();
  }, []);

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
      {!currentMainAccount && (
        <>
          {showWelcome ? (
            <article className="relative app-card space-y-5 text-base leading-relaxed text-[var(--color-text)] bg-[rgba(248,244,235,0.82)]">
              <button
                type="button"
                aria-label="隐藏欢迎内容"
                className="absolute right-4 top-4 app-btn-primary rounded-xl px-3 py-1 text-xs"
                onClick={() => setShowWelcome(false)}
              >
                隐藏
              </button>
              <p className=" text-lg font-semibold text-[var(--color-primary)]">
                法兰城的朋友，你好。
              </p>
              <p>
                欢迎使用
                <strong className=" text-app-primary">【魔力宝贝账号管理器 测试版】</strong>
              </p>
              <p>
                这是一个用来记录魔力宝贝账号下角色、宠物、物品的免费工具，由 @努力的小弟 和我一起打造。我们是两位普通的魔力玩家，同时也是互联网从业者，怀揣着对魔力宝贝的热爱，亲手打造了一款纯本地运行的账号记录小工具。
              </p>
              <p className=" font-semibold text-[var(--color-primary)]">🌟 它能干什么？</p>
              <p>帮你清晰地记录账号下角色、宠物、物品。</p>
              <p className=" font-semibold text-[var(--color-primary)]">🛡️ 它安全吗？</p>
              <p>
                请绝对放心！
                <strong className=" text-app-primary">
                  数据仅存于你的电脑，无服务器、不联网、绝不收集任何信息
                </strong>
                ，更与游戏账号密码无关。
              </p>
              <p>这只是一份来自玩家社群的心意，希望让我们的魔力之旅更轻松。</p>
              <p>诚挚邀请你成为首批内测用户，一起来体验和改善它！</p>
              <p>点击上方【新建主账号】按钮开始试用吧。</p>
              <div className=" border-t border-dashed border-[var(--color-border-strong)] pt-4 text-sm text-[var(--color-text-muted)]">
                *致我们永远的法兰城，与未曾磨灭的回忆。*
              </div>
            </article>
          ) : (
            <div className="app-card flex justify-end border border-dashed border-[var(--color-border-strong)] bg-[rgba(248,244,235,0.82)] px-4 py-3">
              <button
                type="button"
                aria-label="显示欢迎内容"
                className="app-btn-primary rounded-xl px-3 py-1 text-xs"
                onClick={() => setShowWelcome(true)}
              >
                显示
              </button>
            </div>
          )}
        </>
      )}
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
              className="app-btn-primary w-full rounded-xl max-w-xl border-1 border-[#C5DFE0] shadow cursor-pointer"
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
