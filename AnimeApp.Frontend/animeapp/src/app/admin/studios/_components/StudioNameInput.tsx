type Props = {
    value: string;
    onChange: (val: string) => void;
};

export function StudioNameInput({ value, onChange }: Props) {
    return (
        <div>
            <label className="font-medium text-xl">Назва</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="btn-primary mt-1"
                placeholder="Назва студії"
            />
        </div>
    );
}