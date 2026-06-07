type Props = {
  subTitle?: string | null;
  className?: string;
};

export function SubTitle({ subTitle, className }: Props) {
  if (!subTitle) return null;
  return (
    <p className={`text-gray-dark text-xs line-clamp-1 ${className}`}>
      {subTitle}
    </p>
  );
}