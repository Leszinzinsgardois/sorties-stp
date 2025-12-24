import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        Sorties MTP 🌴
      </h1>
      <p className="text-lg mb-8 text-center text-gray-600">
        Organise tes soirées étudiantes sans galère.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
        >
          Organisateur
        </Link>
        <button className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition">
          J'ai un code invité
        </button>
      </div>
    </main>
  )
}