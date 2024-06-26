import ProfileImage from "@/components/common/profileImage/profileImage";
import UserInfo from "@/components/common/userInfo/userInfo";
import { IMAGE_SIZE_TYPE } from "@/constants/imageSize.const";
import React from "react";
import style from "./style.module.scss";

function page() {
    return (
        <>
            <ProfileImage src="https://picsum.photos/id/237/200/300" size={IMAGE_SIZE_TYPE.large} />
            <UserInfo direction="bottom" />
            <input type="text" className={style.input} placeholder="메세지를 입력하세요" />
        </>
    );
}

export default page;
