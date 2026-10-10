import type { TablerIcon } from '@tabler/icons-react'
import {
  IconRoute,
  IconTruck,
  IconAlertTriangle,
  IconThermometer,
  IconMapPin,
  IconChartBar,
  IconLayoutDashboard,
  IconInfoCircle,
  IconAlertCircle,
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconArrowUpRight,
  IconCheck,
  IconSearch,
  IconTemperature,
  IconPlus,
  IconMinus,
  IconMaximize,
} from '@tabler/icons-react'

export type IconName =
  | 'route'
  | 'truck'
  | 'alert-triangle'
  | 'thermometer'
  | 'map-pin'
  | 'chart-bar'
  | 'layout-dashboard'
  | 'info-circle'
  | 'alert-circle'
  | 'adjustments-horizontal'
  | 'chevron-down'
  | 'arrow-up-right'
  | 'check'
  | 'search'
  | 'temperature'
  | 'plus'
  | 'minus'
  | 'maximize'

const ICON_MAP: Record<string, TablerIcon> = {
  'route': IconRoute,
  'truck': IconTruck,
  'alert-triangle': IconAlertTriangle,
  'thermometer': IconThermometer,
  'map-pin': IconMapPin,
  'chart-bar': IconChartBar,
  'layout-dashboard': IconLayoutDashboard,
  'info-circle': IconInfoCircle,
  'alert-circle': IconAlertCircle,
  'adjustments-horizontal': IconAdjustmentsHorizontal,
  'chevron-down': IconChevronDown,
  'arrow-up-right': IconArrowUpRight,
  'check': IconCheck,
  'search': IconSearch,
  'temperature': IconTemperature,
  'plus': IconPlus,
  'minus': IconMinus,
  'maximize': IconMaximize,
}

export interface IconProps {
  name: IconName | string
  size?: number
  className?: string
}

export function Icon({ name, size = 17, className }: IconProps) {
  const Component = ICON_MAP[name]
  if (!Component) {
    if (import.meta.env.DEV) {
      throw new Error(`Unknown icon name: "${name}"`)
    }
    return null
  }
  return <Component size={size} className={className} color="currentColor" />
}

export default Icon
