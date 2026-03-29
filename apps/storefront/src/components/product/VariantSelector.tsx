'use client'

type Option = {
  id: string
  title: string
  values: Array<{ id: string; value: string }>
}

type Variant = {
  id: string
  title: string
  inventory_quantity: number
  options: Array<{ value: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Props = {
  options: Option[]
  variants: Variant[]
  selectedVariant: Variant
  onSelect: (variant: Variant) => void
}

export default function VariantSelector({ options, variants, selectedVariant, onSelect }: Props) {
  const selectedValues = selectedVariant.options.map((o) => o.value)

  function handleSelect(optionIndex: number, value: string) {
    const newValues = [...selectedValues]
    newValues[optionIndex] = value

    const match = variants.find((v) =>
      v.options.every((o, i) => o.value === newValues[i]),
    )

    if (match) {
      onSelect(match)
    }
  }

  return (
    <div className="space-y-5">
      {options.map((option, optionIndex) => {
        const uniqueValues = Array.from(new Set(option.values.map((v) => v.value)))

        return (
          <div key={option.id}>
            <label className="mb-2.5 block text-sm font-bold text-brand-900">
              {option.title}: <span className="font-normal text-brand-500">{selectedValues[optionIndex]}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueValues.map((value) => {
                const isSelected = selectedValues[optionIndex] === value
                const hasStock = variants.some(
                  (v) =>
                    v.options[optionIndex]?.value === value &&
                    v.inventory_quantity > 0,
                )

                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(optionIndex, value)}
                    disabled={!hasStock}
                    className={`border px-5 py-2.5 text-[13px] font-medium transition-colors ${
                      isSelected
                        ? 'border-brand-900 bg-brand-900 text-white'
                        : hasStock
                          ? 'border-brand-200 text-brand-700 hover:border-brand-900'
                          : 'border-brand-100 text-brand-300 cursor-not-allowed line-through'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
