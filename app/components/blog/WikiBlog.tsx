import Banner from '~/components/Common/Banner'
import { Link } from '@remix-run/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface WikiBlogProps {
  title: string
  markdown: string
}

const linkClass = 'text-blue-500 hover:underline break-words'

const isInternalLink = (href: string) =>
  href.startsWith('/') || href.startsWith('https://saddlebagexchange.com')

const WikiBlog = ({ title, markdown }: WikiBlogProps) => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />
      <article className="bg-white shadow-md rounded p-6 md:p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
          {title}
        </h1>
        <div className="wiki-blog-content text-gray-700 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-700">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside mb-4 ml-6 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside mb-4 ml-6 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-300 bg-blue-50 px-4 py-2 my-4 text-gray-700">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ) : (
                  <code className="font-mono text-sm text-gray-100">
                    {children}
                  </code>
                ),
              pre: ({ children }) => (
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 my-4 text-sm">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-gray-200 text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-100">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-200 px-3 py-2 align-top">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-8 border-gray-200" />,
              a: ({ href, children }) => {
                if (!href) return <span>{children}</span>

                if (href.startsWith('/')) {
                  return (
                    <Link to={href} className={linkClass}>
                      {children}
                    </Link>
                  )
                }

                const internal = isInternalLink(href)
                const normalizedHref = href.replace(
                  'https://saddlebagexchange.com',
                  ''
                )

                if (internal && normalizedHref.startsWith('/')) {
                  return (
                    <Link to={normalizedHref} className={linkClass}>
                      {children}
                    </Link>
                  )
                }

                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}>
                    {children}
                  </a>
                )
              },
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt ?? 'Guide screenshot'}
                  className="my-6 max-w-full h-auto rounded-lg shadow-md border border-gray-100"
                />
              )
            }}>
            {markdown}
          </ReactMarkdown>
        </div>
      </article>
      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SaddlebagExchange. All rights
        reserved.
      </footer>
    </div>
  )
}

export default WikiBlog
