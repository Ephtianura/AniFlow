//using AnimeApp.Core.Contracts;
//using AnimeApp.Core.Filters;
//using AnimeApp.Core.Models;
//using Microsoft.EntityFrameworkCore;

//namespace AnimeApp.DataAccess.Repositories
//{
//    public class UserRepository : IUserRepository
//    {
//        private readonly AnimeAppDbContext _dbContext;
//        public UserRepository(AnimeAppDbContext db) => _dbContext = db;

//        public async Task<User?> GetByIdAsync(Guid id) =>
//            await _dbContext.Users.FindAsync(id);

//        public async Task<User?> GetByEmailAsync(string email)
//        {
//            return await _dbContext.Users
//                .FirstOrDefaultAsync(u => u.Email == email.ToLower());
//        }

//        public async Task<PagedResult<User>> GetFilteredAsync(UserFilter filter)
//        {
//            var query = _dbContext.Users.AsQueryable();

//            // 🔍 Пошук по імені або пошті
//            if (!string.IsNullOrWhiteSpace(filter.Search))
//            {
//                var term = filter.Search.Trim().ToLower();
//                query = query.Where(u =>
//                    u.FullName.ToLower().Contains(term) ||
//                    u.Email.ToLower().Contains(term));
//            }

//            // 🎭 Фільтр по ролі
//            if (filter.Role.HasValue)
//                query = query.Where(u => u.Role == filter.Role);

//            // 📅 Діапазон по датам реєстрації
//            if (filter.RegisteredFrom.HasValue)
//                query = query.Where(u => u.RegistrationDate >= filter.RegisteredFrom);
//            if (filter.RegisteredTo.HasValue)
//                query = query.Where(u => u.RegistrationDate <= filter.RegisteredTo);

//            // 🔽 Сортування
//            query = filter.SortBy?.ToLower() switch
//            {
//                "fullname" => filter.SortDesc ? query.OrderByDescending(u => u.FullName)
//                                              : query.OrderBy(u => u.FullName),
//                "email" => filter.SortDesc ? query.OrderByDescending(u => u.Email)
//                                           : query.OrderBy(u => u.Email),
//                "registrationdate" => filter.SortDesc ? query.OrderByDescending(u => u.RegistrationDate)
//                                                      : query.OrderBy(u => u.RegistrationDate),
//                _ => query.OrderBy(u => u.FullName) // За замовчуванням
//            };

//            // 📄 Пагінація
//            var totalCount = await query.CountAsync();
//            var items = await query
//                .Skip((filter.Page - 1) * filter.PageSize)
//                .Take(filter.PageSize)
//                .ToListAsync();

//            return new PagedResult<User>(items, totalCount, filter.Page, filter.PageSize);
//        }

//        public async Task AddAsync(User user)
//        {
//            await _dbContext.Users.AddAsync(user);
//            await _dbContext.SaveChangesAsync();
//        }

//        public async Task UpdateAsync(User user)
//        {
//            _dbContext.Users.Update(user);
//            await _dbContext.SaveChangesAsync();
//        }
//        public async Task DeleteAsync(User user)
//        {
//            _dbContext.Users.Remove(user);
//            await _dbContext.SaveChangesAsync();

//        }
//    }
//}


