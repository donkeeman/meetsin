import { useState, useEffect } from "react";
import {
    startSubscription,
    cancelSubscription,
    getExistingSubscription,
    useCreateSubscriptionToDB,
    useDeleteSubscriptionFromDB,
} from "@/apis/service/notification.service";
import style from "./notificationSwitch.module.scss";

const NotificationSwitch = () => {
    const [hasSubscription, setHasSubscription] = useState<boolean>();

    useEffect(() => {
        const getActiveSubscription = async () => {
            const subscription = await getExistingSubscription();
            setHasSubscription(!!subscription);
        };
        getActiveSubscription();
    }, []);

    const { mutate: createSubscription } = useCreateSubscriptionToDB();
    const { mutate: deleteSubscription } = useDeleteSubscriptionFromDB();

    const toggleNotificationSwitch = async (isOn: boolean) => {
        try {
            if (isOn) {
                const subscription = (await startSubscription()) as PushSubscription;
                if (subscription) {
                    createSubscription({ subscription });
                }
            } else {
                const cancelSuccess = await cancelSubscription();
                if (cancelSuccess) {
                    deleteSubscription();
                }
            }

            setHasSubscription(isOn);
        } catch (error) {
            console.error(error);
        }
    };

    return hasSubscription ? (
        <button
            type="button"
            className={style.on}
            onClick={() => toggleNotificationSwitch(false)}
        />
    ) : (
        <button
            type="button"
            className={style.off}
            onClick={() => toggleNotificationSwitch(true)}
        />
    );
};
export default NotificationSwitch;
