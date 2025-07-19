interface VideoGuideProps {
  title: string
  description: string
  videoId: string
  startTime?: number
  videoTitle?: string
}

const VideoGuide = ({
  title,
  description,
  videoId,
  startTime = 0,
  videoTitle
}: VideoGuideProps) => {
  const embedUrl =
    startTime > 0
      ? `https://www.youtube.com/embed/${videoId}?start=${startTime}`
      : `https://www.youtube.com/embed/${videoId}`

  return (
    <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          📺 {title}
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-4 max-w-2xl">
          {description}
        </p>
        <div className="relative w-full max-w-2xl">
          <iframe
            className="w-full aspect-video rounded-lg shadow-lg"
            src={embedUrl}
            title={videoTitle || title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
export default VideoGuide
