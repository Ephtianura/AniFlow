export enum FriendshipStatus {
    None = "None",                 // Не друзі (показати "Додати в друзі")
    PendingFromMe = "PendingFromMe", // Я надіслав заявку (показати "Заявку надіслано" / "Скасувати")
    PendingToMe = "PendingToMe",     // Мені надійшла заявка (показати "Прийняти заявку")
    Friends = "Friends",             // Уже друзі (показати "Видалити з друзів")
    Me = "Me"                        // Мій власний профіль (кнопку не показувати)
}