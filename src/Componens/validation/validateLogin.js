export default  function validateLogin(username, password) {
    if (username.length < 3 || password.length < 8) {
        return {
            success: false,
            message: "Ім'я користувача та пароль повинні бути щонайменше 8 символів.",
        };
    }
    if (password.includes(" ")) {
        return {
            success: false,
            message: "Пароль не може містити пробіли.",
        }
    }
    if (username.length > 30 || password.length > 30) {
        return {
            success: false,
            message: "Ім'я користувача та пароль не повинні перевищувати 30 символів.",
        };
    }

    return { success: true };
}