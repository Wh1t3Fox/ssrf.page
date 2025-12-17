import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline'

const typeConfig = {
  info: {
    icon: InformationCircleIcon,
    className: 'callout-info border-blue-500 bg-blue-900 bg-opacity-20',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    className: 'callout-warning border-yellow-500 bg-yellow-900 bg-opacity-20',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300',
  },
  danger: {
    icon: XCircleIcon,
    className: 'callout-danger border-red-500 bg-red-900 bg-opacity-20',
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
  success: {
    icon: CheckCircleIcon,
    className: 'callout-success border-green-500 bg-green-900 bg-opacity-20',
    iconColor: 'text-green-400',
    titleColor: 'text-green-300',
  },
  tip: {
    icon: LightBulbIcon,
    className: 'callout-tip border-purple-500 bg-purple-900 bg-opacity-20',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-300',
  },
}

export default function Callout({ type = 'info', title, icon, children }) {
  const config = typeConfig[type] || typeConfig.info
  const Icon = icon || config.icon

  return (
    <div className={`callout ${config.className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${config.iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h5 className={`text-sm font-semibold ${config.titleColor} mb-2`}>
              {title}
            </h5>
          )}
          <div className="text-sm text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
