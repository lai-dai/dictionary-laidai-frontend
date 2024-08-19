/**
 * Part of this code is taken from https://codesandbox.io/u/clauderic
 */
import React, {
  Fragment,
  forwardRef,
  useMemo,
  useState,
  HTMLAttributes,
  ReactElement,
} from 'react'
import {
  DndContext,
  DndContextProps,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragOverlayProps,
  defaultDropAnimationSideEffects,
  DraggableSyntheticListeners,
  Active,
  DropAnimation,
  DragEndEvent,
  UniqueIdentifier,
  DragStartEvent,
  SensorDescriptor,
} from '@dnd-kit/core'
import {
  SortableContext,
  SortableContextProps,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  UseSortableArguments,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'
import { createContext } from '@/lib/utils/create-context'
import { mergeRefs } from '@/lib/hooks/use-merged-refs'

import { Button, ButtonProps } from '@/components/ui/button'

interface SortableListProps<TData extends Record<string, any>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  sensors?: (SensorDescriptor<any> | undefined | null)[]
  items?: TData[]
  idKey?: keyof TData
  children?: (item: TData, index: number, array: TData[]) => ReactElement
  onSortChange?: (items: TData[], form: number, to: number) => void
  dndContextProps?: DndContextProps
  sortableContextProps?: Omit<SortableContextProps, 'items'>
  dragOverlayProps?: DragOverlayProps
}

export const SortableList = forwardRef<
  HTMLDivElement,
  SortableListProps<Record<string, any>>
>(function SortableList(
  {
    sensors = [],
    items = [],
    idKey = 'id',
    children,
    onSortChange,
    dndContextProps,
    sortableContextProps,
    dragOverlayProps,
    className,
    ...props
  },
  ref
) {
  if (!(children instanceof Function)) {
    throw new Error('children must be Function')
  }

  const [active, setActive] = useState<Active | null>(null)

  const _sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    ...sensors
  )

  const activeItem = useMemo(() => {
    return items.find((item) => item?.[idKey] === active?.id)
  }, [active, items, idKey])

  const activeIndex = useMemo(() => {
    return items.findIndex((item) => item?.[idKey] === active?.id)
  }, [active, items, idKey])

  return (
    <DndContext
      sensors={_sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      {...dndContextProps}
    >
      <SortableContext
        items={items.map((item) => ({ id: item?.[idKey] }))}
        strategy={verticalListSortingStrategy}
        {...sortableContextProps}
      >
        <div
          ref={ref}
          role="application"
          className={cn('list-none', className)}
          {...props}
        >
          {items.map((item, index, arr) => (
            <Fragment key={item?.[idKey] || index}>
              {children(item, index, arr)}
            </Fragment>
          ))}
        </div>
      </SortableContext>

      <SortableOverlay
        key={activeItem?.[idKey] || activeIndex}
        {...dragOverlayProps}
      >
        {activeItem ? children(activeItem, activeIndex, items) : null}
      </SortableOverlay>
    </DndContext>
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    setActive(active)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item[idKey] === active.id)
      const newIndex = items.findIndex((item) => item[idKey] === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)

      onSortChange?.(newItems, oldIndex, newIndex)
    }
    setActive(null)
  }

  function handleDragCancel() {
    setActive(null)
  }
})

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
}

export function SortableOverlay(props: DragOverlayProps) {
  return <DragOverlay dropAnimation={dropAnimationConfig} {...props} />
}

interface SortableItemContextParams {
  attributes: Record<string, any>
  listeners: DraggableSyntheticListeners
  setActivatorNodeRef(node: HTMLElement | null): void
}

const [SortableItemProvider, useSortableItemContext] =
  createContext<SortableItemContextParams>({
    attributes: {},
    listeners: undefined,
    setActivatorNodeRef() {},
  })

interface SortableItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  opts?: UseSortableArguments
  id: UniqueIdentifier
}

export const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  function SortableItem({ children, opts, style, id, ...props }, ref) {
    const {
      attributes,
      isDragging,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
    } = useSortable({
      id,
      ...opts,
    })
    return (
      <SortableItemProvider
        value={{
          attributes,
          listeners,
          setActivatorNodeRef,
        }}
      >
        <div
          ref={mergeRefs(ref, (r) => setNodeRef(r))}
          style={{
            opacity: isDragging ? 0.4 : undefined,
            transform: CSS.Translate.toString(transform),
            transition,
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </SortableItemProvider>
    )
  }
)

export const SortableDragTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function SortableDragTrigger({ children, className, ...props }, ref) {
    const { attributes, listeners, setActivatorNodeRef } =
      useSortableItemContext()

    return (
      <Button
        ref={mergeRefs(ref, (r) => setActivatorNodeRef(r))}
        className={cn('touch-none cursor-move', className)}
        suppressHydrationWarning
        {...attributes}
        {...listeners}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
