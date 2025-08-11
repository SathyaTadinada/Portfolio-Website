import clsx from 'clsx'

export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        'prose dark:prose-invert mt-8 text-zinc-600 dark:text-zinc-400 max-w-none',
        className
      )}
    />
  )
}
