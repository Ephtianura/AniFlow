type Props = {
    watchTime: string;
    averageScore: number;
};

export function UserStatsRow({ watchTime, averageScore }: Props) {
    return (
        <div className="flex justify-between text-md">
            <div>
                <span className="text-gray-dark">Час за переглядом: </span>
                <span className="text-primary-black">{watchTime}</span>
            </div>
            <div>
                <span className="text-gray-dark">Середній бал: </span>
                <span className="text-primary-black">
                    {averageScore.toFixed(1)}
                </span>
            </div>
        </div>
    );
}