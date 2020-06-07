<?php require_once('../essentials/header.php'); ?>

<div class="row message-ctn">
    <div class="col" v-if="errorMsg.isError"><span class="error">{{ errorMsg.message }}</span></div>
    <aside class="col m-3">
        <template v-for="user in userList">
            <user-thumb @change-active-chat="changeActiveChat(user.p_id)" :user="user" :activeUser="activeChatWithUser"></user-thumb>
        </template>
    </aside>
    <div class="col m-9">
        <div class="message-box">
            <div class="inner-ctn">
                <template v-for="chat in activeChatList">
                    <chat-bubble :chat="chat" :iAmUser="isUser"></chat-bubble>
                </template>
            </div>
        </div>
        <form @submit.prevent="onSubmit" method="post" class="send-form">
            <textarea name="send_chat" id="send_chat" class="round-border-box" v-model="messageContent"></textarea>
            <button type="submit" class="submit-button"><i class="fa fa-paper-plane"></i></button>
        </form>
    </div>
</div>

<?php require_once('../essentials/footer.php'); ?>