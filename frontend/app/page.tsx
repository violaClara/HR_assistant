import UploadForm from '@/components/UploadForm'
import AskForm from '@/components/AskForm'

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-bold text-blue-600">TBASH Referral Assistant</h1>
      <UploadForm />
      <AskForm />
    </main>
  )
}
