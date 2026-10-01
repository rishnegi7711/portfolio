import type { ReactNode, Ref } from 'react'

type ContainerProps = {
  className?: string
  ref?: Ref<HTMLDivElement>
  children: ReactNode
}

/** The page's one column: side gutters on the outside, a max-width box on the inside.
 *  Header, hero and sections all use it, so their left edges line up at every width. */
function Container({ className = '', ref, children }: ContainerProps) {
  return (
    <div className="px-4 sm:px-6">
      <div ref={ref} className={`mx-auto max-w-4xl ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default Container
