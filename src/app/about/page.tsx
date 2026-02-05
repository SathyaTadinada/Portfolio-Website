import { type Metadata } from 'next'
import Image from 'next/image'

import { Container } from '@/components/Container'
import {
  JavaIcon,
  PythonIcon,
  RustIcon,
  JavaScriptIcon,
  TypeScriptIcon,
  CPlusPlusIcon,
  PyTorchIcon,
  NextJSIcon,
  FlutterIcon,
  CSharpIcon,
  CIcon,
  RIcon,
  SQLIcon,
} from '@/components/CodingIcons'
import portraitImage from '@/images/portrait.jpg'

import {
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

function QuickNavChips() {
  const items = [
    { href: '#experience', label: 'Experience',    Icon: BriefcaseIcon,  color: 'blue'  },
    { href: '#education',  label: 'Education',     Icon: AcademicCapIcon, color: 'green' },
    { href: '#tech',       label: 'Tech',          Icon: CodeBracketIcon, color: 'purple'},
    { href: '#certs',      label: 'Certifications',Icon: CheckBadgeIcon, color: 'amber' },
    { href: '#fun',        label: 'Fun Facts',     Icon: SparklesIcon,    color: 'pink'  },
  ] as const

  const COLOR: Record<string, { light: string; dark: string }> = {
    blue: {
      light: 'hover:bg-blue-100 hover:text-blue-800 hover:ring-blue-300 focus-visible:ring-blue-400/60',
      dark:  'dark:hover:bg-blue-400/10 dark:hover:text-blue-200 dark:hover:ring-blue-300/40',
    },
    green: {
      light: 'hover:bg-green-100 hover:text-green-800 hover:ring-green-300 focus-visible:ring-green-400/60',
      dark:  'dark:hover:bg-green-400/10 dark:hover:text-green-200 dark:hover:ring-green-300/40',
    },
    purple: {
      light: 'hover:bg-purple-100 hover:text-purple-800 hover:ring-purple-300 focus-visible:ring-purple-400/60',
      dark:  'dark:hover:bg-purple-400/10 dark:hover:text-purple-200 dark:hover:ring-purple-300/40',
    },
    amber: {
      light: 'hover:bg-amber-100 hover:text-amber-800 hover:ring-amber-300 focus-visible:ring-amber-400/60',
      dark:  'dark:hover:bg-amber-400/10 dark:hover:text-amber-200 dark:hover:ring-amber-300/40',
    },
    pink: {
      light: 'hover:bg-pink-100 hover:text-pink-800 hover:ring-pink-300 focus-visible:ring-pink-400/60',
      dark:  'dark:hover:bg-pink-400/10 dark:hover:text-pink-200 dark:hover:ring-pink-300/40',
    },
  }

  return (
    <div className="mt-6">
      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Jump to
      </p>
      <ul className="mt-2 flex flex-wrap gap-3">
        {items.map(({ href, label, Icon, color }) => {
          const { light, dark } = COLOR[color]
          return (
            <li key={href}>
              <a
                href={href}
                className={[
                  'group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                  'backdrop-blur-sm dark:backdrop-blur-none',
                  
                  'bg-zinc-100 ring-1 ring-inset ring-zinc-300 text-zinc-700',
                  'dark:bg-zinc-800/60 dark:ring-white/10 dark:text-zinc-200',

                  'focus:outline-none focus-visible:ring-2',

                  light,
                  dark,
                ].join(' ')}
              >
                {/* icon follows text color on hover via text-current */}
                <Icon className="h-4 w-4 text-current" />
                <span className="text-current">{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Sathya Tadinada. I live in Salt Lake City, where I shape tomorrow’s potential.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Sathya Tadinada Portrait"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
          <QuickNavChips />
        </div>

        {/* Intro */}
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Sathya Tadinada.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              My journey in computer science started all the way back in middle school,
              when I first interacted with computers and realized their potential and
              usefulness as a vessel for creativity and problem-solving, along with
              providing a personal platform to solve any problems I came across in my
              day-to-day life. As such, I was very intrigued by the realm of software
              development as a professional parallel to my personal interests.
            </p>
            <p>
              In high school and college, I was introduced to the world of theoretical
              computer science (including the mathematical underpinnings of computation),
              which further solidified my interest in the field. I was particularly
              fascinated by the idea of using computers to solve complex problems and
              create new technologies that could leave a positive impact on the world.
              As a result, I’ve been very interested in pursuing any opportunities that
              allow me to study mathematics and theoretical computer science - along with
              the practical applications of these fields in software development.
            </p>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-28 mt-16 rounded-xl bg-zinc-50 dark:bg-zinc-800/25 p-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="h-7 w-7 text-blue-500" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Experience</h2>
        </div>

        <div className="mt-8 space-y-10 text-zinc-600 dark:text-zinc-400">
          {/* SPS Internship */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Software Engineering Intern: Select Portfolio Servicing
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">May 2025 – Present · Salt Lake City, UT</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-[15px] leading-relaxed">
              <li>Converted SAS code to SQL and Python for the Advance Continuation Model (ACM), replicating a full backward elimination regression model.</li>
              <li>Debugged and improved a real-time LLM-powered Call Summarization tool used in the company’s call center.</li>
            </ul>
          </div>

          {/* Teaching Assistant */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Undergraduate Teaching Assistant: Kahlert School of Computing
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Aug 2024 – Present · Salt Lake City, UT</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-[15px] leading-relaxed">
              <li>Graded exams and assignments in automata theory, Turing machines, and formal languages, offering detailed feedback to enhance understanding.</li>
              <li>Led weekly review sessions for 100+ students, resulting in a 15% increase in exam performance.</li>
            </ul>
          </div>

          {/* Ken Garff Esports */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Tech Track Mentor: Ken Garff Esports (Success in Education)
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Jul 2024 – Aug 2024 · West Valley City, UT</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-[15px] leading-relaxed">
              <li>Taught students foundational cybersecurity and software development using the GameMaker engine, culminating in two completed projects.</li>
              <li>Delivered four technology career seminars, boosting summer camp engagement by 25% and inspiring long-term interest in tech pathways.</li>
            </ul>
          </div>

          {/* HCC Research */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Undergraduate Research Assistant: Human-Centered Computing Lab
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Feb 2023 – Aug 2023 · Salt Lake City, UT</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-[15px] leading-relaxed">
              <li>Resolved code inconsistencies and improved code clarity by 25%, accelerating project delivery timelines.</li>
              <li>Synthesized qualitative data into eight actionable instructional recommendations, improving student code quality metrics by 10%.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education Section (shrunk to match Experience title sizes) */}
      <section id="education" className="scroll-mt-28 mt-16 rounded-xl bg-zinc-50 dark:bg-zinc-800/25 p-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <AcademicCapIcon className="h-7 w-7 text-green-500" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Education</h2>
        </div>

        <div className="mt-8 text-zinc-600 dark:text-zinc-400">
          {/* Match Experience item title size */}
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            University of Utah
          </h3>

          {/* Keep degrees on one line from sm and up; match Experience meta sizing */}
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">
            Honors B.S. Computer Science · B.S. Applied Mathematics · Minor in Psychology
          </p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Expected Graduation: May 2026
          </p>

          <div className="my-6 border-t border-dashed border-zinc-200 dark:border-zinc-700/50" />

          {/* Columns (unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div>
              <h4 className="text-base font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-100">
                GPA &amp; Honors
              </h4>
              <p className="mt-2 text-sm leading-relaxed">
                GPA: 3.98 · Dean’s List
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-100">
                Relevant Coursework
              </h4>
              <p className="mt-2 text-sm leading-relaxed">
                Data Structures &amp; Algorithms, Software Practice I–II, Discrete Mathematics, Linear Algebra,
                Models of Computation, Computer Systems, Number Theory
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-base font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-100">
              Notable Projects
            </h4>
            <ul className="mt-2 list-disc list-inside space-y-1.5 text-sm leading-relaxed">
              <li>Built a spreadsheet app with C# + MAUI using the MVC pattern.</li>
              <li>Developed a C# chat application using HTTPS/TCP.</li>
              <li>Implemented a multiplayer snake game (networking &amp; sockets).</li>
              <li>Wrote a fully functional custom malloc in C.</li>
            </ul>
          </div>
        </div>
      </section>



      {/* Proficient Technologies Section */}
      <section id="tech" className="mt-16 rounded-xl bg-zinc-50 dark:bg-zinc-800/25 p-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <CodeBracketIcon className="h-7 w-7 text-purple-500" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Proficient Technologies</h2>
        </div>

        {/* ↓ gap is a bit tighter on mobile to give labels more room */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 text-zinc-700 dark:text-zinc-300">
          <div className="flex min-w-0 items-center space-x-3">
            <JavaIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Java</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <RustIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Rust</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <PythonIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Python</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <TypeScriptIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              TypeScript
            </span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <CIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">C</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <CPlusPlusIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">C++</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <CSharpIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">C#</span>
          </div>
          
          <div className="flex min-w-0 items-center space-x-3">
            <SQLIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">SQL</span>
          </div>
          
          <div className="flex min-w-0 items-center space-x-3">
            <RIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">R</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <NextJSIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Next.js</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <FlutterIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Flutter</span>
          </div>

          <div className="flex min-w-0 items-center space-x-3">
            <PyTorchIcon className="h-6 w-6 flex-none fill-zinc-700 dark:fill-zinc-200 transition" />
            <span className="min-w-0 wrap-break-word text-sm sm:text-base text-zinc-600 dark:text-zinc-400">PyTorch</span>
          </div>
        </div>
      </section>


      {/* Certifications Section */}
      <section id="certs" className="mt-16 rounded-xl bg-zinc-50 dark:bg-zinc-800/25 p-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <CheckBadgeIcon className="h-7 w-7 text-yellow-500" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Certifications</h2>
        </div>
        <ul className="mt-6 list-disc list-inside space-y-2 text-base text-zinc-600 dark:text-zinc-400">
          <li>MTA: Introduction to Programming Using Java (Microsoft)</li>
        </ul>
      </section>

      {/* Fun Facts Section */}
      <section id="fun" className="scroll-mt-28 mt-16 rounded-xl bg-zinc-50 dark:bg-zinc-800/25 p-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-7 w-7 text-pink-500" />
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Fun Facts</h2>
        </div>
        <ul className="mt-6 list-disc list-inside space-y-2 text-base text-zinc-600 dark:text-zinc-400">
          <li>I compose music and play badminton in my free time.</li>
          <li>I enjoy watching TV shows and movies.</li>
          <li>I love traveling!</li>
        </ul>
      </section>
    </Container>
  )
}


// function Proficiency({ level = 3 }: { level?: 1 | 2 | 3 }) {
//   return (
//     <div className="mt-1 flex gap-1" aria-label={`Proficiency ${level} of 3`}>
//       {[0, 1, 2].map(i => (
//         <span
//           key={i}
//           className={clsx(
//             'h-1.5 w-3 rounded-full transition',
//             i < level
//               ? 'bg-blue-500/80 dark:bg-blue-400/80'
//               : 'bg-zinc-300 dark:bg-zinc-700'
//           )}
//         />
//       ))}
//     </div>
//   )
// }

// function TechBadge({
//   icon: Icon,
//   label,
//   href,
//   level = 3,
// }: {
//   icon: React.ComponentType<{ className?: string }>
//   label: string
//   href?: string
//   level?: 1 | 2 | 3
// }) {
//   const Inner = (
//     <div
//       className="group relative flex items-center gap-3 rounded-lg bg-white/60 p-3 shadow-sm ring-1 ring-inset ring-zinc-900/5
//                  dark:bg-white/5 dark:ring-white/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
//     >
//       {/* gradient “glow” on hover */}
//       <span className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100
//                        bg-gradient-to-tr from-blue-500/15 via-cyan-400/10 to-emerald-400/15" />

//       <span className="grid h-9 w-9 place-content-center rounded-md bg-zinc-100 ring-1 ring-zinc-900/5 shadow
//                        dark:bg-zinc-800 dark:ring-white/10">
//         {/* both stroke & fill icons look good with these classes */}
//         <Icon className="h-5 w-5 text-zinc-600 fill-zinc-600 dark:text-zinc-200 dark:fill-zinc-200 transition group-hover:scale-105" />
//       </span>

//       <div className="relative">
//         <div className="font-medium text-zinc-800 dark:text-zinc-100">{label}</div>
//         <Proficiency level={level} />
//       </div>
//     </div>
//   )

//   return (
//     <li>
//       {href ? (
//         <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
//           {Inner}
//         </a>
//       ) : (
//         Inner
//       )}
//     </li>
//   )
// }

// function StrengthPills() {
//   const items = [
//     { Icon: ChartBarIcon,  label: 'Data Analytics' },
//     { Icon: Cog6ToothIcon, label: 'Backend Systems' },
//     { Icon: CpuChipIcon,   label: 'ML / AI' },
//     { Icon: SparklesIcon,  label: 'UX-minded' },
//   ]

//   return (
//     <div className="mt-6">
//       <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
//         Core strengths
//       </p>
//       <ul className="mt-2 flex flex-wrap gap-3">
//         {items.map(({ Icon, label }) => (
//           <li key={label}>
//             <span
//               title={label}
//               aria-label={label}
//               className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm
//                          bg-white/60 ring-1 ring-inset ring-zinc-900/5 backdrop-blur
//                          dark:bg-white/5 dark:ring-white/10
//                          hover:-translate-y-0.5 hover:shadow-md transition"
//             >
//               <Icon className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
//               <span className="text-zinc-700 dark:text-zinc-200">{label}</span>
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// function DashedDivider({ padding }: { padding: number }) {
//   if (padding === 0) {
//     return (
//       <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
//       </ul>
//     )
//   } else if (padding === 4) {
//     return (
//       <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
//         <div></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-4"></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-4"></div>
//         <div></div>
//       </ul>
//     )
//   } else if (padding === 6) {
//     return (
//       <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
//         <div></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-6"></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-6"></div>
//         <div></div>
//       </ul>
//     )
//   } else if (padding === 8) {
//     return (
//       <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
//         <div></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
//         <div></div>
//       </ul>
//     )
//   } else {
//     return (
//       <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
//         <div></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-12"></div>
//         <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-12"></div>
//         <div></div>
//       </ul>
//     )
//   }
// }