// src/core/enums/relationKind.ts
export enum RelationKindEnum {
    Adaptation,
    AlternativeSetting,
    AlternativeVersion,
    Character,
    FullStory,
    Other,
    ParentStory,
    Prequel,
    Sequel,
    SideStory,
    SpinOff,
    Summary
}

export const RelationKindMap: Record<RelationKindEnum, { label: string; description: string }> = {
    [RelationKindEnum.Adaptation]: { label: "Адаптація", description: "Наприклад, аніме за мангою" },
    [RelationKindEnum.AlternativeSetting]: { label: "Альтернативний сеттинг", description: "Інша версія світу чи обстановки" },
    [RelationKindEnum.AlternativeVersion]: { label: "Альтернативна версія", description: "Інша інтерпретація історії" },
    [RelationKindEnum.Character]: { label: "Через персонажів", description: "Зв'язок через персонажів" },
    [RelationKindEnum.FullStory]: { label: "Повна історія", description: "Пов'язана повна версія історії" },
    [RelationKindEnum.Other]: { label: "Інше", description: "Не підпадає під категорії" },
    [RelationKindEnum.ParentStory]: { label: "Батьківська історія", description: "Оригінальна історія для спін-офу" },
    [RelationKindEnum.Prequel]: { label: "Передісторія", description: "Історія до основної" },
    [RelationKindEnum.Sequel]: { label: "Продовження", description: "Історія після основної" },
    [RelationKindEnum.SideStory]: { label: "Побічна історія", description: "Побічна історія" },
    [RelationKindEnum.SpinOff]: { label: "Спін-оф", description: "Окрема історія від основного сюжету" },
    [RelationKindEnum.Summary]: { label: "Резюме", description: "Короткий виклад сюжету" },
};