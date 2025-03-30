"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useAtomValue } from "jotai";
import { screenShareStateAtom } from "@/jotai/atom";
import Chat from "@/components/chat/chat";
import Menu from "@/components/menu/menu";
import ScreenWindow from "@/components/screen/window/screenWindow";
import Skeleton from "@/components/common/skeleton/skeleton";
import ViewSwitchButton from "@/components/buttons/viewSwitch/viewSwitchButton";
import RoomGradientBackground from "@/components/background/room/roomGradientBackground";
import useChatSocket from "@/app/room/[roomId]/hooks/useChatSocket";
import { useScreenShare } from "./hooks/useScreenShare";
import { IScreenShareState } from "@/types/peer.type";
import { useGetRoomData } from "@/apis/service/room.service";
import style from "./style.module.scss";

const PhaserMap = dynamic(() => import("../../../components/phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const Room = () => {
    const screenShareState = useAtomValue(screenShareStateAtom);

    const [chatOpen, setChatOpen] = useState<boolean>(true);
    const [isMeetingView, setMeetingView] = useState<boolean>(false);

    const params = useParams();
    const roomId = params.roomId as string;
    const { data, isError } = useGetRoomData(roomId);

    const { roomUsers, messages } = useChatSocket({ roomId });
    const { currentPeers, startScreenShare, stopScreenShare, setPeerId, setCurrentPeers } =
        useScreenShare(roomId);

    if (isError) {
        notFound();
    }

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    const toggleView = () => {
        setMeetingView(!isMeetingView);
    };

    const handleScreenShare = () => {
        screenShareState === IScreenShareState.SELF_SHARING
            ? stopScreenShare()
            : startScreenShare();
    };

    const isScreenSharing = useMemo(() => {
        return screenShareState !== IScreenShareState.NOT_SHARING;
    }, [screenShareState]);

    useEffect(() => {
        if (screenShareState === IScreenShareState.SELF_SHARING) {
            setMeetingView(true);
        } else if (screenShareState === IScreenShareState.NOT_SHARING) {
            setMeetingView(false);
        }
    }, [screenShareState]);

    useEffect(() => {
        if (roomUsers.length !== 0) {
            const tempPeers = new Map();
            roomUsers.forEach((user) => {
                tempPeers.set(setPeerId(user.userId), {
                    user,
                    peerId: setPeerId(user.userId),
                    stream: undefined,
                    connection: undefined,
                });
            });
            setCurrentPeers(tempPeers);
        }
    }, [roomUsers, setCurrentPeers, setPeerId]);

    // unmount 시 화면 공유 중지 및 모든 연결 해제
    useEffect(() => {
        return () => {
            stopScreenShare();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const registerServiceWorker = async () => {
            if (!("serviceWorker" in navigator)) {
                alert(
                    "이 브라우저는 서비스 워커를 제공하지 않아 푸시 알림 기능이 지원되지 않습니다.",
                );
                return;
            }

            await navigator.serviceWorker.register("/serviceWorker.js");
        };
        registerServiceWorker();
    }, []);

    return (
        <>
            <main className={style.main}>
                <RoomGradientBackground className={style.gradient_background} />
                <div className={style.container}>
                    <ViewSwitchButton
                        className={style.switch}
                        disabled={!isScreenSharing}
                        isMeetingView={isMeetingView}
                        onClick={toggleView}
                    />
                    <div className={style.map_container}>
                        <PhaserMap />
                        {isMeetingView && (
                            <ScreenWindow peerList={currentPeers} className={style.screen} />
                        )}
                    </div>
                    {chatOpen && (
                        <Chat
                            messages={messages}
                            className={style.chat}
                            toggleChat={toggleChat}
                            roomTitle={data?.roomName ?? ""}
                        />
                    )}
                </div>
                <Menu
                    className={style.menu}
                    onScreenShare={handleScreenShare}
                    toggleChat={toggleChat}
                    roomUsers={roomUsers}
                />
            </main>
        </>
    );
};

export default Room;
