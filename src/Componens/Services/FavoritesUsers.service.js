const keyUsers = 'fav-users';


const getFavUsers = () => {
    const data = localStorage.getItem(keyUsers);
    return data ? JSON.parse(data) : [];
};

const addSourceToUser = (userObj, source) => {
    let users = getFavUsers();
    const index = users.findIndex(u => u.username === userObj.username);

    if (index === -1) {
        const newUser = { ...userObj, sourcesUser: [source] };
        users.push(newUser);
    } else {
        if (!users[index].sourcesUser.includes(source)) {
            users[index].sourcesUser.push(source);
        }
    }

    localStorage.setItem(keyUsers, JSON.stringify(users));
};

const removeSourceFromUser = (username, source) => {
    let users = getFavUsers();
    const index = users.findIndex(u => u.username === username);

    if (index !== -1) {
        users[index].sourcesUser = users[index].sourcesUser.filter(s => s !== source);
    }

    localStorage.setItem(keyUsers, JSON.stringify(users));
};

const isSourceFavForUser = (username, source) => {
    const user = getFavUsers().find(u => u.username === username);
    return user ? user.sourcesUser.includes(source) : false;
};

export {
    getFavUsers,
    addSourceToUser,
    removeSourceFromUser,
    isSourceFavForUser
};
