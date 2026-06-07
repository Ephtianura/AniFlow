//using SixLabors.ImageSharp.Formats;
//using System.Net.Http;

//public async Task<string?> UploadImageFromUrlAsync(string url, string folder, CancellationToken ct = default)
//{
//    if (!Uri.TryCreate(url, UriKind.Absolute, out var validatedUri) ||
//        (validatedUri.Scheme != Uri.UriSchemeHttp && validatedUri.Scheme != Uri.UriSchemeHttps))
//    {
//        _logger.LogWarning("Некоректний або небезпечний URL: {Url}", url);
//        return null;
//    }

//    if (validatedUri.IsLoopback)
//    {
//        _logger.LogWarning("Спроба звернутися до loopback адреси заблокована: {Url}", url);
//        return null;
//    }

//    try
//    {
//        using var response = await _httpClient.GetAsync(validatedUri, HttpCompletionOption.ResponseHeadersRead, ct);

//        if (!response.IsSuccessStatusCode)
//        {
//            _logger.LogWarning("Сервер повернув код помилки: {StatusCode} для Url: {Url}", response.StatusCode, url);
//            return null;
//        }

//        var contentLength = response.Content.Headers.ContentLength;
//        const long maxFileSize = 10 * 1024 * 1024;
//        if (contentLength > maxFileSize)
//        {
//            _logger.LogWarning("Файл занадто великий ({Size} байт) для Url: {Url}", contentLength, url);
//            return null;
//        }

//        var contentType = response.Content.Headers.ContentType?.MediaType;
//        if (string.IsNullOrEmpty(contentType) || !contentType.StartsWith("image/"))
//        {
//            _logger.LogWarning("Вказаний Content-Type не є зображенням: {ContentType}", contentType);
//            return null;
//        }

//        Stream finalStream = await response.Content.ReadAsStreamAsync(ct);
//        MemoryStream? memoryStreamBackup = null;

//        try
//        {
//            if (!finalStream.CanSeek)
//            {
//                memoryStreamBackup = new MemoryStream();

//                byte[] buffer = new byte[8192];
//                int bytesRead;
//                long totalBytesRead = 0;

//                while ((bytesRead = await finalStream.ReadAsync(buffer, 0, buffer.Length, ct)) > 0)
//                {
//                    totalBytesRead += bytesRead;
//                    if (totalBytesRead > maxFileSize)
//                    {
//                        _logger.LogWarning("Розмір потоку перевищив ліміт під час копіювання. Url: {Url}", url);
//                        return null;
//                    }
//                    await memoryStreamBackup.WriteAsync(buffer, 0, bytesRead, ct);
//                }

//                finalStream = memoryStreamBackup;
//            }

//            IImageFormat format;
//            try
//            {
//                format = await Image.DetectFormatAsync(finalStream, ct);
//                if (format == null)
//                {
//                    _logger.LogWarning("Не вдалося визначити реальний формат зображення за сигнатурою файлу. Url: {Url}", url);
//                    return null;
//                }
//            }
//            catch (Exception ex)
//            {
//                _logger.LogWarning(ex, "Файл пошкоджений або не є валідним зображенням. Url: {Url}", url);
//                return null;
//            }

//            finalStream.Position = 0;

//            var ext = format.FileExtensions.FirstOrDefault();
//            if (string.IsNullOrEmpty(ext))
//            {
//                _logger.LogWarning("Не знайдено розширення для формату {FormatName}", format.Name);
//                return null;
//            }

//            var fileName = $"{Guid.NewGuid()}.{ext}";

//            return await UploadFileAsync(finalStream, fileName, folder);
//        }
//        finally
//        {
//            if (memoryStreamBackup != null)
//            {
//                await memoryStreamBackup.DisposeAsync();
//            }
//        }
//    }
//    catch (OperationCanceledException)
//    {
//        _logger.LogInformation("Завантаження зображення було скасовано за таймаутом. Url: {Url}", url);
//        return null;
//    }
//    catch (Exception ex)
//    {
//        _logger.LogError(ex, "Критична помилка при завантаженні зображення. Url: {Url}, Folder: {Folder}", url, folder);
//        return null;
//    }
//}
