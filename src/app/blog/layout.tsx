// export default function BlogLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <article className="prose prose-zinc dark:prose-invert max-w-none">
//       {children}
//     </article>
//   );
// }

// export default function BlogLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <article
//       data-mdx-content
//       className="
//         prose prose-zinc dark:prose-invert max-w-none
//         [--tw-prose-links:theme(colors.blue.500)]
//         prose-a:underline prose-a:text-blue-400
//       "
//     >
//       {children}
//     </article>
//   )
// }

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
