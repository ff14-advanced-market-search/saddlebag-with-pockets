import Banner from '~/components/Common/Banner'

const ResearchPost2 = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Research Post 2
        </h1>
        <div className="prose prose-lg max-w-none">
          <p>Blog content coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default ResearchPost2
