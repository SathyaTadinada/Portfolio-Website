import clsx from 'clsx'

export default function YouTube({
    id,
    className,
}: {
    id: string
    className?: string
}) {
    return (
        <div
            className={clsx(
                'my-8',
                'overflow-hidden rounded-2xl',
                className
            )}
        >
            <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}
