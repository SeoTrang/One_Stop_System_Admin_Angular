export interface NotificationType{
    id: number;
    type: string;
}

export interface NotificationReceivers{
    id: number;
    is_read: boolean;
    type_user: string;
    receiver_identifier: string;
    created_at: Date;
    updated_at: Date;
}

export interface NotificationActor{
    id: number;
    identifier: string;
    name: string;
    password: string;
    email: string;
    phone: string;
    isAdmin: boolean;
    address: string;
    gender: string;
    avatar: string;
    created_at: Date;
    updated_at: Date;

}

export interface AccountNotificationModel{
    id: number;
    entity_type: string;
    entity_id: number;
    actor_identifier: string;
    is_for_all: boolean;
    created_at: Date | string;
    updated_at: Date | string;
    entity_reference?: string;
    notification_type: NotificationType;
    notification_receivers: NotificationReceivers[];
    actor: NotificationActor;
    entity: string | null;


}