using AnimeApp.Core.Enums;

namespace AnimeApp.Core.Models
{

    public class UserFriend
    {
        public UserFriend() { }

        // Хто
        public int SenderId { get; private set; }
        public User Sender { get; private set; } = null!;

        // Кому
        public int ReceiverId { get; private set; }
        public User Receiver { get; private set; } = null!;

        public FriendStatus Status { get; private set; }

        public DateTime CreatedAt { get; private set; }
        public DateTime? AcceptedAt { get; private set; }

        public static UserFriend Create(int senderId, int receiverId)
        {
            if (senderId == receiverId)
                throw new ArgumentException("Неможливо додати себе в друзі.");

            return new UserFriend
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Status = FriendStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
        }

        public void Accept(int userId)
        {
            if (userId != ReceiverId)
                throw new ArgumentException("Прийняти заявку може лише отримувач.");

            if (Status != FriendStatus.Pending)
                throw new ArgumentException("Заявка вже оброблена.");

            Status = FriendStatus.Accepted;
            AcceptedAt = DateTime.UtcNow;
        }

    }
}
