import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Lightbulb,
  Quote,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

type CalloutType =
  | 'info'
  | 'important'
  | 'tip'
  | 'success'
  | 'question'
  | 'warning'
  | 'example'
  | 'quote'

interface CalloutConfig {
  icon: ReactNode
  defaultTitle: string
  borderColor: string
  backgroundColor: string
  textColor: string
  iconColor: string
}

const calloutConfig: Record<CalloutType, CalloutConfig> = {
  info: {
    icon: <Info className="h-4 w-4 flex-none" />,
    defaultTitle: 'Info',
    borderColor: 'border-blue-200 dark:border-blue-500/20',
    backgroundColor: 'bg-blue-50 dark:bg-blue-500/10',
    textColor: 'text-blue-950 dark:text-blue-100',
    iconColor: 'text-blue-600 dark:text-blue-300',
  },
  important: {
    icon: <AlertCircle className="h-4 w-4 flex-none" />,
    defaultTitle: 'Important',
    borderColor: 'border-red-200 dark:border-red-500/20',
    backgroundColor: 'bg-red-50 dark:bg-red-500/10',
    textColor: 'text-red-950 dark:text-red-100',
    iconColor: 'text-red-600 dark:text-red-300',
  },
  tip: {
    icon: <Lightbulb className="h-4 w-4 flex-none" />,
    defaultTitle: 'Tip',
    borderColor: 'border-yellow-200 dark:border-yellow-500/20',
    backgroundColor: 'bg-yellow-50 dark:bg-yellow-500/10',
    textColor: 'text-yellow-950 dark:text-yellow-100',
    iconColor: 'text-yellow-600 dark:text-yellow-300',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4 flex-none" />,
    defaultTitle: 'Success',
    borderColor: 'border-green-200 dark:border-green-500/20',
    backgroundColor: 'bg-green-50 dark:bg-green-500/10',
    textColor: 'text-green-950 dark:text-green-100',
    iconColor: 'text-green-600 dark:text-green-300',
  },
  question: {
    icon: <HelpCircle className="h-4 w-4 flex-none" />,
    defaultTitle: 'Question',
    borderColor: 'border-purple-200 dark:border-purple-500/20',
    backgroundColor: 'bg-purple-50 dark:bg-purple-500/10',
    textColor: 'text-purple-950 dark:text-purple-100',
    iconColor: 'text-purple-600 dark:text-purple-300',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 flex-none" />,
    defaultTitle: 'Warning',
    borderColor: 'border-amber-200 dark:border-amber-500/20',
    backgroundColor: 'bg-amber-50 dark:bg-amber-500/10',
    textColor: 'text-amber-950 dark:text-amber-100',
    iconColor: 'text-amber-600 dark:text-amber-300',
  },
  example: {
    icon: <Zap className="h-4 w-4 flex-none" />,
    defaultTitle: 'Example',
    borderColor: 'border-cyan-200 dark:border-cyan-500/20',
    backgroundColor: 'bg-cyan-50 dark:bg-cyan-500/10',
    textColor: 'text-cyan-950 dark:text-cyan-100',
    iconColor: 'text-cyan-600 dark:text-cyan-300',
  },
  quote: {
    icon: <Quote className="h-4 w-4 flex-none" />,
    defaultTitle: 'Quote',
    borderColor: 'border-slate-200 dark:border-slate-500/20',
    backgroundColor: 'bg-slate-50 dark:bg-slate-500/10',
    textColor: 'text-slate-950 dark:text-slate-100',
    iconColor: 'text-slate-600 dark:text-slate-300',
  },
}

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type] ?? calloutConfig.info
  const displayTitle = title ?? config.defaultTitle

  return (
    <div
      className={clsx(
        'not-prose mt-6 rounded-lg border px-4 py-3 text-sm',
        config.borderColor,
        config.backgroundColor,
        config.textColor,
      )}
    >
      <div className="flex gap-3">
        <div className={clsx('mt-0.5', config.iconColor)}>{config.icon}</div>
        <div className="flex-1">
          {displayTitle && <p className="m-0 font-medium">{displayTitle}</p>}
          <div className="mt-1 space-y-2 opacity-80 [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Callout
