type Props = {
  subTitle?: string | null;
};

export function SubTitle({ subTitle }: Props) {
  if (!subTitle) return null;
  return (
    <p className="text-gray-dark text-xs line-clamp-1">{subTitle}</p>
  );
}