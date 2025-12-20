using AnimeApp.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimeApp.Application.Mapping
{
    public static class RelationKindMap
    {
        private static readonly Dictionary<RelationKindEnum, RelationKindEnum?> ReverseMap =
            new()
            {
            { RelationKindEnum.Sequel, RelationKindEnum.Prequel },
            { RelationKindEnum.Prequel, RelationKindEnum.Sequel },
            { RelationKindEnum.ParentStory, RelationKindEnum.SpinOff },
            { RelationKindEnum.SpinOff, RelationKindEnum.ParentStory },

            { RelationKindEnum.FullStory, RelationKindEnum.SideStory },

            { RelationKindEnum.SideStory, RelationKindEnum.FullStory },

            // Без зворотнього зв'язку
            { RelationKindEnum.Adaptation, null },
            { RelationKindEnum.AlternativeSetting, null },
            { RelationKindEnum.AlternativeVersion, null },
            { RelationKindEnum.Character, null },
            { RelationKindEnum.Other, null },
            { RelationKindEnum.Summary, null },
            };

        public static RelationKindEnum? GetReverse(RelationKindEnum relation)
            => ReverseMap[relation];
    }

}
