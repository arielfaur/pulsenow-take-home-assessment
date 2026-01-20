/**
 * Simple card wrapper with a title and content slot.
 * @param {object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
const SectionCard = ({ title, children, className = '' }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow dark:bg-gray-950 dark:shadow-none dark:border dark:border-gray-800 ${className}`}
  >
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
)

export default SectionCard
