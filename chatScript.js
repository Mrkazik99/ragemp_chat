//settings
const maxLocalMessages = 50;


let remoteName = 'Mrkazik99';
let remoteId = 0;
let avatarBlob;
let index = -1;
messages = [];

const messTypes = {
    0: 'Server',
    1: 'local',
    2: 'Global',
    3: 'Notification'
}

function insertIntoChat(type, id, user, content, timestamp, avatar) {
    const date = new Date(timestamp);

    //Initializing chatItem parts
    let chatItem = document.createElement('div');
    let message = document.createElement('div');
    let messInfos = document.createElement('div');
    let avatarContainer = document.createElement('p');
    let author = document.createElement('p');
    let messContent = document.createElement('p');
    let messTime = document.createElement('p');
    let img = document.createElement('img');
    let marker;
    if(type != 1 && type != 0) {
        marker = document.createElement('p');
        marker.innerHTML = messTypes[type];
        marker.classList.add(['marker']);
        marker.classList.add(`${messTypes[type]}Marker`);
    }

    //setting classes of chatItem parts
    chatItem.classList.add('chatItem');
    avatarContainer.classList.add('avatar');
    author.classList.add('author');
    message.classList.add('message');
    messInfos.classList.add('messInfos');
    messContent.classList.add('content');
    messTime.classList.add('timestamp');
    mentionCheck = content.toLocaleLowerCase().split(' ');
    if(mentionCheck.indexOf(`@${remoteName}`.toLowerCase()) != -1 || mentionCheck.indexOf(`@${remoteId}`) != -1) {
        messContent.classList.add('highlight');
    }

    //setting values of chatItem parts
    img.src = avatar != null ? URL.createObjectURL(avatar) : 'defaultAvatar.png'
    author.innerHTML = type != 0 ? `(${id}) ${user}` : user;
    messContent.innerHTML = content;
    messTime.innerHTML = `${betterTime(date.getHours())}:${betterTime(date.getMinutes())}`;

    //combining chatItem
    messInfos.appendChild(author);
    if(type != 1 && type != 0)
        messInfos.appendChild(marker);
    message.appendChild(messInfos);
    message.appendChild(messContent);
    message.appendChild(messTime);
    avatarContainer.appendChild(img);
    chatItem.appendChild(avatarContainer);
    chatItem.appendChild(message);
    if($('#chat').children().length > maxLocalMessages) {
        $('#chat').children()[0].remove();
    }
    $('#chat').append(chatItem);
    URL.revokeObjectURL(avatar);
}

function betterTime(number) {
    return number < 10 ? `0${number}` : number;
}

function setPlayerData(id, name) {
    remoteId = id;
    remoteName = name;
}

function sendMessage(content) {
    messages.unshift(content);

    //set listener from server to send message from player

    if(content.startsWith('/')) {
        if(content.startsWith('/g') || content.startsWith('/G')) {
            const type = 2;
            content = content.substring(3);
            insertIntoChat(type, remoteId, remoteName, content, new Date(), avatarBlob);
        } else if (content.startsWith('/notify')) {
            const type = 3;
            content = content.substring(8);
            insertIntoChat(type, remoteId, remoteName, content, new Date(), avatarBlob);
        } else {
            insertIntoChat(0, null, 'Server', 'Wrong command', new Date(), null);
        }
    } else {
        insertIntoChat(1, remoteId, remoteName, content, new Date(), avatarBlob);
    }
}

function bindKeys() {

    //connect this to "/setAvatar" command

    imageUrl = prompt('Give me some direct image URL');
    if(imageUrl != '') {
        image = new Image();
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        image.onload = function () {
            console.log('Done loading');
            canvas.height = 100;
            canvas.width = 100;
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 100, 100);
            ctx.canvas.toBlob(function(blob) {
                avatarBlob = blob; //Your DB needs to store only this one value to create avatar.
            });
        }
        image.crossOrigin = "";
        image.src = imageUrl;
    } else {
        avatarBlob = null;
    }



    document.onkeyup = function(e) {
        console.log(e.key);
        if(e.key == 't' || e.key == 'T') {
            $('#chatInputContainer').removeClass('hidden');
            $('#chatInput').focus();
        } else if(e.key == 'Escape') {
            $('#chatInputContainer').addClass('hidden');
        } else if(e.key == 'Enter') {
            $('#chatInputContainer').addClass('hidden');
            if($('#chatInput').val() != '' && !$('#chatInput').val().startsWith(' ')) {
                sendMessage($('#chatInput').val());
            }
            $('#chatInput').val('');
            index == -1;
        } else if(e.key == 'ArrowUp') {
            if(index + 1 < messages.length) {
                index++;
                $('#chatInput').val(messages[index]);
            }
        } else if(e.key == 'ArrowDown') {
            if(index >= 0) {
                index--;
                $('#chatInput').val(messages[index]);
            } else if(index == -1) {
                $('#chatInput').val('');
            }
        }
    };
}