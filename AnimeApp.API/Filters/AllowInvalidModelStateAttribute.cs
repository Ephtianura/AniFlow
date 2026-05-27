namespace AnimeApp.API.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class AllowInvalidModelStateAttribute : Attribute;
}