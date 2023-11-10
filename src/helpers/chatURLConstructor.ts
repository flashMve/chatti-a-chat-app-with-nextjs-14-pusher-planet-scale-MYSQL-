

export const ChatURLContructor = (user1:string,user2:string) => {
    const chatId = user1+"--" + user2;

    return chatId;

}