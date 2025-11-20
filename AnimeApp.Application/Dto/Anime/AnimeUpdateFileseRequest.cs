using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimeApp.Application.Dto.Anime
{
    public record AnimeUpdateFilesRequest(

         IFormFile? Poster,
         List<IFormFile>? Screenshots

         
    );
}
