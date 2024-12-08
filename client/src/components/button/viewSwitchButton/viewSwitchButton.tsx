import React, { MouseEventHandler } from "react";
import style from "./viewSwitchButton.module.scss";
import Image from "next/image";
import Button from "@/components/common/button/button";

interface IProps {
    className: string
    disabled: boolean
    isMeetingView: boolean
    onClick: MouseEventHandler
}

const viewSwitchButton = ({className, disabled, isMeetingView, onClick}: IProps) => {
    const buttonType = isMeetingView ? "ghost" : "solid";
    const icon = isMeetingView ? "/chevron_left.svg" : "/device-desktop.svg";
    const text = isMeetingView ? "돌아가기" : "화면 공유 보기";
    const buttonWidth = isMeetingView ? 110 : 142
    return (
        <div className={className}>
            <Button text={text} leftIcon={icon} look={buttonType} disabled={disabled} onClick={onClick} width={buttonWidth} />
        </div>
    );
};

export default viewSwitchButton;