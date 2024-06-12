"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";

import {
  DynamicConnectButton,
  useDynamicContext,
  useSocialAccounts,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";

import { ProviderEnum } from "@dynamic-labs/sdk-api";

import { useRouter } from "next/navigation";

export default function CabalPage() {
  const { user, authToken, handleUnlinkWallet, primaryWallet, handleLogOut } =
    useDynamicContext();
  const {
    linkSocialAccount,
    unlinkSocialAccount,
    isLinked,
    getLinkedAccountInformation,
  } = useSocialAccounts();

  const userWallets = useUserWallets();
  const router = useRouter();

  const [cabalNameInput, setCabalNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      setIsLoading(false);
      router.push(`/joined`);
    } catch (error) {
      console.log("Error creating cabal. Please try again later.");
      console.error("error creating cabal", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkWalletCb = async () => {
    if (primaryWallet) {
      await handleUnlinkWallet(primaryWallet.id);
      await handleLogOut();
    }
  };

  const handleUnlinkTwitterCb = async () => {
    if (isLinked(ProviderEnum.Twitter)) {
      await unlinkSocialAccount(ProviderEnum.Twitter);
    }
  };

  const handleConnectTwitter = (e: any) => {
    e.preventDefault();
    linkSocialAccount(ProviderEnum.Twitter);
  };

  const isTwitterLinked = isLinked(ProviderEnum.Twitter);
  const userWalletAddress = primaryWallet?.address;
  const userEns = user?.ens?.name;

  const formattedUserWalletAddress =
    userWalletAddress && userWalletAddress.length >= 1
      ? userWalletAddress.slice(0, 4) + ".." + userWalletAddress.slice(-4)
      : "Invalid address";
  const twitterUsername = getLinkedAccountInformation(
    ProviderEnum.Twitter
  )?.username;

  const canSubmit = userWalletAddress && cabalNameInput.trim() && !isLoading;

  return (
    <>
      <div className="flex flex-col items-center gap-16 w-full max-w-[400px]">
        {/* step 1 wrap */}

        {/* step 2 wrap */}
        <div className="flex flex-col items-center">
          <div className="text-center text-[#837E78]"> 2. Connect wallet</div>
          {userWalletAddress ? (
            <div className="flex flex-row mt-8">
              <div className=" max-w-[300px] text-ellipsis overflow-hidden">
                {userEns ? userEns : formattedUserWalletAddress}
              </div>
              <button
                className="text-[#837E78] ml-3"
                onClick={handleUnlinkWalletCb}
              >
                x
              </button>
            </div>
          ) : (
            <DynamicConnectButton>
              <div className="pt-2 pb-1 px-3 border-[#F4EFE8] border-[3px] border-solid text-[#F4EFE8] mt-8">
                Connect
              </div>
            </DynamicConnectButton>
          )}
        </div>

        {/* step 3 wrap */}
        <div className="flex flex-col items-center text-center">
          <div className="text-center text-[#837E78] mb-4">
            {" "}
            3. Connect twitter (optional)
          </div>
          <div className="text-[10px] text-[#837E78]">
            Earns extra points for your cabal
          </div>
          {userWalletAddress ? (
            !isTwitterLinked ? (
              <button
                className="pt-2 pb-1 px-3 border-[#F4EFE8] border-[3px] border-solid text-[#F4EFE8] mt-8"
                onClick={handleConnectTwitter}
              >
                Connect
              </button>
            ) : (
              <div className="flex flex-row mt-8">
                <div className="">{`@${twitterUsername}`}</div>
                <button
                  className="text-[#837E78] ml-3"
                  onClick={handleUnlinkTwitterCb}
                >
                  x
                </button>
              </div>
            )
          ) : (
            <button
              disabled
              className="pt-2 pb-1 px-3 border-[#837E78] border-[3px] border-solid text-[#837E78] mt-8"
            >
              Connect Wallet first
            </button>
          )}
        </div>

        <div className="flex flex-col align-center items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={
              !canSubmit
                ? "pt-[7px] pb-1 px-3 opacity-50 bg-[#847E78] border-[3px] border-[#847E78] text-[#130E08]"
                : "pt-[7px] pb-1 px-3 border-[#F4EFE8] border-[3px] border-solid bg-[#F4EFE8] text-[#130E08]"
            }
          >
            {isLoading ? "Creating..." : `Create & join`}
          </button>
          <div className="text-center text-[#F2A548] max-w-[300px]"></div>
        </div>
      </div>
    </>
  );
}
