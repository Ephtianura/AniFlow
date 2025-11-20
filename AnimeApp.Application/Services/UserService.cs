//using AnimeApp.Application.Contracts;
//using AnimeApp.Application.Dto.User;
//using AnimeApp.Application.Exceptions;
//using AnimeApp.Core.Contracts;
//using AnimeApp.Core.Filters;
//using AnimeApp.Core.Models;
//using FluentValidation;

//namespace AnimeApp.Application.Services
//{
//    public class UserService : IUserService
//    {
//        private readonly IUserRepository _users;
//        private readonly IValidator<UserUpdateDto> _updateValidator;
//        private readonly IPasswordHasher _passwordHasher;
//        private readonly IValidator<UserUpdateAdminDto> _adminUpdateValidator;
//        private readonly IValidator<UserFilter> _filterValidator;

//        public UserService
//            (
//            IUserRepository users, 
//            IPasswordHasher passwordHasher, 
//            IValidator<UserUpdateDto> updateValidator, 
//            IValidator<UserUpdateAdminDto> adminUpdateValidator, 
//            IValidator<UserFilter> filterValidator
//            )
//        {
//            _users = users;
//            _passwordHasher = passwordHasher;
//            _updateValidator = updateValidator;
//            _adminUpdateValidator = adminUpdateValidator;
//            _filterValidator = filterValidator;
//        }

//        // Отримати користувача по ID
//        public async Task<User> GetByIdAsync(Guid id)
//        {
//            return await GetUserByIdAsync(id);
//        }

//        // Отримати користувачів за філтрами
//        public async Task<PagedResult<User>> GetFilteredAsync(UserFilter filter)
//        {
//            await _filterValidator.ValidateAndThrowAsync(filter);

//            return await _users.GetFilteredAsync(filter);
//        }

//        // Оновити профіль користувача
//        public async Task UpdateProfileAsync(Guid id, UserUpdateDto request)
//        {
//            await _updateValidator.ValidateAndThrowAsync(request);

//            var user = await GetUserByIdAsync(id);
            
//            if (!string.IsNullOrEmpty(request.FullName) && request.FullName != user.FullName)
//                user.ChangeFullName(request.FullName);
//            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
//            {
//                var existing = await _users.GetByEmailAsync(request.Email.Trim().ToLower());
//                if (existing != null && existing.Id != id)
//                    throw new EmailAlreadyExistsException(request.Email);

//                user.ChangeEmail(request.Email.Trim().ToLower());
//            }
//            if (!string.IsNullOrEmpty(request.Password))
//                user.ChangePassword(_passwordHasher.Generate(request.Password));
//            if (!string.IsNullOrEmpty(request.Phone) && request.Phone != user.Phone)
//                user.ChangePhone(request.Phone);

//            await _users.UpdateAsync(user);
//        }

//        public async Task UserUpdateByAdminAsync(Guid id, UserUpdateAdminDto request)
//        {
//            await _adminUpdateValidator.ValidateAndThrowAsync(request);

//            var user = await GetUserByIdAsync(id);

//            if (!string.IsNullOrEmpty(request.FullName) && request.FullName != user.FullName)
//                user.ChangeFullName(request.FullName);
//            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
//            {
//                var existing = await _users.GetByEmailAsync(request.Email.Trim().ToLower());
//                if (existing != null && existing.Id != id)
//                    throw new EmailAlreadyExistsException(request.Email);

//                user.ChangeEmail(request.Email.Trim().ToLower());
//            }
//            if (!string.IsNullOrEmpty(request.Phone) && request.Phone != user.Phone)
//                user.ChangePhone(request.Phone);
//            if (request.Role.HasValue && request.Role != user.Role)
//                user.ChangeRole(request.Role.Value);

//            await _users.UpdateAsync(user);
//        }


//        // Видалити користувача
//        public async Task DeleteAsync(Guid id)
//        {
//            var user = await GetUserByIdAsync(id);
    
//            await _users.DeleteAsync(user);
//        }

//        // Отримати користувача по ID
//        public async Task<User> GetUserByIdAsync(Guid id)
//        {
//            var user = await _users.GetByIdAsync(id);
//            if (user == null)
//                throw new EntityNotFoundException("User", id);

//            return user;
//        }
//    }
//}
