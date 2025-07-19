"use client"
import { useState } from 'react'
import axios from 'axios'

export default function AskForm() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    try {
      const form = new FormData()
      form.append("question", question)
      const res = await axios.post(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/ask/`,
  form,
  { timeout: 1800000 } // 30 menit = 30 * 60 * 1000
)
      setAnswer(res.data.response)
    } catch (err) {
      console.error(err)
      setAnswer("Gagal ambil jawaban 😵")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-xl space-y-3 bg-white shadow">
      <h2 className="font-semibold text-lg">🧠 Tanya ke AI</h2>
      <textarea
        rows={3}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full border p-2 rounded-lg"
        placeholder="Contoh: Siapa kandidat yang cocok jadi admin?"
      />
      <button onClick={handleAsk} className="bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-yellow-600">
        {loading ? "⏳ Menjawab..." : "Tanya"}
      </button>

      {answer && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-line">
          <strong>Jawaban AI:</strong><br />
          {answer}
        </div>
      )}
    </div>
  )
}
