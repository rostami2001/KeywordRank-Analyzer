import { useFloating as useFloatingUI, autoUpdate, flip, offset, arrow } from '@floating-ui/vue'
import { computed } from 'vue'

const takeReferenceWidthMiddleware = {
  name: 'takeReferenceWidth',
  fn({ rects, elements, ...context }) {
    elements.floating.style.width = rects.reference.width + 'px'

    return { ...context, elements, rects }
  },
}

const DEFAULT_CONFIG = {
  offset: { x: 0, y: 4 },
  takeReferenceWidth: true,
  placement: 'bottom',
  strategy: 'absolute',
}

const computeArrowPositions = ({ x, y, offset = -4 }) => {
  const offsetInPx = `${offset}px`

  const positions = {
    left: {
      right: offsetInPx,
      top: y,
    },
    right: {
      left: offsetInPx,
      top: y,
    },
    top: {
      bottom: offsetInPx,
      left: x,
    },
    bottom: {
      top: offsetInPx,
      left: x,
    },
  }

  return positions
}

const useFloating = (referenceElement, floatingElement, config) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const context = useFloatingUI(referenceElement, floatingElement, {
    whileElementsMounted: autoUpdate,
    placement: mergedConfig.placement,
    strategy: mergedConfig.strategy,
    middleware: [
      offset(mergedConfig.offset.y, mergedConfig.offset.x),
      flip(),
      mergedConfig.takeReferenceWidth && takeReferenceWidthMiddleware,
      mergedConfig.arrow &&
        arrow({ element: mergedConfig.arrow?.element, padding: mergedConfig.arrow?.padding }),
    ],
  })

  const arrowStyles = computed(() => {
    const arrowMiddlewareData = context.middlewareData.value.arrow

    const x = arrowMiddlewareData?.x != null ? `${arrowMiddlewareData.x}px` : ''
    const y = arrowMiddlewareData?.y != null ? `${arrowMiddlewareData.y}px` : ''

    const positions = computeArrowPositions({ x, y, offset: mergedConfig.arrow?.offset })

    return {
      position: mergedConfig.strategy,
      ...positions[mergedConfig.placement],
    }
  })

  return { ...context, arrowStyles }
}

export default useFloating
