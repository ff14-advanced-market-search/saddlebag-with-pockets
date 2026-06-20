import Banner from '~/components/Common/Banner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface WikiBlogProps {
  title: string
  markdown: string
}

const linkClass = 'text-blue-500 hover:underline'

const WikiBlog = ({ title, markdown }: WikiBlogProps) => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />
      <article className="bg-white shadow-md rounded p-6 md:p-10 prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}>
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt ?? ''}
                className="max-w-full h-auto rounded shadow"
              />
            )
          }}>
          {markdown}
        </ReactMarkdown>
      </article>
      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SaddlebagExchange. All rights
        reserved.
      </footer>
    </div>
  )
}

export default WikiBlog
