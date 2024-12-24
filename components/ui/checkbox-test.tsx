"use client"

import React, { useState } from "react"

interface TagGroup {
  title: string;
  tags: string[];
  color: string;
}

interface Props {
  onIsActive: (active: string[]) => void;
  tags: TagGroup[];
}

export default function DynamicCheckbox({ onIsActive, tags }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleCheckboxChange = (item: string) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item]

    setSelectedItems(updatedItems)
    onIsActive(updatedItems)
  }

  const getColorForItem = (item: string): string => {
    for (const tag of tags) {
      if (tag.tags.includes(item)) {
        return tag.color
      }
    }
    return 'gray'
  }

  if (tags.length === 0) {
    return <div className="text-center py-4">No tags available</div>
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white rounded">
          {selectedItems.map((item) => {
            const color = getColorForItem(item)
            return (
              <span
                key={item}
                className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium`}
                style={{ backgroundColor: color, color: 'white' }}
              >
                {item}
                <button
                  className="ml-1 hover:bg-opacity-80 rounded-full p-0.5"
                  onClick={() => handleCheckboxChange(item)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Remove {item}</span>
                </button>
              </span>
            )
          })}
        </div>
      )}
      {tags.map((tagGroup, index) => (
        <div key={index} className="space-y-2 ml-5 border-t border-neutral-200 pt-4">
          <h2 className="text-neutral-700 font-bold text-2xl">{tagGroup.title}</h2>
          {tagGroup.tags.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={item}
                  checked={selectedItems.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={item} className="ml-2 block font-medium text-gray-900 cursor-pointer">
                  {item}
                </label>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}