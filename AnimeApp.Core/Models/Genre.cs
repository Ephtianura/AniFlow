namespace AnimeApp.Core.Models
{
    // ================= GENRES =================
    public class Genre 
    {
        private Genre() { }

        private Genre(string nameEn, string? nameUa = null, string? nameRu = null)
        {
            ChangeNameEn(nameEn);
            ChangeNameUa(nameUa);
            ChangeNameRu(nameRu);
        }

        public int Id { get; private set; }
        public string NameEn { get; private set; }
        public string? NameUa { get; private set; }
        public string? NameRu { get; private set; }


        // ================= Фабрика =================
        public static Genre Create(string nameEn, string? nameUa = null, string? nameRu = null)
        {
            return new Genre(nameEn, nameUa, nameRu);
        }

        // ================= Методи =================
        public void ChangeNameEn(string nameEn)
        {
            if (string.IsNullOrWhiteSpace(nameEn))
                throw new ArgumentException("English name cannot be empty", nameof(nameEn));

            NameEn = nameEn;
        }

        public void ChangeNameUa(string? nameUa)
        {
            NameUa = string.IsNullOrWhiteSpace(nameUa) ? null : nameUa;
        }

        public void ChangeNameRu(string? nameRu)
        {
            NameRu = string.IsNullOrWhiteSpace(nameRu) ? null : nameRu;
        }
    }

}