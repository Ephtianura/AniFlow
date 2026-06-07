type Props = {
    value: string;
    onChange: (val: string) => void;
};

export function StudioDescription({ value, onChange }: Props) {
    return (
        <div className="border border-hr-clr p-4 rounded-lg bg-gray-50 ">
            <label className="text-xl font-medium">Опис</label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={4}
                className="btn-primary mt-1 max-h-100 min-h-25 transparent-scroll"
                placeholder="Опис студії"
            />
        </div>
    );
}