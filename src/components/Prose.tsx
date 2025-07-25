import clsx from 'clsx'

export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        // base typography
        'prose dark:prose-invert',

        // link text color (fixed)
        'prose-a:text-blue-500 dark:prose-a:text-blue-400',

        // base underline: thin + faded
        'prose-a:underline underline-offset-2 decoration-[1px]',
        'prose-a:decoration-blue-500/30 dark:prose-a:decoration-blue-400/30',

        // smooth per-link hover changes
        '[&_a]:transition-[text-decoration-thickness,text-decoration-color, color]',
        '[&_a]:duration-200 [&_a]:ease-out',
        '[&_a:hover]:decoration-blue-700 dark:[&_a:hover]:decoration-blue-400',
        '[&_a:hover]:text-blue-700 dark:[&_a:hover]:text-blue-400',

        // backup: override typography vars
        '[--tw-prose-links:theme(colors.blue.500)]',
        'dark:[--tw-prose-invert-links:theme(colors.blue.400)]',

        className
      )}
    />
  )
}
