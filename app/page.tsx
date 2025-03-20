import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">This is a Video Interview Platform</h1>
        <p className="text-lg text-gray-600 mb-8">
          Record your responses to the interview questions and review them thoroughly before submitting.
        </p>
        <Link
          href="/record"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
        >
          Start your Interview
        </Link>
      </div>
    </main>
  )
}

