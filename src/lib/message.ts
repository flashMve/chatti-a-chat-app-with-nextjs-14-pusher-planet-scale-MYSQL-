
export type Chat = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    sender: string;
    receiver: string;
    messages: Message[];
}


export type Message = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    chatId: string;
    senderId: string;
}


export type Friend = {

    friendId: string;
    userId: string;
    friend: {
        id: string;
        name: string;
        email: string;
        emailVerified: string;
        image: string;
    }
}