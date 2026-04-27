import clsx from 'clsx'

export default function PDF({
  src,
  title = 'PDF Document',
  height = '80vh',
  className,
}: {
  src: string
  title?: string
  height?: string
  className?: string
}) {
  return (
    <div
      className={clsx(
        'my-8',
        'overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700',
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        className="w-full"
        style={{ height }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
