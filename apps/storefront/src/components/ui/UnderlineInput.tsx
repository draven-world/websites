import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const UnderlineInput = forwardRef<HTMLInputElement, Props>(function UnderlineInput(
  { label, id, className = '', ...rest },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`underline-input ${className}`}
        {...rest}
      />
    </div>
  )
})

export default UnderlineInput
