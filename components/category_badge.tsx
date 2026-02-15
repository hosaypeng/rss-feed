const CATEGORY_COLORS: Record<string, string> = {
  Tech: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  News: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Blog: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Podcast: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Uncategorized: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
}

export default function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Uncategorized

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}>
      {category}
    </span>
  )
}
