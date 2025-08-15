const key = 'fav-edition';

const keyUsers = 'fav-users';




const getFavEdition = () => {
    if (!localStorage.getItem(key)) {
        return [];
    }
    return JSON.parse(localStorage.getItem(key));
};

const addEditionToFav = (name) => {
    let arr = [...getFavEdition(), name];
    localStorage.setItem(key, JSON.stringify(arr));
};

const removeEditionFromFav = (name) => {
    let arr = getFavEdition();
    arr = arr.filter(i => i !== name); // було: i !== id (помилка!)
    localStorage.setItem(key, JSON.stringify(arr));
};

const toggleFavEdition = (name) => {
    if (isFavEdition(name)) {
        removeEditionFromFav(name);
    } else {
        addEditionToFav(name);
    }
};

const isFavEdition = (name) => {
    return getFavEdition().includes(name);
};

export {
    addEditionToFav,
    removeEditionFromFav,
    toggleFavEdition,
    getFavEdition,
    isFavEdition
};
