import {useCallback, useEffect, useRef, useState,} from "react";
import {ProgressNotificationData} from "../components/notifications/ProgressNotification";

interface NotificationQueueItem {
    id: string;
    data: ProgressNotificationData;
    timestamp: number;
}

const NOTIFICATION_DURATION = 3000;
const NOTIFICATION_GAP = 500;

export function useNotifications() {
    const [queue, setQueue] = useState<NotificationQueueItem[]>(
        [],
    );
    const [currentNotification, setCurrentNotification] =
        useState<NotificationQueueItem | null>(null);
    const timeoutRef = useRef<number | undefined>(undefined);
    const queueProcessingRef = useRef(false);

    const processQueue = useCallback(() => {
        if (queueProcessingRef.current) return;

        setQueue((prev) => {
            if (prev.length === 0) {
                queueProcessingRef.current = false;
                return prev;
            }

            const [next, ...rest] = prev;
            setCurrentNotification(next);
            queueProcessingRef.current = true;

            timeoutRef.current = window.setTimeout(() => {
                setCurrentNotification(null);
                queueProcessingRef.current = false;

                window.setTimeout(() => {
                    setQueue(rest);
                }, NOTIFICATION_GAP);
            }, NOTIFICATION_DURATION);

            return rest;
        });
    }, []);

    useEffect(() => {
        if (queue.length > 0 && !currentNotification) {
            processQueue();
        }
    }, [queue, currentNotification, processQueue]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const showNotification = useCallback(
        (data: ProgressNotificationData) => {
            const item: NotificationQueueItem = {
                id: `${Date.now()}-${Math.random()}`,
                data,
                timestamp: Date.now(),
            };

            setQueue((prev) => [...prev, item]);
        },
        [],
    );

    const hideNotification = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setCurrentNotification(null);
        queueProcessingRef.current = false;
    }, []);

    const clearQueue = useCallback(() => {
        setQueue([]);
        hideNotification();
    }, [hideNotification]);

    return {
        notification: currentNotification?.data ?? null,
        showNotification,
        hideNotification,
        clearQueue,
        queueLength: queue.length,
    };
}