function BasicCard({
  title,
  content,
  contentClassName,
  footer,
  footerClassName,
}: {
  title: string;
  content: React.ReactNode;
  contentClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl">{title}</h2>
      <article className={`flex flex-col ${contentClassName}`}>
        {content}
      </article>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

export default BasicCard;
