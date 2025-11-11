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
      {
        !currentMainAccount && (
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
                  你好，老朋友。
                </p>
                <p>
                  当法兰城的音乐再次响起，你是否也和我们一样，心头会泛起熟悉的温暖？那些在魔力世界里结识的朋友、养大的宠物、完成的任务，早已不仅是游戏数据，而是我们共同珍藏的回忆。
                </p>
                <p>
                  我们是两位普通的互联网人，也是和你们一样的魔力玩家。在每天与代码打交道的日子里，我们总想着：能不能用我们最熟悉的方式，为这个带给我们无数感动的游戏做点什么呢？
                </p>
                <p>
                  这个小小的愿望，最终变成了你眼前这个简单的小工具。
                </p>
                <p>
                  它的诞生再简单不过——我们在游戏里发现，随着玩的深入，大家的账号越来越多，角色信息越来越杂。有时翻遍笔记也想不起来，哪个账号存着心爱的僵尸，哪个角色还留着当年打UD的回忆。用文本文档？记在手机备忘录？总觉得少了点什么。
                </p>
                <p>
                  于是，在忙碌的工作之余，我们挤出时间，一行行代码敲出了这个完全免费的小工具。没有复杂的商业模式，不追求华丽的界面，只想用最朴实的方式，解决我们自己在玩游戏时遇到的困扰。
                </p>
                <p>
                  我们深知账号安全的重要性——
                  <strong className=" text-app-primary">
                    请放心，这个工具的所有数据都只保存在你的电脑上，我们没有任何服务器来存储你的信息。
                  </strong>
                  它不会要求你输入密码，不会连接网络，更没有任何木马或后门。它就像你书桌抽屉里那个带锁的笔记本，只有你自己能打开。
                </p>
                <p>
                  这其实只是两位魔力玩家的心意分享。在这个什么都讲究效率的时代，我们选择用这种最笨拙的方式，守护属于我们共同的魔力记忆。
                </p>
                <p>
                  真诚地邀请你试试这个工具，希望它能让你在魔力世界里的旅程更加轻松愉快。或许某天在法兰城的街头，我们的角色会擦肩而过——那时，我们会在心里默默道一声：“加油，老朋友。”
                </p>
                <div className=" border-t border-dashed border-[var(--color-border-strong)] pt-4 text-sm text-[var(--color-text-muted)]">
                  *献给我们永远的法兰城。*
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
        )
      }
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
